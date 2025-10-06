// routes/admin.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware simple para proteger rutas de admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Acceso denegado');
  res.redirect('/');
}

router.get('/', isAdmin, adminController.dashboard);
router.get('/courses/new', isAdmin, adminController.getCreate);
router.post('/courses/new', isAdmin, [
  body('titulo').notEmpty().withMessage('Título requerido'),
  body('visibilidad').isIn(['publico','registrados']).withMessage('Visibilidad inválida')
], adminController.postCreate);

router.get('/courses/:id/edit', isAdmin, adminController.getEdit);
router.put('/courses/:id', isAdmin, adminController.putEdit);
router.delete('/courses/:id', isAdmin, adminController.delete);

module.exports = router;
