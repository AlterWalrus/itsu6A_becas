//Al iniciar
window.addEventListener('DOMContentLoaded', () => {
	const inputSemana = document.getElementById('filtroSemana');

	const ahora = new Date();
	const anio = ahora.getFullYear();

	const dia = new Date(Date.UTC(anio, ahora.getMonth(), ahora.getDate()));
	const primerJueves = new Date(Date.UTC(dia.getUTCFullYear(), 0, 4));
	const semana = Math.ceil((((dia - primerJueves) / 86400000) + primerJueves.getUTCDay() + 1) / 7);

	const semanaFormateada = semana.toString().padStart(2, '0');
	inputSemana.value = `${anio}-W${semanaFormateada}`;
	cargarAsistencias(anio, semana);
	cargarCafeterias();
});

//Filtrar
document.getElementById('buscador').addEventListener('input', function () {
	const filtro = this.value.toLowerCase();
	const filas = document.querySelectorAll('#cuerpoTablaBecados tr');

	filas.forEach(fila => {
		const texto = fila.textContent.toLowerCase();
		if (texto.includes(filtro)) {
			fila.style.display = ''; // mostrar
		} else {
			fila.style.display = 'none'; // ocultar
		}
	});
});

function cargarAsistencias(anio, semana) {
	fetch('php/asistencias.php', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `anio=${anio}&semana=${semana}`
	})
		.then(response => response.json())
		.then(data => {
			const encabezado = document.getElementById('encabezadoTablaBecados');
			const tbody = document.getElementById('cuerpoTablaBecados');
			tbody.innerHTML = "";
			encabezado.innerHTML = "";
			const tr = document.createElement('tr');

			if (data.length === 0) return;

			const diasValidos = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
			const dias = Object.keys(data[0].asistencias)
				.filter(dia => diasValidos.includes(dia.substring(0, 3)));

			const ths = [
				"<th class='px-2 py-2'>#</th>",
				"<th class='px-2 py-2'>Nombre</th>",
				"<th class='px-2 py-2'>Apellido Paterno</th>",
				"<th class='px-2 py-2'>Apellido Materno</th>",
				"<th class='px-2 py-2'>No. Control</th>",
				"<th class='px-2 py-2'>Carrera</th>"
			];

			const diasEsp = ["Lun", "Mar", "Mie", "Jue", "Vie"];
			var i = 0;
			dias.forEach(dia => {
				ths.push(`<th class='px-2 py-2 text-center'>${diasEsp[i]} ${dia.substring(4)}</th>`);
				i++;
			});

			ths.push("<th class='px-2 py-2'>Estatus Beca</th>");

			encabezado.innerHTML = `<tr>${ths.join("")}</tr>`;

			const keys = Object.keys(data[0]);
			let idKey = keys[0];
			data.forEach((becado, index) => {
				const tr = document.createElement('tr');
				if (idKey) {
					tr.dataset.id = becado[idKey];
				}
				let tds = [
					`<td class='px-2 py-2'>${index + 1}</td>`,
					`<td class='px-2 py-2'>${becado.Nombre}</td>`,
					`<td class='px-2 py-2'>${becado.Apellido_paterno}</td>`,
					`<td class='px-2 py-2'>${becado.Apellido_materno}</td>`,
					`<td class='px-2 py-2'>${becado.No_Control}</td>`,
					`<td class='px-2 py-2'>${becado.Carrera}</td>`
				];

				dias.forEach(dia => {
					const asistencia = becado.asistencias[dia] == 1 ? '✔️' : '-';
					tds.push(`<td class='px-2 py-2 text-center'>${asistencia}</td>`);
				});

				tds.push(`
				<td id="estatus" class="px-2 py-2">
					<select class="rounded px-2 py-1 border border-gray-300">
						<option value="1" ${becado.estatus_beca == 1 ? 'selected' : ''}>🟢 Activo</option>
						<option value="0" ${becado.estatus_beca == 0 ? 'selected' : ''}>🔴 Suspendido</option>
					</select>
				</td>
			`);

				tr.innerHTML = tds.join("");
				tbody.appendChild(tr);
			});
		})
		.catch(error => {
			console.error("Error al obtener asistencias:", error);
		});
}

//Estatus
document.addEventListener("change", function (e) {
	// Solo responder si fue un cambio en el select de estatus
	if (e.target && e.target.matches('#estatus select')) {
		const select = e.target;
		const nuevoEstatus = select.value;

		// Buscar el ID desde la fila <tr>
		const fila = select.closest('tr');
		const id = fila.dataset.id;

		if (!id) {
			console.warn("No se encontró el ID del registro.");
			return;
		}

		// Enviar al backend
		fetch("php/modificar.php", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				tabla: "alumno",
				cambios: {
					id_: id,
					estatus_beca: nuevoEstatus
				}
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.status === "ok") {
					console.log("Estatus actualizado");
				} else {
					console.error("Error en la actualización:", data.error);
					alert("No se pudo actualizar el estatus.");
				}
			})
			.catch(err => {
				console.error("Error de red:", err);
				alert("Error al comunicarse con el servidor.");
			});
	}
});


//Semana
document.getElementById('filtroSemana').addEventListener('change', (e) => {
	const valor = e.target.value; // Ej: "2025-W14"
	if (!valor) return;
	const [anio, semanaConW] = valor.split('-W');
	const semana = parseInt(semanaConW, 10);
	cargarAsistencias(anio, semana);
});

const buscador = document.getElementById('buscador');
if (buscador) {
	buscador.addEventListener('input', () => {
		const valor = buscador.value.toLowerCase();
		const filas = document.querySelectorAll('#tablaUsuarios tr');
		filas.forEach(fila => {
			const texto = fila.textContent.toLowerCase();
			fila.style.display = texto.includes(valor) ? '' : 'none';
		});
	});
}

// Menú contextual
document.getElementById("menuToggle").addEventListener("click", () => {
	document.getElementById("menuDropdown").classList.toggle("hidden");
});

function cerrarSesion() {
	window.location.href = "logout.php";
};

// Cerrar el menú contextual si se hace clic fuera de él
document.addEventListener("click", function (event) {
	const menu = document.getElementById("menuDropdown");
	const toggle = document.getElementById("menuToggle");

	// Si el clic no fue dentro del menú ni del botón
	if (!menu.contains(event.target) && !toggle.contains(event.target)) {
		menu.classList.add("hidden");
	}
});

//Cafeterias
function cargarCafeterias(){
	fetch('php/cargar_cafeterias.php')
		.then(response => response.json())
		.then(data => {
			mostrarCafeterias(data);
		})
		.catch(error => {
			console.error("Error al obtener información:", error);
		});
}

function mostrarCafeterias(cafeterias) {
  const container = document.getElementById("cafeterias");
  container.innerHTML = ""; // Limpiar

  cafeterias.forEach(cafe => {
    const porcentaje = Math.min(100, Math.round((cafe.Ocupados / cafe.Capacidad) * 100));
    const radio = 22;
    const circunferencia = 2 * Math.PI * radio;
    const offset = circunferencia * (1 - porcentaje / 100);

    const circleHTML = `
      <div class="circular-progress flex flex-col items-center text-center">
        <svg width="80" height="80">
          <circle class="bg" cx="28" cy="40" r="${radio}" />
          <circle class="progress" cx="28" cy="40" r="${radio}"
            stroke-dasharray="${circunferencia}"
            stroke-dashoffset="${offset}" />
        </svg>
        <div class="label">${cafe.Nombre}</div>
        <div class="mt-1 text-sm font-medium">${cafe.Ocupados}/${cafe.Capacidad}</div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", circleHTML);
  });
}

document.getElementById("btnBecados").addEventListener("click", function () {
	localStorage.setItem("tablaNombre", "Alumno");
	window.location.href = "crud.php";
});

document.getElementById("btnCafeterias").addEventListener("click", function () {
	localStorage.setItem("tablaNombre", "Cafeteria");
	window.location.href = "crud.php";
});

document.getElementById("btnCarreras").addEventListener("click", function () {
	localStorage.setItem("tablaNombre", "Carrera");
	window.location.href = "crud.php";
});

document.getElementById("btnUsuarios").addEventListener("click", function () {
	localStorage.setItem("tablaNombre", "Usuario");
	window.location.href = "crud.php";
});
