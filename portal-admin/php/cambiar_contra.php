<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$nueva = $data['nuevaContra'] ?? '';

if (strlen($nueva) < 6) {
    echo json_encode(['success' => false, 'error' => 'Contraseña demasiado corta']);
    exit();
}

require 'conexion.php';
$usuario = $_SESSION['usuario'];
$hash = password_hash($nueva, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE usuario SET contrasenia = ? WHERE Usuario = ?");
$stmt->bind_param("ss", $hash, $usuario);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'DB error']);
}
