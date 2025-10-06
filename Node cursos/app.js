// app.js
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const expressLayouts = require('express-ejs-layouts'); // 👈 IMPORTA ANTES DE USAR
require('dotenv').config();

// Rutas
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const adminRoutes = require('./routes/admin');

const app = express();

// Configuración de vistas y layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts); // 👈 ACTIVAR LAYOUTS
app.set('layout', 'layout'); // Usa views/layout.ejs como plantilla base

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 día
}));
app.use(flash());

// Variables globales (accesibles en todas las vistas EJS)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Rutas
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/admin', adminRoutes);

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

