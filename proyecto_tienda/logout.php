<?php
session_start();
session_unset();
session_destroy();
header('Location: /proyecto_tienda/index.php');
exit;
?>