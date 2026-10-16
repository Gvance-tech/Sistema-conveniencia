# Backend – App de Gestão Offline (Festas, Fiado e Caixa)

Express + Knex + SQLite (módulo `node:sqlite` embutido no Node ≥ 22.13, sem compilação nativa), a partir do DBML. A regra de negócio fica em `src/core`
(funções que recebem a instância do Knex), então o **mesmo código** roda:

- no **Node**, atrás da API Express (para testar no Insomnia e desenvolver);
- dentro do **app Expo**, com `expo-sqlite` + Knex (modo offline de verdade).

## Rodando a API

```bash
npm install      # sem node-gyp/Python: não há dependência nativa
npm run dev        # http://localhost:3333 (cria o banco, roda migrations e seed sozinho)
npm test           # teste de fumaça com banco em memória
```

Outros: `npm run migrate`, `npm run rollback`, `npm run seed`. Porta: `PORT=4000 npm start`.

## Insomnia

`Application → Import → From File` → `insomnia/insomnia-gestao.json`.
No ambiente (Base Environment) ajuste `base_url` e os ids (`client_id`, `party_id`,
`debt_id`, `item_id`, `transaction_id`) conforme for criando os registros.
Emulador Android: use `http://10.0.2.2:3333`; celular físico: o IP da sua máquina.

## Endpoints

| Recurso | Rotas |
|---|---|
| Sistema | `GET /health` |
| Configurações | `GET /settings`, `GET /settings/:key`, `PUT /settings/:key` `{ "value": "dark" }` |
| Clientes | `GET/POST /clients` (`?type=&search=`), `GET/PUT/PATCH/DELETE /clients/:id` |
| Festas | `GET/POST /parties` (`?client_id=&status=&from=&to=`), `GET/PUT/PATCH/DELETE /parties/:id` |
| Transações | `GET/POST /transactions` (`?type=&category=&from=&to=&limit=&offset=`), `GET /transactions/summary`, `GET/PUT/PATCH/DELETE /transactions/:id` |
| Fiado | `GET/POST /debts` (`?client_id=&status=`), `GET/DELETE /debts/:id`, `POST /debts/:id/items`, `PUT/PATCH/DELETE /debts/:id/items/:itemId`, `POST /debts/:id/pay`, `POST /debts/:id/reopen` |

Erros vêm como `{ "error": "mensagem" }` com 400 (validação), 404 ou 409 (conflito).

## Regras de negócio implementadas

- **Cliente `href`** exige `cpf_rg` e `address`; `conhecido` (fiado) não.
- **Cliente com festas ou dívidas não pode ser removido** (409).
- **Festa:** `down_payment` ≤ `total_value`; status `agendada | realizada | pendente | paga` (padrão `agendada`).
  - Sinal > 0 gera automaticamente uma **receita** (categoria `Festas`).
  - Ao marcar como `paga`, é lançada uma receita com o **restante** (nunca duplica).
  - A resposta traz `paid` e `remaining`.
- **Dívida (fiado):** criada com os itens da notinha; `total_price = quantidade × preço` e
  `total_amount` é **sempre recalculado** a partir dos itens.
  - `POST /debts/:id/pay` marca como `quitado` e gera receita (categoria `Fiado`).
  - Dívida quitada não aceita alteração de itens; `reopen` desfaz o status e a receita.
- **Transações:** `GET /transactions/summary` devolve receitas, despesas, saldo e total por categoria.
- **Configurações:** `ui_mode` só aceita `light`, `dark` ou `system`.

## Decisões que vale conhecer

- No DBML, `description varchar [not model ...]` em `debt_items` era um typo; tratei como `not null`.
- `transactions.reference_id` aponta para festa **ou** dívida; a **categoria** (`Festas`/`Fiado`) diz qual. Não alterei o schema.
- Datas são salvas em ISO 8601 **UTC**. Valores em reais com 2 casas (arredondados no código).
- Remover festa/dívida também remove as transações automáticas ligadas a ela.
- Alterar `down_payment` depois de criar a festa não reescreve a transação do sinal.

## Usando no app Expo (offline)

Express **não roda dentro do app**; no celular você usa só o `core` + Knex direto no SQLite.

1. `npx expo install expo-sqlite` e `npm i knex @expo/knex-expo-sqlite-dialect`
2. Em `babel.config.js`, adicione o preset: `presets: ['babel-preset-expo', 'module:@expo/knex-expo-sqlite-dialect/babel-preset']`
3. Copie para o app, conforme o cabeçalho de `mobile/database.js`: `src/core`, `src/db/migrations`, `src/db/migrationSource.js`.
4. Chame `await initDatabase()` ao iniciar e use `core.clients.create(db, {...})`, etc.

⚠️ A parte do Expo não foi executada em dispositivo (só o lado Node foi testado). Se
`db.transaction` ou `migrate.latest` derem problema com o dialect, me mande o erro que ajusto.
