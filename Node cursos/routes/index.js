// routes/index.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    // Mostrar bienvenida y cursos públicos
    const [cursos] = await pool.query("SELECT * FROM courses WHERE visibilidad = 'publico' LIMIT 6");
    res.render('index', { cursos });
  } catch (err) {
    console.error(err);
    res.render('index', { cursos: [] });
  }
});

module.exports = router;
