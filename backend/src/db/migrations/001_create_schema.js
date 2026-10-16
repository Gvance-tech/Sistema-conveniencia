// Schema equivalente ao DBML. Funciona no Node (better-sqlite3) e no Expo (expo-sqlite).
exports.up = async (knex) => {
  await knex.schema.createTable('settings', (t) => {
    t.increments('id');
    t.string('key').notNullable().unique(); // ex: ui_mode
    t.string('value').notNullable(); // 'light' | 'dark' | 'system'
  });

  await knex.schema.createTable('clients', (t) => {
    t.increments('id');
    t.string('name').notNullable();
    t.string('type').notNullable().checkIn(['conhecido', 'href']);
    t.string('phone');
    t.string('cpf_rg'); // obrigatório para href (validado na API)
    t.text('address'); // obrigatório para href (validado na API)
    t.text('observation');
    t.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('parties', (t) => {
    t.increments('id');
    t.integer('client_id').notNullable().references('id').inTable('clients').onDelete('RESTRICT');
    t.datetime('party_date').notNullable();
    t.string('package_type');
    t.decimal('total_value', 10, 2).notNullable();
    t.decimal('down_payment', 10, 2).defaultTo(0);
    t.string('status').notNullable().checkIn(['agendada', 'realizada', 'pendente', 'paga']);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.index('client_id');
    t.index('party_date');
  });

  await knex.schema.createTable('transactions', (t) => {
    t.increments('id');
    t.string('type').notNullable().checkIn(['receita', 'despesa']);
    t.string('category').notNullable();
    t.decimal('amount', 10, 2).notNullable();
    t.text('description');
    t.datetime('date').notNullable();
    t.integer('reference_id'); // id da festa ou da notinha (a categoria diz qual)
    t.index('date');
    t.index(['category', 'reference_id']);
  });

  await knex.schema.createTable('debts', (t) => {
    t.increments('id');
    t.integer('client_id').notNullable().references('id').inTable('clients').onDelete('RESTRICT');
    t.decimal('total_amount', 10, 2).notNullable().defaultTo(0);
    t.string('status').notNullable().defaultTo('aberto').checkIn(['aberto', 'quitado']);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.index(['client_id', 'status']);
  });

  await knex.schema.createTable('debt_items', (t) => {
    t.increments('id');
    t.integer('debt_id').notNullable().references('id').inTable('debts').onDelete('CASCADE');
    t.string('description').notNullable();
    t.integer('quantity').notNullable().defaultTo(1);
    t.decimal('unit_price', 10, 2).notNullable();
    t.decimal('total_price', 10, 2).notNullable();
    t.index('debt_id');
  });
};

exports.down = async (knex) => {
  for (const table of ['debt_items', 'debts', 'transactions', 'parties', 'clients', 'settings']) {
    await knex.schema.dropTableIfExists(table);
  }
};
