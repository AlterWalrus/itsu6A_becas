<?php
require 'conexion.php';

header('Content-Type: application/json');

try {
    $mesActual = date('m');
    $anioActual = date('Y');

    $reporte = "Reporte del mes actual ({$mesActual}/{$anioActual}):\n\n";

    // Total de asistencias
    $sql = "SELECT COUNT(*) AS total FROM asistencia WHERE MONTH(Fecha_asistencia) = $mesActual AND YEAR(Fecha_asistencia) = $anioActual";
    $res = $conn->query($sql);
    $row = $res->fetch_assoc();
    $reporte .= "Total de asistencias: {$row['total']}\n";

    // Carrera con menor asistencia
    $sql = "SELECT c.Nombre, COUNT(*) AS total
            FROM asistencia s
            JOIN alumno a ON s.id_Alumno = a.id_Alumno
            JOIN carrera c ON a.id_Carrera = c.id_Carrera
            WHERE MONTH(s.Fecha_asistencia) = $mesActual AND YEAR(s.Fecha_asistencia) = $anioActual
            GROUP BY c.id_Carrera
            ORDER BY total ASC LIMIT 1";
    $res = $conn->query($sql);
    if ($row = $res->fetch_assoc()) {
        $reporte .= "Carrera con menor asistencia: {$row['Nombre']} ({$row['total']})\n";
    }

    // Cafetería menos visitada
    $sql = "SELECT caf.Nombre, COUNT(*) AS total
            FROM asistencia s
            JOIN alumno a ON s.id_Alumno = a.id_Alumno
            JOIN cafeteria caf ON a.id_Cafeteria = caf.id_Cafeteria
            WHERE MONTH(s.Fecha_asistencia) = $mesActual AND YEAR(s.Fecha_asistencia) = $anioActual
            GROUP BY caf.id_Cafeteria
            ORDER BY total ASC LIMIT 1";
    $res = $conn->query($sql);
    if ($row = $res->fetch_assoc()) {
        $reporte .= "Cafetería menos visitada: {$row['Nombre']} ({$row['total']})\n";
    }

    // Semestre menos activo
    $sql = "SELECT a.Semestre, COUNT(*) AS total
            FROM asistencia s
            JOIN alumno a ON s.id_Alumno = a.id_Alumno
            WHERE MONTH(s.Fecha_asistencia) = $mesActual AND YEAR(s.Fecha_asistencia) = $anioActual
            GROUP BY a.Semestre
            ORDER BY total ASC LIMIT 1";
    $res = $conn->query($sql);
    if ($row = $res->fetch_assoc()) {
        $reporte .= "Grado con menor actividad (Semestre): {$row['Semestre']} ({$row['total']})\n";
    }

    // Día más y menos activo
    $sql = "SELECT DATE(Fecha_asistencia) AS dia, COUNT(*) AS total
            FROM asistencia
            WHERE MONTH(Fecha_asistencia) = $mesActual AND YEAR(Fecha_asistencia) = $anioActual
            GROUP BY dia
            ORDER BY total ASC";
    $res = $conn->query($sql);
    $diaMenor = $res->fetch_assoc(); // Primer resultado = menor
    $res->data_seek($res->num_rows - 1); // Último resultado = mayor
    $diaMayor = $res->fetch_assoc();
    $reporte .= "Día más activo: {$diaMayor['dia']} ({$diaMayor['total']} asistencias)\n";
    $reporte .= "Día menos activo: {$diaMenor['dia']} ({$diaMenor['total']} asistencias)\n";

    // Cierre
    $reporte .= "\nAnaliza los datos y redacta un reporte profesional donde se mencione toda la información y se hagan predicciones y sugerencias. Solo texto plano y párrafos, no uses **. Sé breve, máximo 450 palabras.";

	/*
    echo json_encode([
        "status" => "ok",
        "reporte" => $reporte
    ]);
	*/
    $conn->close();

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "detalle" => $e->getMessage()
    ]);
}

// Cargar la API Key
$config = include(__DIR__ . '/config.php');
$apiKey = $config['GROQ_API_KEY'];

$url = "https://api.groq.com/openai/v1/chat/completions";

$data = [
    "model" => "meta-llama/llama-4-scout-17b-16e-instruct",
    "messages" => [
        ["role" => "user", "content" => $reporte]
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
