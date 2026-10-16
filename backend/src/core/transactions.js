const { str, oneOf, money, date, int, range, applyRange, round2, insertId } = require('./validate');
const { notFound } = require('./errors');

const TYPES = ['receita', 'despesa'];

function normalize(i) {
  return {
    type: oneOf(i.type, 'type', TYPES, { required: true }),
    category: str(i.category, 'category', { required: true }),
    amount: money(i.amount, 'amount', { required: true, positive: true }),
    description: str(i.description, 'description'),
    date: date(i.date, 'date', { fallbackNow: true }),
    reference_id: int(i.reference_id, 'reference_id'),
  };
}

async function get(db, id) {
  const row = await db('transactions').where({ id }).first();
  if (!row) throw notFound('Transação não encontrada');
  return row;
}

function list(db, f = {}) {
  const q = db('transactions').orderBy('date', 'desc').orderBy('id', 'desc');
  if (f.type) q.where({ type: oneOf(f.type, 'type', TYPES) });
  if (f.category) q.where({ category: f.category });
  applyRange(q, 'date', range(f.from, f.to));
  if (f.limit) q.limit(int(f.limit, 'limit')).offset(int(f.offset, 'offset', { min: 0 }) || 0);
  return q;
}

async function create(db, input) {
  return get(db, insertId(await db('transactions').insert(normalize(input))));
}

async function update(db, id, input) {
  const old = await get(db, id);
  await db('transactions').where({ id }).update(normalize({ ...old, ...input }));
  return get(db, id);
}

async function remove(db, id) {
  await get(db, id);
  await db('transactions').where({ id }).del();
}

async function summary(db, f = {}) {
  const r = range(f.from, f.to);
  const q = () => applyRange(db('transactions'), 'date', r);
  const byType = await q().select('type').sum({ total: 'amount' }).groupBy('type');
  const byCategory = await q().select('type', 'category').sum({ total: 'amount' }).groupBy('type', 'category').orderBy('total', 'desc');
  const sum = (t) => round2(byType.find((x) => x.type === t)?.total || 0);
  return {
    from: r.from,
    to: r.to,
    receitas: sum('receita'),
    despesas: sum('despesa'),
    saldo: round2(sum('receita') - sum('despesa')),
    por_categoria: byCategory.map((x) => ({ type: x.type, category: x.category, total: round2(x.total) })),
  };
}

module.exports = { list, get, create, update, remove, summary };
