// controllers/adminController.js
const pool = require('../config/db');
const { validationResult } = require('express-validator');

exports.dashboard = async (req, res) => {
  try {
    const [cursos] = await pool.query('SELECT * FROM courses');
    res.render('admin/dashboard', { cursos });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cargando dashboard');
    res.redirect('/');
  }
};

exports.getCreate = (req, res) => {
  res.render('courses/form', { curso: null });
};

exports.postCreate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg));
    return res.redirect('/admin/courses/new');
  }
  const { titulo, descripcion, categoria, visibilidad } = req.body;
  try {
    await pool.query('INSERT INTO courses (titulo, descripcion, categoria, visibilidad) VALUES (?, ?, ?, ?)', [titulo, descripcion, categoria, visibilidad]);
    req.flash('success', 'Curso creado');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error creando curso');
    res.redirect('/admin');
  }
};

exports.getEdit = async (req, res) => {
  try {
    const [[curso]] = await pool.query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!curso) return res.redirect('/admin');
    res.render('courses/form', { curso });
  } catch (err) {
    console.error(err);
    res.redirect('/admin');
  }
};

exports.putEdit = async (req, res) => {
  const { titulo, descripcion, categoria, visibilidad } = req.body;
  try {
    await pool.query('UPDATE courses SET titulo = ?, descripcion = ?, categoria = ?, visibilidad = ? WHERE id = ?', [titulo, descripcion, categoria, visibilidad, req.params.id]);
    req.flash('success', 'Curso actualizado');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error actualizando curso');
    res.redirect('/admin');
  }
};

exports.delete = async (req, res) => {
  try {
    await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    req.flash('success', 'Curso eliminado');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error eliminando curso');
    res.redirect('/admin');
  }
};
