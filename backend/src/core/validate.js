const { badRequest } = require('./errors');

const empty = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

function str(v, field, { required = false } = {}) {
  if (empty(v)) {
    if (required) throw badRequest(`${field} é obrigatório`);
    return null;
  }
  if (typeof v !== 'string') throw badRequest(`${field} deve ser texto`);
  return v.trim();
}

function oneOf(v, field, list, { required = false, fallback = null } = {}) {
  if (empty(v)) {
    if (fallback) return fallback;
    if (required) throw badRequest(`${field} é obrigatório`);
    return null;
  }
  if (!list.includes(v)) throw badRequest(`${field} deve ser um de: ${list.join(', ')}`);
  return v;
}

function int(v, field, { required = false, min = 1 } = {}) {
  if (empty(v)) {
    if (required) throw badRequest(`${field} é obrigatório`);
    return null;
  }
  const n = Number(v);
  if (!Number.isInteger(n) || n < min) throw badRequest(`${field} deve ser um inteiro >= ${min}`);
  return n;
}

// positive=true -> > 0 ; positive=false -> >= 0
function money(v, field, { required = false, positive = false, fallback = null } = {}) {
  if (empty(v)) {
    if (fallback !== null) return fallback;
    if (required) throw badRequest(`${field} é obrigatório`);
    return null;
  }
  const n = Number(v);
  if (!Number.isFinite(n)) throw badRequest(`${field} deve ser um número`);
  if (positive ? n <= 0 : n < 0) throw badRequest(`${field} deve ser ${positive ? 'maior que' : 'maior ou igual a'} zero`);
  return round2(n);
}

// Datas são guardadas como ISO 8601 em UTC (ordenam corretamente como texto).
function date(v, field, { required = false, fallbackNow = false } = {}) {
  if (empty(v)) {
    if (fallbackNow) return new Date().toISOString();
    if (required) throw badRequest(`${field} é obrigatório`);
    return null;
  }
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw badRequest(`${field} não é uma data válida`);
  return d.toISOString();
}

// Filtro de período: 'to' apenas com dia (YYYY-MM-DD) vai até o fim do dia.
function range(from, to) {
  const f = empty(from) ? null : date(from, 'from');
  let t = null;
  if (!empty(to)) t = /^\d{4}-\d{2}-\d{2}$/.test(to) ? `${to}T23:59:59.999Z` : date(to, 'to');
  return { from: f, to: t };
}

const applyRange = (q, column, { from, to }) => {
  if (from) q.where(column, '>=', from);
  if (to) q.where(column, '<=', to);
  return q;
};

// better-sqlite3 devolve [id]; outros drivers podem devolver [{ id }]
const insertId = (res) => (typeof res[0] === 'object' ? res[0].id : res[0]);

module.exports = { str, oneOf, int, money, date, range, applyRange, round2, insertId };
