<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'conexion.php';
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $input = json_decode(file_get_contents("php://input"), true);
    $tabla = $input['tabla'] ?? null;
    $cambios = $input['cambios'] ?? [];

    if (!$tabla || !isset($cambios['id_'])) {
        throw new Exception("Faltan datos: tabla o id_ no presentes");
    }

    $idCampo = "id_" . $tabla;
    $id = (int)$cambios['id_'];
    unset($cambios['id_']);

    if (empty($cambios)) {
        throw new Exception("No hay campos para actualizar");
    }

    $columnas = array_keys($cambios);
    $valores = array_values($cambios);

    // Debug: muestra las columnas y valores
    error_log("Tabla: $tabla");
    error_log("ID: $id");
    error_log("Columnas: " . print_r($columnas, true));
    error_log("Valores: " . print_r($valores, true));

    $asignaciones = implode(',', array_map(fn($col) => "`$col` = ?", $columnas));
    $sql = "UPDATE `$tabla` SET $asignaciones WHERE `$idCampo` = ?";

    error_log("SQL generado: $sql");

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error al preparar: " . $conn->error);
    }

    $tipos = str_repeat('s', count($valores)) . 'i';
    error_log("Tipos bind_param: $tipos");

    $params = array_merge($valores, [$id]);
    $stmt->bind_param($tipos, ...$params);
    $stmt->execute();

    echo json_encode(["status" => "ok"]);
    $conn->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "error" => $e->getMessage()]);
}
