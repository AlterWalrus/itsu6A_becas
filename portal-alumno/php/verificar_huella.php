<?php
header('Content-Type: application/json');

$ruta = '/var/www/html/itsu6A_becas/portal-alumno/deteccion_actual.json';

if (!file_exists($ruta)) {
    echo json_encode(["huella_detectada" => false]);
    exit;
}

$data = file_get_contents($ruta);
echo $data;

// Limpiar archivo después de leer
file_put_contents($ruta, json_encode(["huella_detectada" => false]));
?>
