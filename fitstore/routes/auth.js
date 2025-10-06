const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Página de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Proceso de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.render('login', { error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.render('login', { error: 'Contraseña incorrecta' });
    }

    // Guarda la sesión
    req.session.user = { id: user.id, email: user.email, role: user.role };

    // Redirige según el rol
    if (user.role === 'admin') {
      return res.redirect('/admin');
    } else {
      return res.redirect('/cliente');
    }
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.render('login', { error: 'Error interno del servidor' });
  }
});

// Cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login'); // 👈 vuelve al login
  });
});

module.exports = router;
