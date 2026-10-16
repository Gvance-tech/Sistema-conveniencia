// Teste de fumaça: sobe a API com banco em memória e exercita as regras principais.
process.env.NODE_ENV = 'test';
const assert = require('assert');
const db = require('../src/db/connection');
const createApp = require('../src/app');
const { settings } = require('../src/core');

(async () => {
  await db.migrate.latest();
  await settings.ensureDefaults(db);
  const server = createApp(db).listen(0);
  const base = `http://localhost:${server.address().port}`;
  const call = async (method, path, body) => {
    const res = await fetch(base + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  };
  let n = 0;
  const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

  // settings
  ok((await call('GET', '/settings/ui_mode')).body.value === 'system', 'seed ui_mode');
  ok((await call('PUT', '/settings/ui_mode', { value: 'dark' })).body.value === 'dark', 'set dark');
  ok((await call('PUT', '/settings/ui_mode', { value: 'roxo' })).status === 400, 'ui_mode inválido');

  // clientes
  ok((await call('POST', '/clients', { name: 'Maria', type: 'href' })).status === 400, 'href exige cpf_rg/address');
  const maria = (await call('POST', '/clients', { name: 'Maria', type: 'href', cpf_rg: '123', address: 'Rua A, 1' })).body;
  const joao = (await call('POST', '/clients', { name: 'João', type: 'conhecido', phone: '1899' })).body;
  ok(maria.id && joao.id, 'clientes criados');
  ok((await call('GET', '/clients?type=href')).body.length === 1, 'filtro por tipo');

  // festas: sinal vira receita; pagar lança o restante
  const party = (await call('POST', '/parties', { client_id: maria.id, party_date: '2026-11-20T18:00:00-03:00', package_type: 'Premium', total_value: 1500, down_payment: 500 })).body;
  ok(party.status === 'agendada' && party.paid === 500 && party.remaining === 1000, 'festa com sinal');
  ok((await call('POST', '/parties', { client_id: maria.id, party_date: '2026-11-21', total_value: 100, down_payment: 200 })).status === 400, 'sinal > total');
  ok((await call('POST', '/parties', { client_id: 999, party_date: '2026-11-21', total_value: 100 })).status === 404, 'cliente inexistente');
  const paid = (await call('PATCH', `/parties/${party.id}`, { status: 'paga' })).body;
  ok(paid.paid === 1500 && paid.remaining === 0, 'pagar lança restante');
  ok((await call('PATCH', `/parties/${party.id}`, { status: 'paga' })).body.paid === 1500, 'pagar de novo não duplica');

  // fiado
  const debt = (await call('POST', '/debts', { client_id: joao.id, items: [
    { description: 'Refrigerante', quantity: 3, unit_price: 7.5 },
    { description: 'Salgados', quantity: 1, unit_price: 40 },
  ] })).body;
  ok(debt.total_amount === 62.5 && debt.items.length === 2, 'total da dívida = soma dos itens');
  const d2 = (await call('POST', `/debts/${debt.id}/items`, { description: 'Bolo', unit_price: 30 })).body;
  ok(d2.total_amount === 92.5, 'recalcula ao adicionar item');
  const d3 = (await call('PATCH', `/debts/${debt.id}/items/${d2.items[0].id}`, { quantity: 4 })).body;
  ok(d3.total_amount === 100, 'recalcula ao editar item');
  ok((await call('GET', `/clients/${joao.id}`)).body.open_debt_total === 100, 'open_debt_total no cliente');
  ok((await call('DELETE', `/clients/${joao.id}`)).status === 409, 'não remove cliente com dívida');
  const q = (await call('POST', `/debts/${debt.id}/pay`)).body;
  ok(q.status === 'quitado', 'quitar');
  ok((await call('POST', `/debts/${debt.id}/items`, { description: 'x', unit_price: 1 })).status === 409, 'dívida quitada é imutável');
  ok((await call('POST', `/debts/${debt.id}/pay`)).status === 409, 'não quita duas vezes');

  // transações + resumo
  await call('POST', '/transactions', { type: 'despesa', category: 'Despesa Fixa', amount: 300, description: 'Aluguel' });
  const sum = (await call('GET', '/transactions/summary')).body;
  ok(sum.receitas === 1600 && sum.despesas === 300 && sum.saldo === 1300, `resumo: ${JSON.stringify(sum)}`);
  ok((await call('GET', '/transactions?type=receita&category=Fiado')).body.length === 1, 'receita do fiado');

  // reabrir desfaz a receita
  await call('POST', `/debts/${debt.id}/reopen`);
  ok((await call('GET', '/transactions/summary')).body.receitas === 1500, 'reabrir remove receita');

  // remoções
  ok((await call('DELETE', `/debts/${debt.id}`)).status === 204, 'remove dívida');
  ok((await call('DELETE', `/parties/${party.id}`)).status === 204, 'remove festa');
  ok((await call('GET', '/transactions/summary')).body.receitas === 0, 'remove receitas ligadas');
  ok((await call('DELETE', `/clients/${joao.id}`)).status === 204, 'agora remove cliente');
  ok((await call('GET', '/nao-existe')).status === 404, '404');

  console.log(`OK — ${n} verificações passaram`);
  server.close();
  await db.destroy();
})().catch((e) => { console.error('FALHOU:', e.message); process.exit(1); });
