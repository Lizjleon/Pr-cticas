require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Rutas
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/client');

app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/cliente', clientRoutes);

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(process.env.PORT || 3000, () =>
  console.log('✅ Servidor corriendo en http://localhost:3000')
);
