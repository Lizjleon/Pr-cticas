const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Middleware: solo admin
function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

// Panel principal del admin
router.get('/', isAdmin, (req, res) => {
  res.render('admin/dashboard', { email: req.session.user.email });
});

// Ver pedidos de todos los clientes
router.get('/pedidos', isAdmin, async (req, res) => {
  const [pedidos] = await pool.query(`
    SELECT 
      p.id, 
      u.email AS cliente, 
      p.total, 
      p.estado, 
      p.estado_pago, 
      p.metodo_pago, 
      p.monto_pagado, 
      p.fecha
    FROM pedidos p
    JOIN users u ON p.cliente_id = u.id
    ORDER BY p.fecha DESC
  `);

  res.render('admin/pedidos', { pedidos });
});

module.exports = router;
