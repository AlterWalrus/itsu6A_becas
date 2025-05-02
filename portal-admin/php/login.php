<?php
require 'conexion.php';

$usuario = $_POST['usuario'];
$contrasena = $_POST['contrasena'];

$sql = "SELECT * FROM usuario WHERE usuario = ? AND contrasenia = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $usuario, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo "ok";
} else {
    echo "error";
}
$conn->close();
?>