<?php
require 'conexion.php';

$id = $_POST['id'];
$nom = $_POST['nom'];

$sql = "UPDATE carrera SET nombre = ? WHERE id_Carrera = ?;";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $nom, $id);

if ($stmt->execute()) {
    $response['status'] = 'ok';
} else {
    $response['status'] = 'error';
    $response['error'] = $stmt->error;
}

echo json_encode($response);
$conn->close();
?>