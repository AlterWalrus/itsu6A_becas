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
	<style>
		.logo-azul {
  			filter: invert(31%) sepia(96%) saturate(5152%) hue-rotate(188deg) brightness(90%) contrast(101%);
		}
	</style>
</head>

<!--body class="min-h-screen flex flex-col bg-[url('img/bg.png'),_linear-gradient(to_right,_#2563eb,_#8b5cf6)]"-->
<body class="min-h-screen flex flex-col bg-gradient-to-r from-blue-600 to-purple-500">
	<!-- Header -->
	<header class="bg-white shadow-md p-4 flex justify-between items-center">
		<div class="flex items-center gap-2">
			<img src="img/logo.png" alt="Logo" class="h-10 logo-azul">
		</div>
		<!-- Menú contextual -->
		<div class="relative">
			<button id="menuToggle" class="p-2 rounded hover:bg-blue-100 transition">
				<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2"
					viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
			<div id="menuDropdown" class="hidden absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-10">
				<ul class="text-gray-700">
					<li id="adminOption">
						<a id="btnUsuarios" class="block px-4 py-2 hover:bg-gray-100">Administrar usuarios</a>
					</li>
					<li>
						<a href="javascript:void(0)" onclick="cerrarSesion()"
							class="block px-4 py-2 hover:bg-gray-100">Cerrar sesión</a>
					</li>
				</ul>
			</div>
		</div>
	</header>

	<!-- Contenido principal -->
	<main class="flex-1 w-[98%] mx-auto p-6">
		<!-- Contenedor semitransparente con sombra -->
		<div class="bg-white/80 p-4 rounded shadow-md">

			<!-- Bienvenida -->
			<div class="flex items-center mb-4 gap-2">
				<h2 class="text-2xl font-semibold">
					¡Bienvenido, <?php echo htmlspecialchars($nombre); ?>!
				</h2>
				<div class="m-auto"></div>
				<img src="img/CESA_noborder.png" alt="Logo" class="h-12">
			</div>

			<!-- Panel dinámico según rol -->
			<div id="adminPanel" class="mb-8">
				<h3 class="text-lg font-bold mb-2">Panel de Administración</h3>
				<div class="flex gap-2 mb-4">
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
				</div>
			</div>

			<!-- Filtro de búsqueda -->
			<div class="flex items-center mb-4">
				<input type="week" class="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="filtroSemana">
				<input type="text" id="buscador" placeholder="Filtrar becados..."
					class="w-full px-4 py-2 rounded border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
			</div>

			<!-- Tabla de becados -->
			<div class="bg-white bg-opacity-90 shadow-md rounded overflow-hidden">
				<table id="tablaBecados" class="w-full text-left text-sm">
					<thead id="encabezadoTablaBecados" class="bg-blue-600 text-white"></thead>
					<tbody id="cuerpoTablaBecados"></tbody>
				</table>
			</div>
		</div>
	</main>

	<script src="js/dashboard.js"></script>
</body>

</html>
