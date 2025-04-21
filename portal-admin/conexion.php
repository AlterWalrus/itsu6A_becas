<?php
$host = '34.51.39.23';        // IP pública de tu instancia
$db = 'checktec';             // Nombre de la base de datos
$user = 'Admin';              // Usuario de MySQL
$pass = 'Ces@RR2024-2026.'; 
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // para mostrar errores
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // devuelve arrays asociativos
    PDO::ATTR_EMULATE_PREPARES   => false,                  // seguridad ante SQL Injection
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit;
}
?>