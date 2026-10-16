const { str, oneOf } = require('./validate');
const { notFound } = require('./errors');

const UI_MODES = ['light', 'dark', 'system'];
const DEFAULTS = { ui_mode: 'system' };

const list = (db) => db('settings').orderBy('key');

async function get(db, key) {
  const row = await db('settings').where({ key }).first();
  if (!row) throw notFound('Configuração não encontrada');
  return row;
}

async function set(db, key, value) {
  key = str(key, 'key', { required: true });
  value = str(typeof value === 'string' ? value : value == null ? null : String(value), 'value', { required: true });
  if (key === 'ui_mode') oneOf(value, 'value', UI_MODES, { required: true });
  await db('settings').insert({ key, value }).onConflict('key').merge();
  return get(db, key);
}

async function ensureDefaults(db) {
  for (const [key, value] of Object.entries(DEFAULTS)) {
    await db('settings').insert({ key, value }).onConflict('key').ignore();
  }
}

module.exports = { list, get, set, ensureDefaults };
