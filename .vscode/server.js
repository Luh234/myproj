const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Criação das tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS revendedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT
  )`);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'segredo_supersecreto',
  resave: false,
  saveUninitialized: false
}));

// Rotas

// Página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Login POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, user) => {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.send('Usuário ou senha inválidos');
    }
  });
});

// Painel protegido
app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views/dashboard.html'));
});

// Listar revendedores
app.get('/listar', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  db.all('SELECT * FROM revendedores', (err, rows) => {
    res.send(rows);
  });
});

// Cadastro de revendedor
app.post('/cadastrar', (req, res) => {
  if (!req.session.user) return res.redirect('/');
  const { nome, email } = req.body;
  db.run('INSERT INTO revendedores (nome, email) VALUES (?, ?)', [nome, email]);
  res.redirect('/dashboard');
});

// Criar admin manualmente
app.get('/criar-admin', (req, res) => {
  const username = 'admin';
  const password = bcrypt.hashSync('1234', 10);
  db.run('INSERT INTO admins (username, password) VALUES (?, ?)', [username, password], err => {
    if (err) res.send('Admin já existe.');
    else res.send('Admin criado!');
  });
});

app.listen(3000, () => console.log('Servidor rodando http://localhost:3000'));
