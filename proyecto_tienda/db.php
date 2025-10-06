<?php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = ''; // Cambia si tu servidor local tiene contraseña
$DB_NAME = 'tienda';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($mysqli->connect_errno) {
    die("Falló la conexión a MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
}
$mysqli->set_charset('utf8mb4');
?>
