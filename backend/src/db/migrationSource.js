// Fonte de migrations sem acesso a arquivos (necessária no React Native/Expo,
// que não tem filesystem para o Knex varrer). No Node também funciona.
const m001 = require('./migrations/001_create_schema');

const all = { '001_create_schema.js': m001 };

module.exports = {
  getMigrations: async () => Object.keys(all),
  getMigrationName: (name) => name,
  getMigration: (name) => all[name],
};
