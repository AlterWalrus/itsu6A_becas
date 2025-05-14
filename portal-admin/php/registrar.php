<?php
require 'conexion.php';

try {
	$input = json_decode(file_get_contents("php://input"), true);
	$tabla = $input['tabla'];
	unset($input['tabla']);

	if (empty($tabla) || count($input) == 0) {
		throw new Exception("Faltan datos para insertar");
	}

	$columnas = array_keys($input);
	$valores = array_values($input);
	$placeholders = implode(',', array_fill(0, count($columnas), '?'));
	$nombresColumnas = implode(',', $columnas);

	$sql = "INSERT INTO `$tabla` ($nombresColumnas) VALUES ($placeholders)";
	$stmt = $conn->prepare($sql);

	// Construir dinámicamente los tipos de datos para bind_param (asumimos todo como string 's' por simplicidad)
	$tipos = str_repeat('s', count($valores));
	$stmt->bind_param($tipos, ...$valores);

	if ($stmt->execute()) {
		echo json_encode(['status' => 'ok']);
	} else {
		echo json_encode(['status' => 'error', 'error' => $stmt->error]);
	}

	$conn->close();
} catch (Exception $e) {
	echo json_encode([
		"status" => "error",
		"error" => "Error: " . $e->getMessage()
	]);
}
?>