<?php
session_start();
require 'conexion.php';

$usuario = $_POST['usuario'];
$contrasenia = $_POST['contrasenia'];

$sql = "SELECT * FROM usuario WHERE usuario = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $fila = $result->fetch_assoc();
    if (password_verify($contrasenia, $fila['Contrasenia'])) {
        $_SESSION['usuario'] = $fila["Usuario"];
        $_SESSION['rol'] = $fila["Rol"];
        $_SESSION['nombre'] = $fila["Nombre"];
        //$_SESSION['id'] = $fila["id"];

        echo json_encode([
            "status" => "ok",
            "usuario" => $fila["Usuario"],
            "nombre" => $fila["Nombre"],
            "rol" => $fila["Rol"]
        ]);
		
    } else {
        echo json_encode(["status" => "error", "msg" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["status" => "error", "msg" => "Usuario no encontrado"]);
}

$conn->close();
