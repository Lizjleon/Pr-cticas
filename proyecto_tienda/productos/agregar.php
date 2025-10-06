<?php
require_once '../init.php';
session_start();
if(!isset($_SESSION['user_id']) || $_SESSION['rol'] !== 'administrador'){
    header('Location: /proyecto_tienda/login.php');
    exit;
}
$errors = [];
$success = '';
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    require '../db.php';
    $ref = trim($_POST['ref'] ?? '');
    $nombre = trim($_POST['nombre'] ?? '');
    $precio = $_POST['precio'] ?? '';
    $stock = $_POST['stock'] ?? '';

    if($ref === '') $errors[] = 'La referencia es obligatoria.';
    if($nombre === '') $errors[] = 'El nombre es obligatorio.';
    if(!is_numeric($precio) || $precio < 0) $errors[] = 'El precio debe ser un número válido.';
    if(!is_numeric($stock) || intval($stock) < 0) $errors[] = 'El stock debe ser un entero igual o mayor a 0.';

    if(empty($errors)){
        $ins = $mysqli->prepare("INSERT INTO productos (ref, nombre, precio, stock) VALUES (?, ?, ?, ?)"); 
        $ins->bind_param('ssdi', $ref, $nombre, $precio, $stock);
        if($ins->execute()){
            $success = 'Producto añadido correctamente.';
        } else {
            $errors[] = 'Error al añadir el producto.';
        }
    }
}
include '../partials/header.php';
include '../partials/navbar.php';
?>
<main class="container">
  <section class="card">
    <h2>Añadir producto</h2>
    <?php foreach($errors as $e): ?><div class="alert error"><?php echo htmlspecialchars($e); ?></div><?php endforeach; ?>
    <?php if($success): ?><div class="alert success"><?php echo htmlspecialchars($success); ?></div><?php endif; ?>
    <form method="post">
      <div class="form-group"><label>Ref</label><input type="text" name="ref" value="<?php echo htmlspecialchars($_POST['ref'] ?? ''); ?>"></div>
      <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="<?php echo htmlspecialchars($_POST['nombre'] ?? ''); ?>"></div>
      <div class="form-group"><label>Precio (€)</label><input type="text" name="precio" value="<?php echo htmlspecialchars($_POST['precio'] ?? ''); ?>"></div>
      <div class="form-group"><label>Stock</label><input type="number" name="stock" value="<?php echo htmlspecialchars($_POST['stock'] ?? '0'); ?>"></div>
      <button class="btn-primary" type="submit">Guardar</button>
      <a href="/proyecto_tienda/admin.php" class="btn-ghost" style="margin-left:10px">Volver</a>
    </form>
  </section>
</main>
<?php include '../partials/footer.php'; ?>
