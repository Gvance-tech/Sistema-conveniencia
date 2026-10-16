// Copie este arquivo para o app Expo como src/database/index.js
// Estrutura esperada no app:
//   src/database/index.js            <- este arquivo
//   src/database/core/               <- cópia de backend/src/core
//   src/database/migrations/         <- cópia de backend/src/db/migrations
//   src/database/migrationSource.js  <- cópia de backend/src/db/migrationSource.js
import Knex from 'knex';
import ExpoSQLiteDialect from '@expo/knex-expo-sqlite-dialect';
import migrationSource from './migrationSource';
import * as core from './core';

let db;

export function getDb() {
  if (!db) {
    db = Knex({
      client: ExpoSQLiteDialect,
      connection: { filename: 'gestao.db' },
      useNullAsDefault: true,
    });
  }
  return db;
}

// Chame uma vez ao iniciar o app (ex.: antes de renderizar a primeira tela).
export async function initDatabase() {
  const conn = getDb();
  await conn.raw('PRAGMA foreign_keys = ON');
  await conn.migrate.latest({ migrationSource });
  await core.settings.ensureDefaults(conn);
  return conn;
}

export { core };

// Uso:
//   const db = await initDatabase();
//   const cliente = await core.clients.create(db, { name: 'João', type: 'conhecido' });
//   const resumo  = await core.transactions.summary(db, { from: '2026-10-01', to: '2026-10-31' });
