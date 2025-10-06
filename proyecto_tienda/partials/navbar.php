<?php
session_start();
?>
<header class="navbar">
  <div class="brand">Tienda <span class="neon">Panel</span></div>
  <nav>
    <a href="/proyecto_tienda/index.php">Inicio</a>
    <?php if(!isset($_SESSION['user_id'])): ?>
      <a href="/proyecto_tienda/login.php" class="btn">Iniciar sesión</a>
      <a href="/proyecto_tienda/registro.php" class="btn">Registrarse</a>
    <?php else: ?>
      <a href="/proyecto_tienda/admin.php">Administrador</a>
      <a href="/proyecto_tienda/logout.php" class="btn">Cerrar sesión</a>
    <?php endif; ?>
  </nav>
</header>
