// Dialect do Knex sobre o SQLite embutido do Node (node:sqlite, Node >= 22.13).
// Não precisa compilar nada (sem Python, sem Visual Studio, sem node-gyp).
// Reaproveita todo o dialect better-sqlite3 do Knex; só troca o driver.
const Client_BetterSQLite3 = require('knex/lib/dialects/better-sqlite3');
const { DatabaseSync } = require('node:sqlite');

class Client_NodeSqlite extends Client_BetterSQLite3 {
  _driver() {
    return DatabaseSync;
  }

  async acquireRawConnection() {
    const db = new DatabaseSync(this.connectionSettings.filename);
    // Interface mínima que o dialect do Knex espera (a mesma do better-sqlite3)
    return {
      exec: (sql) => db.exec(sql),
      pragma: (sql) => db.exec(`PRAGMA ${sql}`),
      close: () => db.close(),
      prepare: (sql) => {
        const stmt = db.prepare(sql);
        return {
          reader: stmt.columns().length > 0, // SELECT/PRAGMA com retorno
          all: (bindings) => stmt.all(...bindings),
          run: (bindings) => stmt.run(...bindings),
        };
      },
    };
  }
}

module.exports = Client_NodeSqlite;
