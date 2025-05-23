<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idAlumno = $_POST['id_Alumno'];

    if (!$idAlumno) {
        echo json_encode(['success' => false, 'error' => 'ID de alumno no recibido']);
        exit;
    }

    $fechaHoy = date("Y-m-d"); // Solo fecha, sin hora

    // Verificar si ya se registró asistencia hoy
    $stmt = $conn->prepare("SELECT COUNT(*) as total FROM asistencia WHERE id_Alumno = ? AND DATE(Fecha_asistencia) = ?");
    $stmt->bind_param("is", $idAlumno, $fechaHoy);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if ($result['total'] > 0) {
        echo json_encode(['success' => false, 'error' => 'already_checked']);
        $stmt->close();
        $conn->close();
        exit;
    }

    // Registrar nueva asistencia
    $fechaActual = date("Y-m-d H:i:s");
    $stmt->close();
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
