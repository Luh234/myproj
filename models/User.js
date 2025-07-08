const db = require('../database');

const createUser = (nome, email, senhaHash, callback) => {
  db.run(
    'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senhaHash],
    callback
  );
};

const getUserByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], callback);
};

const getAllUsers = (callback) => {
  db.all('SELECT id, nome, email FROM users', callback);
};

module.exports = { createUser, getUserByEmail, getAllUsers };
