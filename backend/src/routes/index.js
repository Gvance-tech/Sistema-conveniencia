const express = require('express');
const { settings, clients, parties, transactions, debts } = require('../core');
const { int } = require('../core/validate');

const id = (v, name = 'id') => int(v, name, { required: true });
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

module.exports = (db) => {
  const r = express.Router();

  r.get('/health', (req, res) => res.json({ ok: true }));

  // Configurações
  r.get('/settings', h(async (req, res) => res.json(await settings.list(db))));
  r.get('/settings/:key', h(async (req, res) => res.json(await settings.get(db, req.params.key))));
  r.put('/settings/:key', h(async (req, res) => res.json(await settings.set(db, req.params.key, req.body.value))));

  // Clientes
  r.get('/clients', h(async (req, res) => res.json(await clients.list(db, req.query))));
  r.post('/clients', h(async (req, res) => res.status(201).json(await clients.create(db, req.body))));
  r.get('/clients/:id', h(async (req, res) => res.json(await clients.get(db, id(req.params.id)))));
  r.route('/clients/:id')
    .put(h(async (req, res) => res.json(await clients.update(db, id(req.params.id), req.body))))
    .patch(h(async (req, res) => res.json(await clients.update(db, id(req.params.id), req.body))));
  r.delete('/clients/:id', h(async (req, res) => { await clients.remove(db, id(req.params.id)); res.status(204).end(); }));

  // Festas
  r.get('/parties', h(async (req, res) => res.json(await parties.list(db, req.query))));
  r.post('/parties', h(async (req, res) => res.status(201).json(await parties.create(db, req.body))));
  r.get('/parties/:id', h(async (req, res) => res.json(await parties.get(db, id(req.params.id)))));
  r.route('/parties/:id')
    .put(h(async (req, res) => res.json(await parties.update(db, id(req.params.id), req.body))))
    .patch(h(async (req, res) => res.json(await parties.update(db, id(req.params.id), req.body))));
  r.delete('/parties/:id', h(async (req, res) => { await parties.remove(db, id(req.params.id)); res.status(204).end(); }));

  // Transações (summary vem antes de /:id)
  r.get('/transactions/summary', h(async (req, res) => res.json(await transactions.summary(db, req.query))));
  r.get('/transactions', h(async (req, res) => res.json(await transactions.list(db, req.query))));
  r.post('/transactions', h(async (req, res) => res.status(201).json(await transactions.create(db, req.body))));
  r.get('/transactions/:id', h(async (req, res) => res.json(await transactions.get(db, id(req.params.id)))));
  r.route('/transactions/:id')
    .put(h(async (req, res) => res.json(await transactions.update(db, id(req.params.id), req.body))))
    .patch(h(async (req, res) => res.json(await transactions.update(db, id(req.params.id), req.body))));
  r.delete('/transactions/:id', h(async (req, res) => { await transactions.remove(db, id(req.params.id)); res.status(204).end(); }));

  // Fiado (dívidas + itens da notinha)
  r.get('/debts', h(async (req, res) => res.json(await debts.list(db, req.query))));
  r.post('/debts', h(async (req, res) => res.status(201).json(await debts.create(db, req.body))));
  r.get('/debts/:id', h(async (req, res) => res.json(await debts.get(db, id(req.params.id)))));
  r.delete('/debts/:id', h(async (req, res) => { await debts.remove(db, id(req.params.id)); res.status(204).end(); }));
  r.post('/debts/:id/items', h(async (req, res) => res.status(201).json(await debts.addItem(db, id(req.params.id), req.body))));
  const itemUpdate = h(async (req, res) => res.json(await debts.updateItem(db, id(req.params.id), id(req.params.itemId, 'itemId'), req.body)));
  r.route('/debts/:id/items/:itemId')
    .put(itemUpdate)
    .patch(itemUpdate)
    .delete(h(async (req, res) => res.json(await debts.removeItem(db, id(req.params.id), id(req.params.itemId, 'itemId')))));
  r.post('/debts/:id/pay', h(async (req, res) => res.json(await debts.pay(db, id(req.params.id)))));
  r.post('/debts/:id/reopen', h(async (req, res) => res.json(await debts.reopen(db, id(req.params.id)))));

  return r;
};
