<?php
require 'conexion.php';

try {
    $tablasPermitidas = ['alumno', 'carrera', 'cafeteria', 'usuario', 'accion'];

    if (!isset($_POST['tablaNombre']) || !in_array($_POST['tablaNombre'], $tablasPermitidas)) {
        throw new Exception("Nombre de tabla no válido.");
    }

    $tabla = $_POST['tablaNombre'];
    
    $sql = "SELECT * FROM $tabla";
    $resultado = $conn->query($sql);

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    echo json_encode($datos);
	$conn->close();
} catch (Exception $e) {
    echo json_encode([
        "error" => "Error al consultar datos: " . $e->getMessage()
    ]);
}
?>