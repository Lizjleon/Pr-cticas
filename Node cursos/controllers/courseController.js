// controllers/courseController.js
const pool = require('../config/db');

exports.listPublic = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM courses WHERE visibilidad = 'publico'");
    res.render('courses/list', { cursos: rows, titulo: 'Cursos públicos' });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cargando cursos');
    res.redirect('/');
  }
};

exports.listAllForUser = async (req, res) => {
  // Solo para usuarios logueados
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.render('courses/list', { cursos: rows, titulo: 'Todos los cursos' });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cargando cursos');
    res.redirect('/');
  }
};

exports.detail = async (req, res) => {
  const id = req.params.id;
  try {
    const [[curso]] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (!curso) return res.status(404).send('No encontrado');
    res.render('courses/detail', { curso });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
};

exports.enroll = async (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Necesitas iniciar sesión para inscribirte');
    return res.redirect('/auth/login');
  }
  const userId = req.session.user.id;
  const courseId = req.params.id;
  try {
    await pool.query('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id', [userId, courseId]);
    req.flash('success', 'Inscripción realizada');
    res.redirect('/courses/' + courseId);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error al inscribirse o ya estás inscrito');
    res.redirect('/courses/' + courseId);
  }
};

exports.myEnrollments = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');
  try {
    const [rows] = await pool.query(`
      SELECT c.* FROM courses c
      JOIN enrollments e ON e.course_id = c.id
      WHERE e.user_id = ?
    `, [req.session.user.id]);
    res.render('courses/list', { cursos: rows, titulo: 'Mis cursos' });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cargando tus cursos');
    res.redirect('/');
  }
};
