const db = require('./db/connection');
const createApp = require('./app');
const { settings } = require('./core');

const PORT = process.env.PORT || 3000;

(async () => {
  await db.migrate.latest();
  await settings.ensureDefaults(db);
  createApp(db).listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
