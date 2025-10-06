// routes/courses.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Lista pública
router.get('/public', courseController.listPublic);

// Ver detalle
router.get('/:id', courseController.detail);

// Inscribirse (POST)
router.post('/:id/enroll', courseController.enroll);

// Mis inscripciones
router.get('/', courseController.myEnrollments);

module.exports = router;
