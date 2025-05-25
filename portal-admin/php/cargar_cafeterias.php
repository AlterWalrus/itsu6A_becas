<?php
require 'conexion.php';

try {
    $sql = "
		SELECT 
			c.Nombre, 
			c.Capacidad, 
			COUNT(a.id_Alumno) AS Ocupados
		FROM cafeteria c
		LEFT JOIN alumno a ON a.id_Cafeteria = c.id_Cafeteria
		GROUP BY c.id_Cafeteria, c.Nombre, c.Capacidad
	";
	$resultado = $conn->query($sql);


	$datos = [];
	while ($fila = $resultado->fetch_assoc()) {
		$datos[] = $fila;
	}
	
	echo json_encode($datos);

} catch (Exception $e) {
    echo json_encode([
        "error" => "Error al consultar base de datos: " . $e->getMessage()
    ]);
}
?>