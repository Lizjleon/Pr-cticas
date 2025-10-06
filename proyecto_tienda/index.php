<?php
require_once 'init.php';
include 'partials/header.php';
include 'partials/navbar.php';
?>
<main class="container">
  <section class="header-hero card">
    <div>
      <h1>Bienvenido a Storiz</h1>
      <p>Encuentra diversos productos a tu elección.</p>
      <div style="margin-top:14px">
        <?php if(!isset($_SESSION['user_id'])): ?>
          <a class="btn-primary" href="/proyecto_tienda/login.php">Iniciar sesión</a>
          <a class="btn-ghost" href="/proyecto_tienda/registro.php">Registrarse</a>
        <?php else: ?>
          <a class="btn-primary" href="/proyecto_tienda/admin.php">Ir al panel</a>
          <a class="btn-ghost" href="/proyecto_tienda/logout.php">Cerrar sesión</a>
        <?php endif; ?>
      </div>
    </div>
  </section>
  <section class="card">
    <h2>Productos destacados</h2>
    <?php
    require_once 'db.php';
    $res = $mysqli->query("SELECT * FROM productos ORDER BY creado_at DESC LIMIT 6");
    if($res->num_rows>0){
        echo '<table class="table"><thead><tr><th>Ref</th><th>Nombre</th><th>Precio</th><th>Stock</th></tr></thead><tbody>';
        while($p = $res->fetch_assoc()){
            echo '<tr><td>'.htmlspecialchars($p['ref']).'</td><td>'.htmlspecialchars($p['nombre']).'</td><td>'.number_format($p['precio'],2).' €</td><td>'.intval($p['stock']).'</td></tr>';
        }
        echo '</tbody></table>';
    } else {
        echo '<p class="alert error">No hay productos aún.</p>';
    }
    ?>
  </section>
</main>
<?php include 'partials/footer.php'; ?>
