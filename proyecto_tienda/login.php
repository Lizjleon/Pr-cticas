<?php
require_once 'init.php';
$errors = [];
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    require 'db.php';
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email no válido.';
    if($password === '') $errors[] = 'La contraseña es obligatoria.';

    if(empty($errors)){
        $stmt = $mysqli->prepare("SELECT id, nombre, password, rol FROM usuarios WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $res = $stmt->get_result();
        if($res->num_rows === 1){
            $u = $res->fetch_assoc();
            if(password_verify($password, $u['password'])){
                session_start();
                $_SESSION['user_id'] = $u['id'];
                $_SESSION['nombre'] = $u['nombre'];
                $_SESSION['rol'] = $u['rol'];
                header('Location: /proyecto_tienda/admin.php');
                exit;
            } else {
                $errors[] = 'Contraseña incorrecta.';
            }
        } else {
            $errors[] = 'No existe una cuenta con ese email.';
        }
    }
}
include 'partials/header.php';
include 'partials/navbar.php';
?>
<main class="container">
  <section class="card">
    <h2>Iniciar sesión</h2>
    <?php if($errors): foreach($errors as $e): ?>
      <div class="alert error"><?php echo htmlspecialchars($e); ?></div>
    <?php endforeach; endif; ?>
    <form method="post" novalidate>
      <div class="form-group">
        <label>Email</label>
        <input type="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required>
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input type="password" name="password" required>
      </div>
      <div style="margin-top:12px">
        <button class="btn-primary" type="submit">Entrar</button>
        <a href="/proyecto_tienda/registro.php" class="btn-ghost" style="margin-left:10px">Crear cuenta</a>
      </div>
    </form>
  </section>
</main>
<?php include 'partials/footer.php'; ?>
