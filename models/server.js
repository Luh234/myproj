const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const { createUser, getUserByEmail, getAllUsers } = require('./models/User');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'segredo', resave: false, saveUninitialized: true }));

// Cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = await bcrypt.hash(senha, 10);
  createUser(nome, email, senhaHash, (err) => {
    if (err) return res.send('Erro ao cadastrar');
    res.redirect('/login.html');
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  getUserByEmail(email, async (err, user) => {
    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.send('Login inválido');
    }
    req.session.userId = user.id;
    res.redirect('/admin.html');
  });
});

// Lista de revendedores
app.get('/api/revendedores', (req, res) => {
  if (!req.session.userId) return res.status(403).send('Não autorizado');
  getAllUsers((err, users) => {
    res.json(users);
  });
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
