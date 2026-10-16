const { str, oneOf, insertId } = require('./validate');
const { badRequest, notFound, conflict } = require('./errors');

const TYPES = ['conhecido', 'href'];

function normalize(i) {
  const d = {
    name: str(i.name, 'name', { required: true }),
    type: oneOf(i.type, 'type', TYPES, { required: true }),
    phone: str(i.phone, 'phone'),
    cpf_rg: str(i.cpf_rg, 'cpf_rg'),
    address: str(i.address, 'address'),
    observation: str(i.observation, 'observation'),
  };
  if (d.type === 'href') {
    if (!d.cpf_rg) throw badRequest('cpf_rg é obrigatório para clientes do tipo href');
    if (!d.address) throw badRequest('address é obrigatório para clientes do tipo href');
  }
  return d;
}

async function getRow(db, id) {
  const row = await db('clients').where({ id }).first();
  if (!row) throw notFound('Cliente não encontrado');
  return row;
}

async function get(db, id) {
  const client = await getRow(db, id);
  const [{ total }] = await db('debts').where({ client_id: id, status: 'aberto' }).sum({ total: 'total_amount' });
  const [{ n }] = await db('parties').where({ client_id: id }).count({ n: '*' });
  return { ...client, open_debt_total: Number(total || 0), parties_count: Number(n) };
}

function list(db, { type, search } = {}) {
  const q = db('clients').orderBy('name');
  if (type) q.where({ type: oneOf(type, 'type', TYPES) });
  if (search) q.where((w) => w.where('name', 'like', `%${search}%`).orWhere('phone', 'like', `%${search}%`));
  return q;
}

async function create(db, input) {
  const id = insertId(await db('clients').insert(normalize(input)));
  return get(db, id);
}

async function update(db, id, input) {
  const old = await getRow(db, id);
  await db('clients').where({ id }).update(normalize({ ...old, ...input }));
  return get(db, id);
}

async function remove(db, id) {
  await getRow(db, id);
  const [{ p }] = await db('parties').where({ client_id: id }).count({ p: '*' });
  const [{ d }] = await db('debts').where({ client_id: id }).count({ d: '*' });
  if (Number(p) + Number(d) > 0) throw conflict('Cliente possui festas ou dívidas e não pode ser removido');
  await db('clients').where({ id }).del();
}

module.exports = { list, get, create, update, remove };
