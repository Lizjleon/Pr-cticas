<?php
require_once '../init.php';
session_start();
if(!isset($_SESSION['user_id']) || $_SESSION['rol'] !== 'administrador'){
    header('Location: /proyecto_tienda/login.php');
    exit;
}
require '../db.php';
$errors = [];
$success = '';
$id = intval($_GET['id'] ?? 0);
$stmt = $mysqli->prepare("SELECT * FROM productos WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$res = $stmt->get_result();
if($res->num_rows === 0){
    header('Location: /proyecto_tienda/admin.php');
    exit;
}
$product = $res->fetch_assoc();

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $ref = trim($_POST['ref'] ?? '');
    $nombre = trim($_POST['nombre'] ?? '');
    $precio = $_POST['precio'] ?? '';
    $stock = $_POST['stock'] ?? '';

    if($ref === '') $errors[] = 'La referencia es obligatoria.';
    if($nombre === '') $errors[] = 'El nombre es obligatorio.';
    if(!is_numeric($precio) || $precio < 0) $errors[] = 'El precio debe ser un número válido.';
    if(!is_numeric($stock) || intval($stock) < 0) $errors[] = 'El stock debe ser un entero igual o mayor a 0.';

    if(empty($errors)){
        $upd = $mysqli->prepare("UPDATE productos SET ref=?, nombre=?, precio=?, stock=? WHERE id=?");
        $upd->bind_param('ssdii', $ref, $nombre, $precio, $stock, $id);
        if($upd->execute()){
            $success = 'Producto actualizado.';
            // recargar datos
            $stmt = $mysqli->prepare("SELECT * FROM productos WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $product = $stmt->get_result()->fetch_assoc();
        } else {
            $errors[] = 'Error al actualizar el producto.';
        }
    }
}

include '../partials/header.php';
include '../partials/navbar.php';
?>
<main class="container">
  <section class="card">
    <h2>Editar producto</h2>
    <?php foreach($errors as $e): ?><div class="alert error"><?php echo htmlspecialchars($e); ?></div><?php endforeach; ?>
    <?php if($success): ?><div class="alert success"><?php echo htmlspecialchars($success); ?></div><?php endif; ?>
    <form method="post">
      <div class="form-group"><label>Ref</label><input type="text" name="ref" value="<?php echo htmlspecialchars($product['ref']); ?>"></div>
      <div class="form-group"><label>Nombre</label><input type="text" name="nombre" value="<?php echo htmlspecialchars($product['nombre']); ?>"></div>
      <div class="form-group"><label>Precio (€)</label><input type="text" name="precio" value="<?php echo htmlspecialchars($product['precio']); ?>"></div>
      <div class="form-group"><label>Stock</label><input type="number" name="stock" value="<?php echo htmlspecialchars($product['stock']); ?>"></div>
      <button class="btn-primary" type="submit">Actualizar</button>
      <a href="/proyecto_tienda/admin.php" class="btn-ghost" style="margin-left:10px">Volver</a>
    </form>
  </section>
</main>
<?php include '../partials/footer.php'; ?>
