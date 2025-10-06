<?php
require_once 'init.php';
$errors = [];
$success = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    require 'db.php';
    $nombre = trim($_POST['nombre'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm = $_POST['confirm'] ?? '';
    $rol = in_array($_POST['rol'] ?? 'editor', ['editor','administrador']) ? $_POST['rol'] : 'editor';

    if($nombre === '') $errors[] = 'El nombre es obligatorio.';
    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'El email no tiene un formato válido.';
    if(strlen($password) < 6) $errors[] = 'La contraseña debe tener al menos 6 caracteres.';
    if($password !== $confirm) $errors[] = 'Las contraseñas no coinciden.';

    if(empty($errors)){
        // Comprobar si email existe
        $stmt = $mysqli->prepare("SELECT id FROM usuarios WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        if($stmt->num_rows > 0){
            $errors[] = 'Ya existe una cuenta con ese email.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $ins = $mysqli->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)"); 
            $ins->bind_param('ssss', $nombre, $email, $hash, $rol);
            if($ins->execute()){
                $success = 'Registro completado. Puedes iniciar sesión.';
            } else {
                $errors[] = 'Error al crear la cuenta. Inténtalo de nuevo.';
            }
        }
    }
}
include 'partials/header.php';
include 'partials/navbar.php';
?>
<main class="container">
  <section class="card">
    <h2>Registro</h2>
    <?php if($errors): foreach($errors as $e): ?>
      <div class="alert error"><?php echo htmlspecialchars($e); ?></div>
    <?php endforeach; endif; ?>
    <?php if($success): ?>
      <div class="alert success"><?php echo htmlspecialchars($success); ?></div>
    <?php endif; ?>
    <form method="post" novalidate>
      <div class="form-group">
        <label>Nombre</label>
        <input type="text" name="nombre" value="<?php echo htmlspecialchars($_POST['nombre'] ?? ''); ?>" required>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required>
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" required>
      </div>
      <div class="form-group">
        <label>Confirmar contraseña</label>
        <input type="password" name="confirm" required>
      </div>
      <div class="form-group">
        <label>Rol (por defecto: editor)</label>
        <select name="rol">
          <option value="editor">Editor</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <button class="btn-primary" type="submit">Registrarse</button>
    </form>
  </section>
</main>
<?php include 'partials/footer.php'; ?>
