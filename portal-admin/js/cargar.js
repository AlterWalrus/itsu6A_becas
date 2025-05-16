//CARGAR WNS
async function cargarDatos() {
	try {
		// Cargar cafeterías
		const resCafeterias = await fetch("php/cargar.php", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `tablaNombre=Cafeteria`
		});
		const dataCafeterias = await resCafeterias.json();
		cafeterias = {};
		dataCafeterias.forEach(cafe => {
			cafeterias[cafe.id_Cafeteria] = cafe.Nombre;
		});

		// Cargar carreras
		const resCarreras = await fetch("php/cargar.php", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `tablaNombre=Carrera`
		});
		const dataCarreras = await resCarreras.json();
		carreras = {};
		dataCarreras.forEach(carrera => {
			carreras[carrera.id_Carrera] = carrera.Nombre;
		});

		// Cargar tabla principal
		const resDatos = await fetch("php/cargar.php", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `tablaNombre=${encodeURIComponent(tablaNombre)}`
		});
		const data = await resDatos.json();

		if (!Array.isArray(data) || data.length === 0) {
			console.warn("No hay datos para mostrar.");
			return;
		}

		const thead = document.querySelector("#tabla thead tr");
		const tbody = document.getElementById("cuerpoTabla");
		thead.innerHTML = `
			<th class="px-2 py-2 hidden checkbox-col">Eliminar</th>
			<th class="px-2 py-2 w-10">#</th>
		`;
		tbody.innerHTML = "";

		const keys = Object.keys(data[0]);
		let vkeys = keys.slice(1); // saltar ID
		campos = vkeys;

		vkeys.forEach(key => {
			thead.innerHTML += `<th class="px-2 py-2">${nombreColumna(key)}</th>`;
		});

		// Crear formulario y tabla solo cuando todo esta listo
		crearFormulario(vkeys);
		crearCuerpoTabla(data);

	} catch (error) {
		console.error("Error al cargar datos:", error);
	}
}

function crearCuerpoTabla(data) {
	const tbody = document.getElementById("cuerpoTabla");
	const keys = Object.keys(data[0]);
	let idKey = keys[0];
	data.forEach((fila, index) => {
		const tr = document.createElement('tr');
		if (idKey) {
			tr.dataset.id = fila[idKey];
		}

		let html = `
				<td class="px-2 py-2 hidden checkbox-col">
					<input type="checkbox" class="checkbox-dato" />
				</td>
				<td class="px-2 py-2">${index + 1}</td>
			`;

		estatus = { 1: "Activo", 0: "Suspendido" };
		keys.forEach(key => {
			if (key !== idKey) {
				if (key == "estatus_beca") {
					html += `<td class="px-2 py-2 editable" data-key="${key}">${estatus[fila[key]]}</td>`;
				} else if (key == "id_Carrera") {
					html += `<td class="px-2 py-2 editable" data-key="${key}">${carreras[fila[key]]}</td>`;
				} else if (key == "id_Cafeteria") {
					html += `<td class="px-2 py-2 editable" data-key="${key}">${cafeterias[fila[key]]}</td>`;
				} else if (key == "Semestre") {
					html += `<td class="px-2 py-2 editable" data-key="${key}">${semestres[fila[key]]}</td>`;
				} else {
					html += `<td class="px-2 py-2 editable" data-key="${key}">${fila[key]}</td>`;
				}
			}
		});
		tr.innerHTML = html;
		tbody.appendChild(tr);
	});
}

function crearFormulario(vkeys) {
	const form = document.getElementById("form");
	const camposExcluidos = ["estatus_beca", "Ultimo_acceso"];
	const camposConSelect = {
		id_Carrera: carreras,
		id_Cafeteria: cafeterias,
		Semestre: semestres,
		Rol: { "Admin": "Admin", "Miembro_CESA": "Miembro_CESA" }
	};

	form.querySelectorAll('input, select, textarea, label, .huella-container').forEach(el => el.remove());

	if (tablaNombre === "Alumno") {
		const huellaHTML = `
			<div class="huella-container flex items-center gap-1 mb-4">
				<button id="btnCapturarHuella" type="button"
					class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2">
					<img src="img/huellaBoton.png" alt="Huella" class="w-6 h-6">
					Capturar Huella
				</button>
				<span id="estadoHuella" class="text-gray-600 text-sm mx-4">Huella no registrada</span>
			</div>
		`;
		form.insertAdjacentHTML("afterbegin", huellaHTML);
	}

	// Agregar los campos al formulario
	[...vkeys].reverse().forEach(key => {
		if (camposExcluidos.includes(key)) return;

		let inputElement = "";
		if (key in camposConSelect) {
			// Select
			let opciones = Object.entries(camposConSelect[key]).map(([valor, texto]) =>
				`<option value="${valor}">${texto}</option>`
			).join("");

			inputElement = `
				<label class="block">
					<span class="text-sm font-medium">${nombreColumna(key)}</span>
					<select name="${key}" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
						${opciones}
					</select>
				</label>
			`;
		} else {
			// Campo de texto
			inputElement = `
				<label class="block">
					<span class="text-sm font-medium">${nombreColumna(key)}</span>
					<input name="${key}" type="text" placeholder="${nombreColumna(key)}"
						class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</label>
			`;
		}

		form.insertAdjacentHTML("afterbegin", inputElement);
	});
}

function nombreColumna(string) {
	string = string.replace("_", " ");
	string = string.replace("id ", "");
	if (string == "Contrasenia") {
		string = "Contraseña";
	} else if (string == "Telefono") {
		string = "Teléfono";
	} else if (string == "Cafeteria") {
		string = "Cafetería";
	} else if (string == "Ultimo acceso") {
		string = "Último acceso";
	} else if (string == "No control") {
		string = "No. control";
	}
	return string;
}