<?php
require_once 'init.php';
session_start();
if(!isset($_SESSION['user_id'])){
    header('Location: /proyecto_tienda/login.php');
    exit;
}
require 'db.php';
include 'partials/header.php';
include 'partials/navbar.php';
?>
<main class="container">
  <section class="card">
    <h2>Panel de administración</h2>
    <p>Bienvenido, <strong><?php echo htmlspecialchars($_SESSION['nombre']); ?></strong> — Rol: <em><?php echo htmlspecialchars($_SESSION['rol']); ?></em></p>
    <?php if($_SESSION['rol'] === 'administrador'): ?>
      <p><a class="btn-primary" href="/proyecto_tienda/productos/agregar.php">Añadir producto</a></p>
    <?php endif; ?>

    <?php
    $res = $mysqli->query("SELECT * FROM productos ORDER BY id DESC");
    if($res->num_rows > 0){
        echo '<table class="table"><thead><tr><th>Ref</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>';
        while($p = $res->fetch_assoc()){
            echo '<tr><td>'.htmlspecialchars($p['ref']).'</td><td>'.htmlspecialchars($p['nombre']).'</td><td>'.number_format($p['precio'],2).' €</td><td>'.intval($p['stock']).'</td>';
            echo '<td class="actions">';
            echo '<a class="edit" href="/proyecto_tienda/productos/editar.php?id='.intval($p['id']).'">Editar</a>';
            if($_SESSION['rol'] === 'administrador'){
                echo '<a class="delete" href="/proyecto_tienda/productos/eliminar.php?id='.intval($p['id']).'" onclick="return confirm(\'¿Eliminar este producto?\')">Borrar</a>';
            }
            echo '</td></tr>';
        }
        echo '</tbody></table>';
    } else {
        echo '<p class="alert error">No hay productos.</p>';
    }
    ?>
  </section>
</main>
<?php include 'partials/footer.php'; ?>
