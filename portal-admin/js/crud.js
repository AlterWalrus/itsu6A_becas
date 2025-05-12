//Regresar
document.getElementById("btnPanel").addEventListener("click", function () {
	window.location.href = "dashboard.html";
});

var cafeterias = {};
var carreras = {};
var campos = [];

//CONCEDER PERMISOS SEGUN ROL
var tablaNombre = localStorage.getItem("tablaNombre");
const usuario = {
	nombre: localStorage.getItem("usuarioNombre"),
	rol: localStorage.getItem("usuarioRol")
};

if (usuario.rol === "Admin" || usuario.rol === "Miembro_CESA") {
	document.getElementById('adminPanel').classList.remove('hidden');
}

//MODAL PA AGREGAR WNS------------------------------------------------------
document.getElementById('btnAgregar').addEventListener('click', () => {
	document.getElementById('agregar').classList.remove('hidden');
	document.body.classList.add('modal-open');
});

document.getElementById("cancelarModal").addEventListener("click", () => {
	if (confirm("¿Cancelar registro?")) {
		document.getElementById('agregar').classList.add('hidden');
		document.body.classList.remove('modal-open');
		resetearCampos();
	}
});

document.getElementById("form").addEventListener("submit", function (e) {
	e.preventDefault();
	const formData = new FormData(this);
	const datos = {};

	for (let [clave, valor] of formData.entries()) {
		if (valor === '') {
			alert("Por favor, llenar todos los campos.");
			return;
		}
		datos[clave] = valor;
	}

	datos['tabla'] = tablaNombre; // Asegúrate de que esta variable existe en el contexto

	// Enviar al servidor
	fetch('php/registro.php', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(datos)
	})
		.then(res => res.json())
		.then(resp => {
			if (resp.status === 'ok') {
				document.getElementById("agregar").classList.add("hidden");
				document.getElementById("exitoBox").classList.remove("hidden");
				document.getElementById("btnCerrarExito").addEventListener("click", () => {
					document.getElementById("exitoBox").classList.add("hidden");
					document.body.classList.remove('modal-open');
					resetearCampos();
					cargarDatos();
				});
			} else {
				alert('Error: ' + resp.error);
			}
		});
});

function resetearCampos() {
	const form = document.getElementById("form");

	// Limpiar los valores de todos los campos excepto los excluidos
	form.querySelectorAll("input, select, textarea").forEach(el => {
		if (el.name) {
			if (el.tagName === "SELECT") {
				el.selectedIndex = 0; // Selecciona la primera opción
			} else {
				el.value = ""; // Vacía inputs y textareas
			}
		}
	});
}

//CARGAR WNS
async function cargarDatos() {
	try {
		const resCafes = await fetch('php/cargar_cafeterias.php');
		const datosCafes = await resCafes.json();
		cafeterias = {};
		datosCafes.forEach(cafe => {
			cafeterias[cafe.id_Cafeteria] = cafe.Nombre;
		});

		const resCarreras = await fetch('php/cargar_carreras.php');
		const datosCarreras = await resCarreras.json();
		carreras = {};
		datosCarreras.forEach(carrera => {
			carreras[carrera.id_Carrera] = carrera.Nombre;
		});

		fetch("php/cargar.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `tablaNombre=${encodeURIComponent(tablaNombre)}`
		})
			.then(response => response.json())
			.then(data => {
				if (!Array.isArray(data) || data.length === 0) {
					console.warn("No hay datos para mostrar.");
					return;
				}

				const thead = document.querySelector("#tabla thead tr");
				const tbody = document.getElementById("cuerpoTabla");
				const form = document.getElementById("form");

				thead.innerHTML = `
			<th class="px-2 py-2 hidden checkbox-col">Eliminar</th>
			<th class="px-2 py-2 w-10">#</th>
		`;
				tbody.innerHTML = "";

				const keys = Object.keys(data[0]);
				let idKey = null;

				// Saltar la primera wea en la fila pq es el ID
				idKey = keys[0];
				let vkeys = keys.slice(1);
				campos = vkeys;
				vkeys.forEach(key => {
					thead.innerHTML += `<th class="px-2 py-2">${nombreColumna(key)}</th>`;
				});

				//Formulario--------------------------------------------------
				const camposExcluidos = ["estatus_beca", "Ultimo_acceso"];
				const camposConSelect = {
					id_Carrera: carreras,		// debe ser un objeto como {1: "Ing. Sistemas", 2: "Contaduría", ...}
					id_Cafeteria: cafeterias,	// igual, {1: "Cafetería A", 2: "Cafetería B", ...}
					Semestre: {
						1: "Primero", 2: "Segundo", 3: "Tercero", 4: "Cuarto", 5: "Quinto",
						6: "Sexto", 7: "Séptimo", 8: "Octavo", 9: "Noveno", 10: "Décimo"
					},
					Rol: { "Admin": "Admin", "Miembro_CESA": "Miembro_CESA" }
				};

				form.querySelectorAll('input, select, textarea, label').forEach(el => el.remove());
				[...vkeys].reverse().forEach(key => {
					if (camposExcluidos.includes(key)) return; // Omitir campos

					let inputElement = "";
					if (key in camposConSelect) {
						// Campo tipo <select>
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
						// Campo de texto normal
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
				//--------------------------------------------------

				// Generar cuerpo
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

					keys.forEach(key => {
						if (key !== idKey) {
							if (key == "estatus_beca") {
								html += `
				<td class="px-2 py-2">
					<select class="rounded px-2 py-1 border border-gray-300">
						<option value="1" ${fila[key] == 1 ? 'selected' : ''}>🟢 Activo</option>
						<option value="0" ${fila[key] == 0 ? 'selected' : ''}>🔴 Suspendido</option>
					</select>
				</td>
			`;
							} else if (key == "id_Carrera") {
								html += `<td class="px-2 py-2 editable" data-key="${key}">${carreras[fila[key]]}</td>`;
							} else if (key == "id_Cafeteria") {
								html += `<td class="px-2 py-2 editable" data-key="${key}">${cafeterias[fila[key]]}</td>`;
							} else {
								html += `<td class="px-2 py-2 editable" data-key="${key}">${fila[key]}</td>`;
							}
						}
					});

					tr.innerHTML = html;
					tbody.appendChild(tr);
				});
			})
			.catch(error => {
				console.error("Error en la solicitud:", error);
			});
	} catch (error) {
		console.error("Error al cargar datos:", error);
	}
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

//MODIFICAR Y ELIMINAR-------------------------------------------------
var modo = 0;
var valoresOriginales = {};

document.getElementById('btnModificar').addEventListener('click', () => {
	modo = 1;
	document.getElementById('confirmPanel').classList.remove('hidden');
	document.getElementById('adminPanel').classList.add('hidden');

	const camposConSelect = {
	id_Carrera: carreras,
	id_Cafeteria: cafeterias,
	Semestre: {
		1: "Primero", 2: "Segundo", 3: "Tercero", 4: "Cuarto", 5: "Quinto",
		6: "Sexto", 7: "Séptimo", 8: "Octavo", 9: "Noveno", 10: "Décimo"
	}
};

valoresOriginales = {};
document.querySelectorAll('tbody tr').forEach((fila, filaIndex) => {
	valoresOriginales[filaIndex] = {};
	fila.classList.add('editable-row');

	fila.querySelectorAll('.editable').forEach(celda => {
		const key = celda.getAttribute('data-key');
		let texto = celda.textContent.trim();
		let valor = texto;

		if (camposConSelect[key]) {
			for (const [val, txt] of Object.entries(camposConSelect[key])) {
				if (txt === texto) {
					valor = val;
					break;
				}
			}
		}

		valoresOriginales[filaIndex][key] = valor; // Guardar valor real (ID)

		celda.innerHTML = ''; // Limpiar celda

		if (camposConSelect[key]) {
			const select = document.createElement('select');
			select.className = 'w-full px-2 py-1 rounded border';
			select.setAttribute('data-key', key);

			for (const [val, txt] of Object.entries(camposConSelect[key])) {
				const option = document.createElement('option');
				option.value = val;
				option.textContent = txt;
				if (val == valor) {
					option.selected = true;
				}
				select.appendChild(option);
			}

			celda.appendChild(select);
		} else {
			const input = document.createElement('input');
			input.type = 'text';
			input.value = texto;
			input.className = 'w-full px-2 py-1 rounded border';
			input.setAttribute('data-key', key);

			celda.appendChild(input);
		}
		});
	});
});

document.getElementById('btnEliminar').addEventListener('click', () => {
	modo = 2;
	document.getElementById('confirmPanel').classList.remove('hidden');
	document.getElementById('adminPanel').classList.add('hidden');

	document.querySelectorAll('.checkbox-col').forEach(col => {
		col.classList.toggle('hidden');
	});
	document.querySelectorAll('.checkbox-carrera').forEach(c => (c.checked = false));
});

//Cancelar----------------------------------------------------------------
document.getElementById('btnCancelar').addEventListener('click', () => {
	//Edicion
	if (modo === 1) {
		console.log("cancelar edicion");
		document.querySelectorAll('.editable-row').forEach((fila, filaIndex) => {
			const celdas = fila.querySelectorAll('.editable');
			celdas.forEach(celda => {
				const key = celda.getAttribute('data-key');
				const original = valoresOriginales[filaIndex][key];
				celda.innerHTML = original; // Restaurar el valor original
			});
		});
	} else
		//Eliminacion
		if (modo === 2) {
			console.log("cancelar eliminacion");
			document.querySelectorAll('.checkbox-col').forEach(col => col.classList.add('hidden'));
			document.querySelectorAll('.checkbox-dato').forEach(c => (c.checked = false));
		}
	document.getElementById('confirmPanel').classList.add('hidden');
	document.getElementById('adminPanel').classList.remove('hidden');
});

//Confirmar-------------------------------------------------------------
document.getElementById('btnConfirmar').addEventListener('click', () => {
	//Edicion
	if (modo === 1) {
	console.log("aceptar edicion");

		const camposConSelect = {
	id_Carrera: carreras,
	id_Cafeteria: cafeterias,
	Semestre: {
		1: "Primero", 2: "Segundo", 3: "Tercero", 4: "Cuarto", 5: "Quinto",
		6: "Sexto", 7: "Séptimo", 8: "Octavo", 9: "Noveno", 10: "Décimo"
	}
};

	const cambiosTotales = [];

	document.querySelectorAll('.editable-row').forEach((fila, filaIndex) => {
		const celdas = fila.querySelectorAll('.editable');
		const cambios = {};
		let huboCambios = false;

		celdas.forEach(celda => {
			const key = celda.getAttribute('data-key');
			const input = celda.querySelector('input, select');
			const nuevo = input.value.trim();
			const original = valoresOriginales[filaIndex][key];

			// Restaurar vista de la celda
			if (input.tagName === 'SELECT') {
				const textoSeleccionado = camposConSelect[key]?.[nuevo] || input.options[input.selectedIndex].text;
				celda.innerHTML = textoSeleccionado;
			} else {
				celda.innerHTML = nuevo;
			}

			// Comparar contra el valor guardado (ID real o texto según el caso)
			if (nuevo !== original) {
				if (!cambios["id_"]) cambios["id_"] = fila.dataset.id;
				cambios[key] = nuevo;
				huboCambios = true;
			}
		});

		if (huboCambios) {
			cambiosTotales.push(cambios);
		}
	});

	if (cambiosTotales.length > 0) {
		console.log("Cambios detectados:", cambiosTotales);
	} else {
		console.log("No se detectaron cambios.");
	}
} else if (modo === 2) {
		console.log("aceptar eliminacion");
		const seleccionados = document.querySelectorAll('.checkbox-dato:checked');
		if (seleccionados.length > 0) {
			if (!confirm("¿Eliminar " + seleccionados.length + " registro(s)?\nEsta acción no se puede revertir.")) {
				return;
			}
			seleccionados.forEach(checkbox => {
				const fila = checkbox.closest('tr'); // Sube al <tr>
				const id = fila.dataset.id;
				
				fetch("php/eliminar.php", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: `tabla=${encodeURIComponent(tablaNombre)}&id=${encodeURIComponent(id)}`
				})
					.then(response => response.json())
					.then(data => {
						console.log("ID eliminado:", id);
					})
					.catch(error => {
						alert("Este registro está enlazado con otros registros.");
					});
					
			});

		} else {
			alert('Selecciona al menos un elemento para eliminar.');
		}
		document.querySelectorAll('.checkbox-col').forEach(col => col.classList.add('hidden'));
		document.querySelectorAll('.checkbox-dato').forEach(c => (c.checked = false));
	}

	cargarDatos();
	document.getElementById('confirmPanel').classList.add('hidden');
	document.getElementById('adminPanel').classList.remove('hidden');
});



//Filtrar-----------------------------------------------------------------------
document.getElementById('buscador').addEventListener('input', function () {
	const filtro = this.value.toLowerCase();
	const filas = document.querySelectorAll('#cuerpoTabla tr');

	filas.forEach(fila => {
		const texto = fila.textContent.toLowerCase();
		if (texto.includes(filtro)) {
			fila.style.display = ''; // mostrar
		} else {
			fila.style.display = 'none'; // ocultar
		}
	});
});

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById("titulo").textContent = "Administrar " + tablaNombre + "s";
	cargarDatos();
});