//CARGAR WNS
const camposExcluidos = ["Huella", "Contrasenia"];
var usuarios = {};

async function cargarDatos() {
	try {
		// Cargar cafeterías
		const resCafeterias = await fetch("php/cargar.php", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `tablaNombre=cafeteria`
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
			body: `tablaNombre=carrera`
		});
		const dataCarreras = await resCarreras.json();
		carreras = {};
		dataCarreras.forEach(carrera => {
			carreras[carrera.id_Carrera] = carrera.Nombre;
		});

		// Cargar usuarios
		const resUsuarios = await fetch("php/cargar.php", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `tablaNombre=usuario`
		});
		const dataUsuarios = await resUsuarios.json();
		usuarios = {};
		dataUsuarios.forEach(usuario => {
			usuarios[usuario.id_Usuario] = usuario.Nombre;
		});

		// Cargar tabla principal
		const resDatos = await fetch("php/cargar.php", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: `tablaNombre=${encodeURIComponent(tablaNombre.toLowerCase())}`
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

		//Quitar campos especificos
		vkeys = vkeys.filter(k => !camposExcluidos.includes(k));

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
			if (key === idKey || camposExcluidos.includes(key)) return;

			if (key == "estatus_beca") {
				html += `<td class="px-2 py-2 editable" data-key="${key}">${estatus[fila[key]]}</td>`;
			} else if (key == "id_Carrera") {
				html += `<td class="px-2 py-2 editable" data-key="${key}">${carreras[fila[key]]}</td>`;
			} else if (key == "id_Cafeteria") {
				html += `<td class="px-2 py-2 editable" data-key="${key}">${cafeterias[fila[key]]}</td>`;
			} else if (key == "Semestre") {
				html += `<td class="px-2 py-2 editable" data-key="${key}">${semestres[fila[key]]}</td>`;
			} else if (key == "id_Usuario") {
				html += `<td class="px-2 py-2 editable" data-key="${key}">${usuarios[fila[key]]}</td>`;
			} else {
				html += `<td class="px-2 py-2 editable" data-key="${key}">${fila[key]}</td>`;
			}
		});
		tr.innerHTML = html;
		tbody.appendChild(tr);
	});
}

function crearFormulario(vkeys) {
	const form = document.getElementById("form");
	const camposExcluidos = ["estatus_beca", "Huella", "Ultimo_acceso"];
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

	if (tablaNombre === "Usuario") {
		const passwordHTML = `
			<div class="mb-4">
				<label for="password" class="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
				<input type="password" name="contrasenia" id="password" autocomplete="current-password"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					placeholder="Ingresa la contraseña">
			</div>
		`;
		form.insertAdjacentHTML("afterbegin", passwordHTML);
	}


	[...vkeys].reverse().forEach(key => {
		if (camposExcluidos.includes(key)) return;

		let inputElement = "";
		if (key in camposConSelect) {
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
			// Personalización por campo específico
			let tipo = "text";
			let atributosExtra = "";
			
			if (key.toLowerCase().includes("capacidad")) {
				atributosExtra = `maxlength="4" pattern="\\d" inputmode="numeric"`;
			} else if (key.toLowerCase().includes("correo")) {
				tipo = "email";
			} else if (key.toLowerCase().includes("telefono")) {
				tipo = "tel";
				atributosExtra = `maxlength="10" pattern="\\d{10}" inputmode="numeric"`;
			} else if (key === "No_control") {
				atributosExtra = `maxlength="8" pattern="\\d{8}" inputmode="numeric"`;
			}

			inputElement = `
				<label class="block">
					<span class="text-sm font-medium">${nombreColumna(key)}</span>
					<input name="${key}" type="${tipo}" placeholder="${nombreColumna(key)}"
						class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						${atributosExtra} />
				</label>
			`;
		}

		form.insertAdjacentHTML("afterbegin", inputElement);
	});
}

function nombreColumna(string) {
	string = string.replace("_", " ");
	string = string.replace("id ", "");
	if (string == "Telefono") {
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
