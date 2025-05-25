<?php
session_start(); // Habilita las sesiones

require 'conexion.php';

$usuario = $_POST['usuario'];
$contrasenia = $_POST['contrasenia'];

$sql = "SELECT * FROM usuario WHERE usuario = ? AND contrasenia = ?;";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $usuario, $contrasenia);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $fila = $result->fetch_assoc();

    // Guardar datos en la sesión
    $_SESSION['usuario'] = $fila["usuario"];
    $_SESSION['rol'] = $fila["Rol"];
    $_SESSION['nombre'] = $fila["Nombre"];

    echo json_encode([
        "status" => "ok",
        "nombre" => $fila["Nombre"],
        "rol" => $fila["Rol"]
    ]);
} else {
    echo json_encode(["status" => "error"]);
}

$conn->close();
?>
