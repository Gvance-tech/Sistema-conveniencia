const { str, oneOf, int, money, date, range, applyRange, round2, insertId } = require('./validate');
const { badRequest, notFound } = require('./errors');
const { CAT_FESTAS } = require('./constants');

const STATUS = ['agendada', 'realizada', 'pendente', 'paga'];

function normalize(i) {
  const d = {
    client_id: int(i.client_id, 'client_id', { required: true }),
    party_date: date(i.party_date, 'party_date', { required: true }),
    package_type: str(i.package_type, 'package_type'),
    total_value: money(i.total_value, 'total_value', { required: true }),
    down_payment: money(i.down_payment, 'down_payment', { fallback: 0 }),
    status: oneOf(i.status, 'status', STATUS, { fallback: 'agendada' }),
  };
  if (d.down_payment > d.total_value) throw badRequest('down_payment não pode ser maior que total_value');
  return d;
}

async function requireClient(db, id) {
  if (!(await db('clients').where({ id }).first())) throw notFound('Cliente não encontrado');
}

async function paidSoFar(db, partyId) {
  const [{ total }] = await db('transactions')
    .where({ type: 'receita', category: CAT_FESTAS, reference_id: partyId })
    .sum({ total: 'amount' });
  return round2(total || 0);
}

// Ao marcar como paga: lança em transactions o que ainda falta receber.
async function settle(trx, id, totalValue) {
  const rest = round2(totalValue - (await paidSoFar(trx, id)));
  if (rest > 0) {
    await trx('transactions').insert({
      type: 'receita', category: CAT_FESTAS, amount: rest,
      description: `Pagamento da festa #${id}`, date: new Date().toISOString(), reference_id: id,
    });
  }
}

async function getById(db, id) {
  const row = await db('parties as p').join('clients as c', 'c.id', 'p.client_id')
    .select('p.*', 'c.name as client_name').where('p.id', id).first();
  if (!row) throw notFound('Festa não encontrada');
  const paid = await paidSoFar(db, id);
  return { ...row, paid, remaining: round2(row.total_value - paid) };
}

function list(db, f = {}) {
  const q = db('parties as p').join('clients as c', 'c.id', 'p.client_id')
    .select('p.*', 'c.name as client_name').orderBy('p.party_date', 'desc');
  if (f.client_id) q.where('p.client_id', int(f.client_id, 'client_id'));
  if (f.status) q.where('p.status', oneOf(f.status, 'status', STATUS));
  applyRange(q, 'p.party_date', range(f.from, f.to));
  return q;
}

async function create(db, input) {
  const d = normalize(input);
  await requireClient(db, d.client_id);
  return db.transaction(async (trx) => {
    const id = insertId(await trx('parties').insert(d));
    if (d.down_payment > 0) {
      await trx('transactions').insert({
        type: 'receita', category: CAT_FESTAS, amount: d.down_payment,
        description: `Sinal da festa #${id}`, date: new Date().toISOString(), reference_id: id,
      });
    }
    if (d.status === 'paga') await settle(trx, id, d.total_value);
    return getById(trx, id);
  });
}

async function update(db, id, input) {
  const old = await db('parties').where({ id }).first();
  if (!old) throw notFound('Festa não encontrada');
  const d = normalize({ ...old, ...input });
  await requireClient(db, d.client_id);
  return db.transaction(async (trx) => {
    await trx('parties').where({ id }).update(d);
    if (old.status !== 'paga' && d.status === 'paga') await settle(trx, id, d.total_value);
    return getById(trx, id);
  });
}

async function remove(db, id) {
  await getById(db, id);
  await db.transaction(async (trx) => {
    await trx('transactions').where({ category: CAT_FESTAS, reference_id: id }).del();
    await trx('parties').where({ id }).del();
  });
}

module.exports = { list, get: getById, create, update, remove };
