<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idAlumno = $_POST['id_Alumno'];

    if (!$idAlumno) {
        echo json_encode(['success' => false, 'error' => 'ID de alumno no recibido']);
        exit;
    }

    $fechaActual = date("Y-m-d H:i:s");

    $stmt = $conn->prepare("INSERT INTO asistencia (Fecha_asistencia, id_Alumno) VALUES (?, ?)");
    $stmt->bind_param("si", $fechaActual, $idAlumno);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
