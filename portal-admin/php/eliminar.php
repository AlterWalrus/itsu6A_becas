<?php
require 'conexion.php';

try {
	$tabla = $_POST['tabla'];
	$id = $_POST['id'];

	if (empty($tabla) || empty($id)) {
		throw new Exception("Faltan parámetros.");
	}

	$idColumna = "id_" . $tabla;
	$sql = "DELETE FROM `$tabla` WHERE `$idColumna` = ?;";
	$stmt = $conn->prepare($sql);
	$stmt->bind_param('s', $id);

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
