// public/js/main.js
// Comportamientos menores: cerrar mensajes flash al click
document.addEventListener('click', e => {
  if (e.target.classList.contains('flash')) e.target.style.display = 'none';
});
