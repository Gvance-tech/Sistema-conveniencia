const fs = require('fs');
const path = require('path');
const knex = require('knex');
const config = require('../../knexfile');

const env = process.env.NODE_ENV || 'development';
const cfg = config[env];

if (cfg.connection.filename !== ':memory:') {
  fs.mkdirSync(path.dirname(cfg.connection.filename), { recursive: true });
}

module.exports = knex(cfg);
