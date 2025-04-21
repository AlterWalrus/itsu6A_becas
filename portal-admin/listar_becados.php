<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// tu código continúa...
require 'conexion.php';


try {
    $sql = "
        SELECT 
            a.ID_Alumno, 
            a.Nombre, 
            a.Apellido_paterno, 
            a.Apellido_materno, 
            a.No_Control, 
            a.Carrera, 
            a.Semestre, 
            a.Correo, 
            a.Telefono, 
            a.estatus_beca,
            c.Nombre AS Cafeteria
        FROM `checktec`.`Alumno` a
        LEFT JOIN (
            SELECT ID_Alumno, ID_Cafeteria
            FROM `checktec`.`Asistencia`
            WHERE (ID_Alumno, Fecha_Asistencia) IN (
                SELECT ID_Alumno, MAX(Fecha_Asistencia)
                FROM `checktec`.`Asistencia`
                GROUP BY ID_Alumno
            )
        ) ult ON ult.ID_Alumno = a.ID_Alumno
        LEFT JOIN `checktec`.`Cafeteria` c ON c.ID_Cafeteria = ult.ID_Cafeteria
    ";

    $stmt = $pdo->query($sql);
    $alumnos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($alumnos);

} catch (Exception $e) {
    echo json_encode([
        "error" => "Error al consultar alumnos: " . $e->getMessage()
    ]);
}
?>