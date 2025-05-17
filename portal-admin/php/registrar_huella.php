<?php
header('Content-Type: application/json');
$output = shell_exec('python3 /var/www/html/itsu6A_becas/portal-admin/registrar_huella.py 2>&1');
echo $output;
?>
