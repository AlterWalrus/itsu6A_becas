<?php
require 'conexion.php';

try {
    // Lista blanca de tablas válidas
    $tablasPermitidas = ['Alumno', 'Carrera', 'Cafeteria', 'Usuario'];

    // Validar entrada
    if (!isset($_POST['tablaNombre']) || !in_array($_POST['tablaNombre'], $tablasPermitidas)) {
        throw new Exception("Nombre de tabla no válido.");
    }

    $tabla = $_POST['tablaNombre'];
    
    // Construir consulta directamente ya que el nombre de tabla no puede ser un parámetro
    $sql = "SELECT * FROM $tabla";
    $resultado = $conn->query($sql);

    $datos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $datos[] = $fila;
    }

    // Devolver resultado en formato JSON
    echo json_encode($datos);
} catch (Exception $e) {
    echo json_encode([
        "error" => "Error al consultar datos: " . $e->getMessage()
    ]);
}
?>
