<?php
// iniciar_detector.php
// Asegúrate de usar la ruta completa al Python y al script
exec("python3 /var/www/html/itsu6A_becas/portal-alumno/detector.py > /dev/null 2>/dev/null &");
?>
