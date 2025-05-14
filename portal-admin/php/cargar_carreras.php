<?php
require 'conexion.php';

try {
    $sql = "SELECT * FROM carrera;";
	$resultado = $conn->query($sql);

	$datos = [];
	while ($fila = $resultado->fetch_assoc()) {
		$datos[] = $fila;
	}
	
	echo json_encode($datos);

} catch (Exception $e) {
    echo json_encode([
        "error" => "Error al consultar alumnos: " . $e->getMessage()
    ]);
}
?>