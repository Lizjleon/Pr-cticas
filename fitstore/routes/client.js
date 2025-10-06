const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware: solo cliente
function isCliente(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'cliente') {
    return res.redirect('/login');
  }
  next();
}

// Dashboard del cliente
router.get('/', isCliente, (req, res) => {
  res.render('client/dashboard', { email: req.session.user.email });
});

// Ver pedidos del cliente
router.get('/pedidos', isCliente, async (req, res) => {
  const [pedidos] = await pool.query(`
    SELECT id, total, estado, estado_pago, metodo_pago, monto_pagado, fecha
    FROM pedidos
    WHERE cliente_id = ?
    ORDER BY fecha DESC
  `, [req.session.user.id]);

  res.render('client/pedidos', { pedidos });
});

module.exports = router;
