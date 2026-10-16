const { str, oneOf, int, money, round2, insertId } = require('./validate');
const { badRequest, notFound, conflict } = require('./errors');
const { CAT_FIADO } = require('./constants');

const STATUS = ['aberto', 'quitado'];

function normalizeItem(i) {
  const quantity = int(i.quantity ?? 1, 'quantity');
  const unit_price = money(i.unit_price, 'unit_price', { required: true });
  return {
    description: str(i.description, 'description', { required: true }),
    quantity,
    unit_price,
    total_price: round2(quantity * unit_price),
  };
}

async function getRow(db, id) {
  const row = await db('debts').where({ id }).first();
  if (!row) throw notFound('Dívida não encontrada');
  return row;
}

const requireOpen = (d) => {
  if (d.status === 'quitado') throw conflict('Dívida já quitada; reabra para alterar');
};

// total_amount é sempre a soma dos itens
async function recalc(trx, debtId) {
  const [{ total }] = await trx('debt_items').where({ debt_id: debtId }).sum({ total: 'total_price' });
  await trx('debts').where({ id: debtId }).update({
    total_amount: round2(total || 0),
    updated_at: trx.raw('CURRENT_TIMESTAMP'),
  });
}

async function get(db, id) {
  const row = await db('debts as d').join('clients as c', 'c.id', 'd.client_id')
    .select('d.*', 'c.name as client_name').where('d.id', id).first();
  if (!row) throw notFound('Dívida não encontrada');
  const items = await db('debt_items').where({ debt_id: id }).orderBy('id');
  return { ...row, items };
}

function list(db, f = {}) {
  const q = db('debts as d').join('clients as c', 'c.id', 'd.client_id')
    .select('d.*', 'c.name as client_name').orderBy('d.created_at', 'desc').orderBy('d.id', 'desc');
  if (f.client_id) q.where('d.client_id', int(f.client_id, 'client_id'));
  if (f.status) q.where('d.status', oneOf(f.status, 'status', STATUS));
  return q;
}

async function create(db, input) {
  const client_id = int(input.client_id, 'client_id', { required: true });
  if (!Array.isArray(input.items) || input.items.length === 0) throw badRequest('items deve ter ao menos um item');
  const items = input.items.map(normalizeItem);
  if (!(await db('clients').where({ id: client_id }).first())) throw notFound('Cliente não encontrado');
  return db.transaction(async (trx) => {
    const id = insertId(await trx('debts').insert({ client_id }));
    await trx('debt_items').insert(items.map((it) => ({ ...it, debt_id: id })));
    await recalc(trx, id);
    return get(trx, id);
  });
}

async function addItem(db, debtId, input) {
  requireOpen(await getRow(db, debtId));
  const item = normalizeItem(input);
  return db.transaction(async (trx) => {
    await trx('debt_items').insert({ ...item, debt_id: debtId });
    await recalc(trx, debtId);
    return get(trx, debtId);
  });
}

async function updateItem(db, debtId, itemId, input) {
  requireOpen(await getRow(db, debtId));
  const old = await db('debt_items').where({ id: itemId, debt_id: debtId }).first();
  if (!old) throw notFound('Item não encontrado');
  const item = normalizeItem({ ...old, ...input });
  return db.transaction(async (trx) => {
    await trx('debt_items').where({ id: itemId }).update(item);
    await recalc(trx, debtId);
    return get(trx, debtId);
  });
}

async function removeItem(db, debtId, itemId) {
  requireOpen(await getRow(db, debtId));
  const old = await db('debt_items').where({ id: itemId, debt_id: debtId }).first();
  if (!old) throw notFound('Item não encontrado');
  const [{ n }] = await db('debt_items').where({ debt_id: debtId }).count({ n: '*' });
  if (Number(n) === 1) throw conflict('A dívida precisa ter ao menos um item; remova a dívida inteira');
  return db.transaction(async (trx) => {
    await trx('debt_items').where({ id: itemId }).del();
    await recalc(trx, debtId);
    return get(trx, debtId);
  });
}

// Quitar: marca como quitado e lança a receita em transactions
async function pay(db, id) {
  const d = await getRow(db, id);
  requireOpen(d);
  return db.transaction(async (trx) => {
    await trx('debts').where({ id }).update({ status: 'quitado', updated_at: trx.raw('CURRENT_TIMESTAMP') });
    if (d.total_amount > 0) {
      await trx('transactions').insert({
        type: 'receita', category: CAT_FIADO, amount: d.total_amount,
        description: `Quitação do fiado #${id}`, date: new Date().toISOString(), reference_id: id,
      });
    }
    return get(trx, id);
  });
}

// Reabrir (corrigir engano): desfaz o status e a receita gerada
async function reopen(db, id) {
  const d = await getRow(db, id);
  if (d.status !== 'quitado') throw conflict('Dívida já está aberta');
  return db.transaction(async (trx) => {
    await trx('transactions').where({ category: CAT_FIADO, reference_id: id }).del();
    await trx('debts').where({ id }).update({ status: 'aberto', updated_at: trx.raw('CURRENT_TIMESTAMP') });
    return get(trx, id);
  });
}

async function remove(db, id) {
  await getRow(db, id);
  await db.transaction(async (trx) => {
    await trx('transactions').where({ category: CAT_FIADO, reference_id: id }).del();
    await trx('debt_items').where({ debt_id: id }).del();
    await trx('debts').where({ id }).del();
  });
}

module.exports = { list, get, create, addItem, updateItem, removeItem, pay, reopen, remove };
