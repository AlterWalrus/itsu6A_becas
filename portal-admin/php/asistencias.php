<?php
require 'conexion.php';

$anio = isset($_POST['anio']) ? intval($_POST['anio']) : date('Y');
$semana = isset($_POST['semana']) ? intval($_POST['semana']) : date('W');

// Obtener fecha de inicio (lunes) y fin (domingo) de la semana
$inicioSemana = new DateTime();
$inicioSemana->setISODate($anio, $semana); // lunes
$finSemana = clone $inicioSemana;
$finSemana->modify('+6 days'); // domingo

$inicioStr = $inicioSemana->format('Y-m-d');
$finStr = $finSemana->format('Y-m-d');

// Construcción dinámica de columnas de asistencia (7 días)
$columnasAsistencia = "";
for ($i = 0; $i < 7; $i++) {
    $diaActual = clone $inicioSemana;
    $diaActual->modify("+$i days");
    $fecha = $diaActual->format('Y-m-d');
    $columna = $diaActual->format('D d'); // ej: Mon 01

    $columnasAsistencia .= "MAX(CASE WHEN DATE(asist.Fecha_asistencia) = '$fecha' THEN 1 ELSE 0 END) AS `$columna`, ";
}
$columnasAsistencia = rtrim($columnasAsistencia, ", ");

// Consulta SQL
$sql = "
    SELECT 
      a.id_Alumno,
      a.Nombre,
      a.Apellido_paterno,
      a.Apellido_materno,
      a.No_Control,
	  a.estatus_beca,
      c.Nombre AS Carrera,
      $columnasAsistencia
    FROM alumno a
    LEFT JOIN asistencia asist 
      ON a.id_Alumno = asist.id_Alumno 
      AND DATE(asist.Fecha_asistencia) BETWEEN ? AND ?
    JOIN carrera c ON a.id_Carrera = c.id_Carrera
    GROUP BY a.id_Alumno, a.Nombre, a.Apellido_paterno, a.Apellido_materno, a.No_Control, c.Nombre
    -- ORDER BY a.Apellido_paterno, a.Apellido_materno
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $inicioStr, $finStr);
$stmt->execute();
$result = $stmt->get_result();

$datos = [];

while ($fila = $result->fetch_assoc()) {
    // Separar asistencias por día (las columnas tienen formato "Mon 01", etc.)
    $asistencias = [];
    foreach ($fila as $key => $value) {
        if (preg_match('/^[A-Z][a-z]{2} \d{2}$/', $key)) {
            $asistencias[$key] = intval($value);
            unset($fila[$key]);
        }
    }

    $fila['asistencias'] = $asistencias;
    $datos[] = $fila;
}

header('Content-Type: application/json');
echo json_encode($datos);

$conn->close();
?>
