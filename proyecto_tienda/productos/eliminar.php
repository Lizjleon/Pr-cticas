<?php
require_once '../init.php';
session_start();
if(!isset($_SESSION['user_id']) || $_SESSION['rol'] !== 'administrador'){
    header('Location: /proyecto_tienda/login.php');
    exit;
}
require '../db.php';
$id = intval($_GET['id'] ?? 0);
if($id>0){
    $del = $mysqli->prepare("DELETE FROM productos WHERE id = ?");
    $del->bind_param('i', $id);
    $del->execute();
}
header('Location: /proyecto_tienda/admin.php');
exit;
?>