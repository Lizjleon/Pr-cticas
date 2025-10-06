const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { titulo: 'Inicio — Mi sitio pastel' });
});

app.get('/about', (req, res) => {
  res.render('about', { titulo: 'Acerca — Mi sitio pastel' });
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
