// Configuração do Knex. Use NODE_ENV=test para banco em memória.
require('fs').mkdirSync('./data', { recursive: true }); // a CLI do knex não passa por connection.js

const base = {
  client: require('./src/db/nodeSqliteDialect'), // SQLite embutido do Node, sem compilação
  useNullAsDefault: true,
  migrations: { directory: './src/db/migrations' },
  seeds: { directory: './src/db/seeds' },
  pool: {
    min: 1,
    max: 1,
    // SQLite só respeita chaves estrangeiras com este PRAGMA ligado
    afterCreate: (conn, done) => {
      conn.exec('PRAGMA foreign_keys = ON');
      done(null, conn);
    },
  },
};

module.exports = {
  development: { ...base, connection: { filename: './data/gestao.sqlite' } },
  production: { ...base, connection: { filename: process.env.DB_FILE || './data/gestao.sqlite' } },
  test: { ...base, connection: { filename: ':memory:' } },
};
