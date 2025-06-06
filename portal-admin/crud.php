<?php
session_start();
if (!isset($_SESSION['nombre'])) {
    header("Location: index.html");
    exit();
}

$nombre = $_SESSION['nombre'];
$rol = $_SESSION['rol'];
?>

<!DOCTYPE html>
<html lang="es">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Panel Gestor | CheckTec</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<style>
		body.modal-open {
			overflow: hidden;
		}
	</style>
</head>

<body
	class="min-h-screen bg-gradient-to-r from-blue-600 to-purple-500 flex flex-col items-center justify-start py-10 px-4">
	<div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.5%22/%3E%3C/svg%3E')] opacity-50 z-0 pointer-events-none"></div>
</body>
<!-- Encabezado -->
<div class="flex items-center gap-1 mb-1">
	<img src="img/logo.png" alt="Logo" class="h-12">
	<span id="titulo" class="text-2xl font-bold text-white"> Administrar </span>
</div>

<!-- Contenido principal -->
<main class="flex-1 w-[98%] mx-auto p-6 z-10">
	<!-- Contenedor semitransparente con sombra -->
	<div class="bg-white/70 p-4 rounded shadow-md">
		<!-- Panel dinámico según rol -->
		<div id="adminPanel" class="mb-8">
			<div class="flex justify-between mb-6">
				<!-- Botones a la izquierda -->
				<div id="panelBotones" class="flex gap-4">
					<button id="btnAgregar"
						class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow flex items-center gap-2">
						<img src="img/addition.png" alt="Icono usuario" class="w-6 h-6">
						Agregar
					</button>

					<button id="btnModificar"
						class="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-500 shadow flex items-center gap-2">
						<img src="img/compose.png" alt="Huella" class="w-6 h-6">
						Modificar
					</button>
					<button id="btnEliminar"
						class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow flex items-center gap-2">
						<img src="img/bin.png" alt="Huella" class="w-6 h-6">
						Eliminar
					</button>
				</div>

				<!-- Botón a la derecha -->
				<button id="btnPanel" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow flex items-center gap-2">
					<img src="img/left-arrow.png" alt="back" class="h-6">
					Regresar
				</button>
			</div>
		</div>

		<!-- Panel de confirmacion -->
		<div id="confirmPanel" class="flex justify-between mb-6 hidden">
			<div class="flex gap-4">
				<button id="btnCancelar"
					class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow flex items-center gap-2">
					<img src="img/cancel.png" alt="Icono usuario" class="w-6 h-6">
					Cancelar
				</button>

				<button id="btnConfirmar"
					class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow flex items-center gap-2">
					<img src="img/accept.png" alt="Huella" class="w-6 h-6">
					Confirmar
				</button>
			</div>
		</div>

		<!-- Filtro de búsqueda -->
		<div class="mb-4">
			<input type="text" id="buscador" placeholder="Filtrar ..."
				class="w-full px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
		</div>

		<!-- Tabla -->
		<div class="bg-white bg-opacity-90 shadow-md rounded overflow-hidden">
			<table id="tabla" class="w-full text-left text-sm">
				<thead class="bg-gray-200 text-black">
					<tr>
						<th class="px-2 py-2 hidden checkbox-col">Eliminar</th>
						<th class="px-2 py-2 w-10">#</th>
					</tr>
				</thead>
				<tbody id="cuerpoTabla">
					<!-- Aquí se llenarán los datos -->
				</tbody>
			</table>
		</div>
	</div>
</main>

<div id="agregar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
	<div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
		<h2 class="text-xl font-bold mb-4">Agregar</h2>

		<form id="form" class="space-y-4">
			<div class="flex justify-end gap-2 mt-4">
				<button type="button" id="cancelarModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
					Cancelar
				</button>
				<button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					Guardar
				</button>
			</div>
		</form>
	</div>
</div>

<!-- Caja de éxito -->
<div id="exitoBox" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 hidden z-50">
	<div class="bg-white p-6 rounded-xl shadow-lg text-center">
		<h2 class="text-xl font-bold text-green-600 mb-4">¡Registro exitoso!</h2>
		<button id="btnCerrarExito" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
			Ok
		</button>
	</div>
</div>

<script src="js/crud.js"></script>
<script src="js/cargar.js"></script>
<script src="js/registrar.js"></script>
<script src="js/modificar.js"></script>
<script src="js/eliminar.js"></script>

</body>

</html>
