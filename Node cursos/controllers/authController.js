// controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.getRegister = (req, res) => {
  res.render('auth/register');
};

exports.postRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg));
    return res.redirect('/auth/register');
  }
  const { nombre, email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) {
      req.flash('error', 'El email ya está registrado');
      return res.redirect('/auth/register');
    }
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hash]);
    req.flash('success', 'Registro correcto. Ya puedes iniciar sesión');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error del servidor');
    res.redirect('/auth/register');
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login');
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      req.flash('error', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', 'Credenciales inválidas');
      return res.redirect('/auth/login');
    }
    // Guardar solo lo necesario en sesión
    req.session.user = { id: user.id, nombre: user.nombre, email: user.email, role: user.role };
    req.flash('success', 'Bienvenido ' + user.nombre);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error del servidor');
    res.redirect('/auth/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
