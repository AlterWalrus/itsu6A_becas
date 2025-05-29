<?php
require 'conexion.php';

try {
    $huella = $_POST['huella'];

    $sql = "SELECT * FROM alumno WHERE Huella = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al preparar statement: " . $conn->error);
    }

    $stmt->bind_param('s', $huella);

    if ($stmt->execute()) {
        $resultado = $stmt->get_result();

        if ($resultado->num_rows > 0) {
            $alumno = $resultado->fetch_assoc();
            echo json_encode([
                'status' => 'ok',
                'alumno' => $alumno
            ]);
        } else {
            echo json_encode([
                'status' => 'no_encontrado'
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'error' => $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'error' => $e->getMessage()
    ]);
}
?>
