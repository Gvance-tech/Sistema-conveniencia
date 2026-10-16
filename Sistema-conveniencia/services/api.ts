import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('conveniencia.db');

export const api = {
  initDatabase: () => {
    db.execSync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        phone TEXT,
        cpf_rg TEXT,
        address TEXT,
        observation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS parties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        party_date DATETIME NOT NULL,
        package_type TEXT,
        total_value DECIMAL(10,2) NOT NULL,
        down_payment DECIMAL(10,2) DEFAULT 0,
        status TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT,
        date DATETIME NOT NULL,
        reference_id INTEGER
      );

      CREATE TABLE IF NOT EXISTS debts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'aberto',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS debt_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        debt_id INTEGER NOT NULL,
        description TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (debt_id) REFERENCES debts (id) ON DELETE CASCADE
      );
    `);

    const settingCheck = db.getFirstSync('SELECT * FROM settings WHERE key = ?', ['ui_mode']) as any;
    if (!settingCheck) {
      db.runSync('INSERT INTO settings (key, value) VALUES (?, ?)', ['ui_mode', 'light']);
    }
  },

  getUiMode: (): string => {
    try {
      const result = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['ui_mode']) as { value: string } | null;
      return result ? result.value : 'light';
    } catch {
      return 'light';
    }
  },

  setUiMode: (mode: string) => {
    try {
      db.runSync(
        `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?`,
        ['ui_mode', mode, mode]
      );
    } catch (error) {
      console.error("Erro ao salvar ui_mode no SQLite:", error);
    }
  },

  getClients: () => {
    return db.getAllSync('SELECT * FROM clients ORDER BY name ASC');
  },

  insertClient: (name: string, type: string, phone?: string, cpf_rg?: string, address?: string, observation?: string) => {
    const result = db.runSync(
      `INSERT INTO clients (name, type, phone, cpf_rg, address, observation) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, type, phone || null, cpf_rg || null, address || null, observation || null]
    );
    return result.lastInsertRowId;
  },

  deleteClient: (id: number) => {
    db.runSync('DELETE FROM clients WHERE id = ?', [id]);
  },

  getParties: () => {
    return db.getAllSync(`
      SELECT parties.*, clients.name as client_name 
      FROM parties 
      JOIN clients ON parties.client_id = clients.id 
      ORDER BY party_date DESC
    `);
  },

  insertParty: (client_id: number, party_date: string, package_type: string, total_value: number, down_payment: number, status: string) => {
    const result = db.runSync(
      `INSERT INTO parties (client_id, party_date, package_type, total_value, down_payment, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [client_id, party_date, package_type, total_value, down_payment || 0, status]
    );
    return result.lastInsertRowId;
  },

  deleteParty: (id: number) => {
    db.runSync('DELETE FROM parties WHERE id = ?', [id]);
  },

  getTransactions: () => {
    return db.getAllSync('SELECT * FROM transactions ORDER BY date DESC');
  },

  insertTransaction: (type: 'receita' | 'despesa', category: string, amount: number, description?: string, reference_id?: number) => {
    const date = new Date().toISOString();
    db.runSync(
      `INSERT INTO transactions (type, category, amount, description, date, reference_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [type, category, amount, description || null, date, reference_id || null]
    );
  },

  getDailyBalance: (): number => {
    const result = db.getFirstSync(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'receita' THEN amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN type = 'despesa' THEN amount ELSE 0 END), 0) as saldo 
      FROM transactions
    `) as { saldo: number } | null;

    return result ? result.saldo : 0;
  },

  getOpenDebts: () => {
    return db.getAllSync(`
      SELECT debts.*, clients.name as client_name, clients.type as client_type 
      FROM debts 
      JOIN clients ON debts.client_id = clients.id 
      WHERE debts.status = 'aberto'
      ORDER BY debts.created_at DESC
    `);
  },

  getFiadosOpenDebts: () => {
    return db.getAllSync(`
      SELECT debts.*, clients.name as client_name, clients.type as client_type 
      FROM debts 
      JOIN clients ON debts.client_id = clients.id 
      WHERE debts.status = 'aberto' AND clients.type = 'fiado'
      ORDER BY debts.created_at DESC
    `);
  },

  getNotinhasOpenDebts: () => {
    return db.getAllSync(`
      SELECT debts.*, clients.name as client_name, clients.type as client_type 
      FROM debts 
      JOIN clients ON debts.client_id = clients.id 
      WHERE debts.status = 'aberto' AND clients.type = 'notinha'
      ORDER BY debts.created_at DESC
    `);
  },

  createDebt: (client_id: number, total_amount: number, itens: Array<{ description: string; quantity: number; unit_price: number }>) => {
    const debtResult = db.runSync(
      `INSERT INTO debts (client_id, total_amount, status) VALUES (?, ?, 'aberto')`,
      [client_id, total_amount]
    );
    const debtId = debtResult.lastInsertRowId;

    for (const item of itens) {
      const totalPrice = item.quantity * item.unit_price;
      db.runSync(
        `INSERT INTO debt_items (debt_id, description, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)`,
        [debtId, item.description, item.quantity, item.unit_price, totalPrice]
      );
    }

    return debtId;
  },

  payDebt: (debt_id: number) => {
    db.runSync(`UPDATE debts SET status = 'quitado', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [debt_id]);
  },

  getDebtItems: (debt_id: number) => {
    return db.getAllSync('SELECT * FROM debt_items WHERE debt_id = ?', [debt_id]);
  },

  addDebtItem: (debtId: number, description: string, quantity: number, unitPrice: number) => {
    const totalPrice = quantity * unitPrice;
    db.runSync(
      `INSERT INTO debt_items (debt_id, description, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)`,
      [debtId, description, quantity, unitPrice, totalPrice]
    );
    db.runSync(
      `UPDATE debts SET total_amount = total_amount + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [totalPrice, debtId]
    );
  }
};