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
	<title>Panel | CheckTec</title>
	<script src="https://cdn.tailwindcss.com"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
	<style>
		.logo-azul {
  			filter: invert(31%) sepia(96%) saturate(5152%) hue-rotate(188deg) brightness(90%) contrast(101%);
		}
		.circular-progress {
			width: 100px;
			height: 100px;
			position: relative;
		}
		.circular-progress svg {
			transform: rotate(-90deg);
		}
		.circular-progress circle {
			fill: none;
			stroke-width: 10;
			stroke-linecap: round;
		}
		.circular-progress .bg {
			stroke:rgb(255, 255, 255);
		}
		.circular-progress .progress {
			stroke: #3b82f6;
			transition: stroke-dashoffset 0.5s ease;
		}
		.circular-progress .label {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-weight: bold;
			font-size: 1rem;
			text-align: center;
		}
		body.modal-open {
			overflow: hidden;
		}
	</style>
</head>

<body class="min-h-screen flex flex-col bg-gradient-to-r from-blue-600 to-purple-500">
	<div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22white%22%20fill-opacity%3D%220.5%22/%3E%3C/svg%3E')] opacity-50 z-0 pointer-events-none"></div>
	<!-- Header -->
	<header class="bg-white shadow-md p-4 flex justify-between items-center">
		<div class="flex items-center gap-2">
			<img src="img/logo.png" alt="Logo" class="h-10 logo-azul">
		</div>

		<!-- Menú contextual -->
		<div class="relative z-20">
			<button id="menuToggle" class="p-2 rounded hover:bg-blue-100 transition">
				<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2"
					viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<div id="menuDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
				<ul class="text-gray-700">

					<?php if ($_SESSION['rol'] === 'Admin'): ?>
					<li id="adminOption">
						<a href="javascript:void(0)" id="btnUsuarios" class="block px-4 py-2 hover:bg-gray-100">Administrar usuarios</a></li>
						<a href="javascript:void(0)" id="btnAcciones" class="block px-4 py-2 hover:bg-gray-100">Registro de acciones</a></li>
					<?php endif; ?>
					
					<li>
						<a href="javascript:void(0)" id="btnContra" class="block px-4 py-2 hover:bg-gray-100">Cambiar contraseña</a></li>
					<li>
						<a href="javascript:void(0)" onclick="cerrarSesion()"
						class="block px-4 py-2 hover:bg-gray-100">Cerrar sesión</a></li>
				</ul>
			</div>
		</div>
	</header>

	<!-- Contenido principal -->
	<main class="flex-1 w-[98%] mx-auto p-6 z-10">
		<!-- Contenedor semitransparente con sombra -->
		<div class="bg-white/75 p-4 rounded shadow-md">

			<!-- Bienvenida -->
			<div class="flex items-center mb-4 gap-2">
				<h2 class="text-2xl font-semibold">
					¡Te damos la bienvenida, <?php echo htmlspecialchars($nombre); ?>!
				</h2>
				<div class="m-auto"></div>
				<img src="img/CESA_noborder.png" alt="Logo" class="h-12">
			</div>

			<!-- Panel -->
			<div id="adminPanel" class="mb-8">
				<h3 class="text-lg font-bold mb-2">Panel de Administración</h3>
				<div class="flex gap-6 items-start flex-wrap md:flex-nowrap">
					<div class="flex flex-row gap-2">
						<button id="btnBecados"
							class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow flex items-center gap-2">
							<img src="img/user.png" alt="Icono usuario" class="w-6 h-6">
							Alumnos
						</button>

						<button id="btnCafeterias"
							class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow flex items-center gap-2">
							<img src="img/cafe.png" alt="Huella" class="w-6 h-6">
							Cafeterías
						</button>
						<button id="btnCarreras"
							class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow flex items-center gap-2">
							<img src="img/book.png" alt="Huella" class="w-6 h-6">
							Carreras
						</button>
						<button id="btnReporte"
							class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow flex items-center gap-2">
							<img src="img/ai.png" alt="Reporte" class="w-6 h-6">
							Generar Reporte
						</button>
					</div>

					<div class="m-auto"></div>

					<div id="cafeteriaCapacityWidget" class="overflow-x-auto mt-[-54px] ">
						<div class="flex gap-1 w-max px-2" id="cafeterias">
							<!-- ahhhh mi pichula -->
						</div>
					</div>
				</div>
			</div>

			<!-- Filtro -->
			<div class="flex items-center mb-4">
				<input type="week" class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="filtroSemana">
				<input type="text" id="buscador" placeholder="Filtrar becados..."
					class="w-full px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
			</div>

			<!-- Tabla -->
			<div class="bg-white bg-opacity-90 shadow-md rounded overflow-hidden">
				<table id="tablaBecados" class="w-full text-left text-sm">
					<thead id="encabezadoTablaBecados" class="bg-blue-600 text-white"></thead>
					<tbody id="cuerpoTablaBecados"></tbody>
				</table>
			</div>
		</div>
	</main>

	<!-- Modal de cambio de contraseña -->
	<div id="modalCambioContra" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 hidden">
		<div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
			<h2 class="text-xl font-bold text-center mb-4 text-blue-700">Cambiar Contraseña</h2>

			<form id="formCambioContra" class="space-y-4">
				<input type="text" name="usuario" value="<?= $_SESSION['usuario'] ?>" autocomplete="username" hidden>

				<div>
					<label for="nuevaContra1" class="block text-sm font-medium text-gray-700">Nueva contraseña:</label>
					<input type="password" id="nuevaContra1" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" autocomplete="new-password" required>
				</div>
				<div>
					<label for="nuevaContra2" class="block text-sm font-medium text-gray-700">Confirmar contraseña:</label>
					<input type="password" id="nuevaContra2" class="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" autocomplete="new-password" required>
				</div>

				<div class="flex justify-end gap-2 pt-2">
					<button type="button" id="cancelarCambioContra" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancelar</button>
					<button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
				</div>
			</form>
		</div>
	</div>

	<script src="js/pdf_logo.js"></script>
	<script src="js/dashboard.js"></script>
	<script src="js/cambiar_contra.js"></script>
	<script src="js/reporte.js"></script>
</body>

</html>
