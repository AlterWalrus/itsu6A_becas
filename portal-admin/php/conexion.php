<?php
$host = 'localhost';
$db = 'checktec';
$user = 'root';
$pass = '';
$charset = 'utf8';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>