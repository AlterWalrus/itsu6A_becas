<?php
require 'conexion.php';

$id = $_POST['id'];

$sql = "DELETE FROM carrera WHERE id_Carrera = ?;";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $id);

if ($stmt->execute()) {
    $response['status'] = 'ok';
} else {
    $response['status'] = 'error';
    $response['error'] = $stmt->error;
}

echo json_encode($response);
$conn->close();
?>