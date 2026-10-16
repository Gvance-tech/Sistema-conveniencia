const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { AppError } = require('./core/errors');

module.exports = function createApp(db) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes(db));

  app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof AppError) return res.status(err.status).json({ error: err.message });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  });

  return app;
};
