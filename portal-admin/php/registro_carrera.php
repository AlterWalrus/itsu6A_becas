<?php
require 'conexion.php';

$nom = $_POST['nom'];

$sql = "INSERT INTO carrera VALUES(null, ?);";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nom);

if ($stmt->execute()) {
    $response['status'] = 'ok';
} else {
    $response['status'] = 'error';
    $response['error'] = $stmt->error;
}

echo json_encode($response);
$conn->close();

?>