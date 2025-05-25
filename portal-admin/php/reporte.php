<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Cargar la API Key
$config = include(__DIR__ . '/config.php');
$apiKey = $config['GROQ_API_KEY'];

// Texto de ejemplo
$contexto = "Escribe un analisis sobre la importancia de la correcta alimentación en el desarrollo temprano del ser humano.";

/*
$contexto = "Genera un reporte profesional y detallado con base en la siguiente lista de asistencias a cobro de becas alimenticias (no uses más que texto plano, no destaques palabras con ** o similar):\n\n";
foreach ($datos as $d) {
    $contexto .= "- Nombre: {$d['nombre']}, Carrera: {$d['carrera']}, Estatus: {$d['estatus_beca']}\n";
}
*/

$url = "https://api.groq.com/openai/v1/chat/completions";

$data = [
    "model" => "meta-llama/llama-4-scout-17b-16e-instruct",
    "messages" => [
        ["role" => "user", "content" => $contexto]
    ],
    "temperature" => 0.7
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

$resultado = json_decode($response, true);

if (isset($resultado["choices"][0]["message"]["content"])) {
    echo json_encode([
        "status" => "ok",
        "reporte" => $resultado["choices"][0]["message"]["content"]
    ]);
} else {
    echo json_encode(["status" => "error", "detalle" => $resultado]);
}
?>
