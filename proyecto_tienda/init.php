<?php
// Inicializa datos por primera vez: usuario admin (admin@tienda.com / admin123)
// y 3 productos demo si no existen.
require_once 'db.php';

// Crear admin si no existe
$admin_email = 'admin@tienda.com';
$admin_password = 'admin123'; // contraseña por defecto
$stmt = $mysqli->prepare("SELECT id FROM usuarios WHERE email = ?");
$stmt->bind_param('s', $admin_email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows === 0) {
    $stmt->close();
    $hash = password_hash($admin_password, PASSWORD_DEFAULT);
    $rol = 'administrador';
    $ins = $mysqli->prepare("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)"); 
    $nombre = 'Administrador';
    $ins->bind_param('ssss', $nombre, $admin_email, $hash, $rol);
    $ins->execute();
    $ins->close();
}
$stmt->close();

// Insertar 3 productos si la tabla está vacía
$res = $mysqli->query("SELECT COUNT(*) AS c FROM productos");
$row = $res->fetch_assoc();
if ($row['c'] == 0) {
    $items = [
        ['A001', 'Mouse inalámbrico', '15.99', 30],
        ['A002', 'Teclado mecánico', '45.50', 20],
        ['A003', 'Monitor 24 pulgadas', '120.00', 10]
    ];
    $ins = $mysqli->prepare("INSERT INTO productos (ref, nombre, precio, stock) VALUES (?, ?, ?, ?)"); 
    foreach ($items as $it) {
        $ins->bind_param('ssdi', $it[0], $it[1], $it[2], $it[3]);
        $ins->execute();
    }
    $ins->close();
}
?>
