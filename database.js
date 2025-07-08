const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('revendedores.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT
    )
  `);
});

module.exports = db;
