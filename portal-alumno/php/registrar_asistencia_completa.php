<?php
require 'conexion.php';

try {
    $huella = $_POST['huella'];
    $cafeteria_actual = $_POST['cafeteria'];

    $sql = "SELECT * FROM alumno WHERE Huella = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $huella);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) {
        echo json_encode(['status' => 'no_encontrado']);
        exit;
    }

    $alumno = $resultado->fetch_assoc();

    if ($alumno['estatus_beca'] != 1) {
        echo json_encode([
            'status' => 'suspendido',
            'nombre' => $alumno['Nombre']
        ]);
        exit;
    }

    if ($alumno['id_Cafeteria'] != $cafeteria_actual) {
        echo json_encode([
            'status' => 'cafeteria_incorrecta',
            'nombre' => $alumno['Nombre'],
            'cafeteria_asignada' => $alumno['id_Cafeteria']
        ]);
        exit;
    }

    $sql_check = "SELECT * FROM asistencia WHERE id_Alumno = ? AND DATE(Fecha_asistencia) = date(now())";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param('i', $alumno['id_Alumno']);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        echo json_encode([
            'status' => 'ya_asistio',
            'nombre' => $alumno['Nombre']
        ]);
        exit;
    }
	

    $sql_insert = "INSERT INTO asistencia (Fecha_asistencia, id_Alumno) VALUES (NOW(), ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param('i', $alumno['id_Alumno']);

    if ($stmt_insert->execute()) {
        echo json_encode([
            'status' => 'asistencia_registrada',
            'nombre' => $alumno['Nombre']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'error' => $stmt_insert->error]);
    }
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'error' => $e->getMessage()
    ]);
}
?>
