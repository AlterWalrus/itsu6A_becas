<?php
require 'conexion.php';

$nom = $_POST['nom'];
$app = $_POST['app'];
$apm = $_POST['apm'];
$nct = $_POST['nct'];
$eml = $_POST['eml'];
$tel = $_POST['tel'];
$crr = $_POST['crr'];
$sem = $_POST['sem'];
$caf = $_POST['caf'];

//INSERT INTO checktec.alumno VALUES (null, 'test', 't1', 't2', '12312300', 'Sistemas', 'Primero', '2', 'sos@sis.com', '3', '1');

$sql = "INSERT INTO alumno VALUES(null, ?, ?, ?, ?, ?, ?, ?, ?, ?, '1');";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssss", $nom, $app, $apm, $nct, $crr, $sem, $caf, $eml, $tel);

if ($stmt->execute()) {
    $response['status'] = 'ok';
	$response['debug'] = $crr;
} else {
    $response['status'] = 'error';
    $response['error'] = $stmt->error;
}

echo json_encode($response);
$conn->close();

?>