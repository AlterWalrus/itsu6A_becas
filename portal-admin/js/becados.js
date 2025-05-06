//Regresar
document.getElementById("btnPanel").addEventListener("click", function () {
	window.location.href = "dashboard.html";
});

//CONCEDER PERMISOS SEGUN ROL
const usuario = {
	nombre: localStorage.getItem("usuarioNombre"),
	rol: localStorage.getItem("usuarioRol")
};

if (usuario.rol === "Admin" || usuario.rol === "Miembro_CESA") {
	document.getElementById('adminPanel').classList.remove('hidden');
}
/*
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

let editMode = false;
let originalValues = {};

document.getElementById('btnModificar').addEventListener('click', () => {
	const filas = document.querySelectorAll('.editable-row .editable');

	if (editMode) {
		// Si ya está en modo edición, cancelar y restaurar los valores
		filas.forEach((cell, i) => {
			const key = cell.getAttribute('data-key');
			cell.innerHTML = originalValues[key + i];
		});
		editMode = false;
		return;
	}

	// Activar modo edición
	editMode = true;
	originalValues = {}; // Limpiar valores previos

	filas.forEach((cell, i) => {
		const key = cell.getAttribute('data-key');
		const original = cell.textContent;
		originalValues[key + i] = original;

		const input = document.createElement('input');
		input.type = 'text';
		input.value = original;
		input.className = 'w-full px-2 py-1 rounded border';
		input.setAttribute('data-key', key);

		input.addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				document.getElementById('modalConfirmacion').classList.remove('hidden');
			}
		});

		cell.innerHTML = '';
		cell.appendChild(input);
	});
});

const modalConfirmacion = document.getElementById('modalConfirmacion');

document.getElementById('btnCancelar').addEventListener('click', () => {
	// Restaurar los valores originales
	document.querySelectorAll('.editable-row .editable').forEach((cell, i) => {
		const key = cell.getAttribute('data-key');
		cell.innerHTML = originalValues[key + i];
	});
	editMode = false;
	modalConfirmacion.classList.add('hidden');
});

document.getElementById('btnConfirmar').addEventListener('click', () => {
	const nuevosDatos = {};
	document.querySelectorAll('.editable-row .editable input').forEach(input => {
		const key = input.getAttribute('data-key');
		const value = input.value;
		nuevosDatos[key] = value;
		input.parentElement.innerHTML = value;
	});

	// Aquí irá la lógica para guardar los cambios
	console.log('Datos actualizados:', nuevosDatos);

	modalConfirmacion.classList.add('hidden');
	editMode = false;
});

// === ELIMINAR BECADO con modal reutilizado ===
let eliminarModo = false;

document.getElementById('btnEliminar').addEventListener('click', () => {
	eliminarModo = !eliminarModo;

	// Mostrar u ocultar columna de checkboxes
	document.querySelectorAll('.checkbox-col').forEach(col => {
		col.classList.toggle('hidden');
	});

	// Limpiar checkboxes
	document.querySelectorAll('.checkbox-becado').forEach(c => (c.checked = false));

	if (eliminarModo) {
		// Escuchar Enter
		document.addEventListener('keydown', detectarEnterEliminar);
	} else {
		document.removeEventListener('keydown', detectarEnterEliminar);
	}
});

function detectarEnterEliminar(e) {
	if (e.key === 'Enter') {
		const seleccionados = document.querySelectorAll('.checkbox-becado:checked');
		if (seleccionados.length > 0) {
			// Personaliza el texto del modal para eliminación
			document.querySelector('#modalConfirmacion h2').innerText = 'Eliminar becado(s)';
			document.querySelector('#modalConfirmacion p').innerText =
				`¿Estás seguro de eliminar ${seleccionados.length} becado(s)? Esta acción no se puede deshacer.`;

			document.getElementById('modalConfirmacion').classList.remove('hidden');

			// Cancelar eliminación
			document.getElementById('btnCancelar').onclick = () => {
				document.getElementById('modalConfirmacion').classList.add('hidden');
				eliminarModo = false;
				document.querySelectorAll('.checkbox-col').forEach(col => col.classList.add('hidden'));
				document.querySelectorAll('.checkbox-becado').forEach(c => (c.checked = false));
				document.removeEventListener('keydown', detectarEnterEliminar);
			};

			// Confirmar eliminación
			document.getElementById('btnConfirmar').onclick = () => {
				seleccionados.forEach(c => c.closest('tr').remove());
				document.getElementById('modalConfirmacion').classList.add('hidden');
				eliminarModo = false;
				document.querySelectorAll('.checkbox-col').forEach(col => col.classList.add('hidden'));
				document.removeEventListener('keydown', detectarEnterEliminar);
			};
		} else {
			alert('Selecciona al menos un becado para eliminar.');
		}
	}
}
*/
//MODAL PA AGREGAR WNS
document.getElementById('btnAgregar').addEventListener('click', () => {
	document.getElementById('agregarBecado').classList.remove('hidden');
	document.body.classList.add('modal-open');
});

document.getElementById('cancelarModal').addEventListener('click', () => {
	document.getElementById('agregarBecado').classList.add('hidden');
	document.body.classList.remove('modal-open');
	resetearCampos();
});

document.getElementById("btnCapturarHuella").addEventListener("click", () => {
	console.log("Captura de huella");
});

document.getElementById("formBecado").addEventListener("submit", function (e) {
	e.preventDefault();
	var nom = document.getElementById("Nombre").value;
	var app = document.getElementById("ApellidoP").value;
	var apm = document.getElementById("ApellidoM").value;
	var nct = document.getElementById("NoControl").value;
	var eml = document.getElementById("Email").value;
	var tel = document.getElementById("Tel").value;
	var crr = document.getElementById("Carrera").value;
	var sem = document.getElementById("Semestre").value;
	var caf = document.getElementById("Cafeteria").value;

	//Validacion de todos los campos
	if (nom === '' || app === '' || apm === '' || nct === '' ||
		eml === '' || tel === '' || crr === '' || sem === '' || caf === ''
	) {
		alert("Por favor, llenar todos los campos.");
		return;
	}

	fetch("php/registro_becado.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `nom=${encodeURIComponent(nom)}
		&app=${encodeURIComponent(app)}
		&apm=${encodeURIComponent(apm)}
		&nct=${encodeURIComponent(nct)}
		&eml=${encodeURIComponent(eml)}
		&tel=${encodeURIComponent(tel)}
		&crr=${encodeURIComponent(crr)}
		&sem=${encodeURIComponent(sem)}
		&caf=${encodeURIComponent(caf)}`
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "ok") {
				//Registro exitoso
				document.getElementById("agregarBecado").classList.add("hidden");
				document.getElementById("exitoBox").classList.remove("hidden");
				document.getElementById("btnIrDashboard").addEventListener("click", () => {
					document.getElementById("exitoBox").classList.add("hidden");
					document.body.classList.remove('modal-open');
					resetearCampos();
					cargarBecados();
				});
			} else {
				alert("Hubo un error al registrar: " + (data.error || "desconocido"));
			}
		})
		.catch(error => {
			console.error("Error en la solicitud:", error);
		});
});

document.getElementById("cancelarModal").addEventListener("click", () => {
	if (confirm("¿Cancelar registro?")) {
		document.getElementById("agregarBecado").classList.add("hidden");
	}
});

function resetearCampos() {
	document.getElementById("Nombre").value = '';
	document.getElementById("ApellidoP").value = '';
	document.getElementById("ApellidoM").value = '';
	document.getElementById("NoControl").value = '';
	document.getElementById("Email").value = '';
	document.getElementById("Tel").value = '';
	document.getElementById("Carrera").value = '';
	document.getElementById("Semestre").value = '';
	document.getElementById("Cafeteria").value = '';
}

//CARGAR WNS
async function cargarBecados() {
	try {
		const resCafes = await fetch('php/cargar_cafeterias.php');
		const datosCafes = await resCafes.json();
		const cafeterias = {};
		datosCafes.forEach(cafe => {
			cafeterias[cafe.id_Cafeteria] = cafe.Nombre;
		});

		const resCarreras = await fetch('php/cargar_carreras.php');
		const datosCarreras = await resCarreras.json();
		const carreras = {};
		datosCarreras.forEach(carrera => {
			carreras[carrera.id_Carrera] = carrera.Nombre;
		});

		const resBecados = await fetch('php/cargar_becados.php');
		const becados = await resBecados.json();

		const tbody = document.getElementById('cuerpoTablaBecados');
		tbody.innerHTML = "";

		becados.forEach((becado, index) => {
			const tr = document.createElement('tr');
			tr.classList.add('editable-row');

			tr.innerHTML = `
				<td class="px-2 py-2 hidden checkbox-col">
					<input type="checkbox" class="checkbox-becado" />
				</td>
				<td class="px-2 py-2">${index + 1}</td>
				<td class="px-2 py-2 editable" data-key="nombre">${becado.Nombre}</td>
				<td class="px-2 py-2 editable" data-key="apellidoPaterno">${becado.Apellido_paterno}</td>
				<td class="px-2 py-2 editable" data-key="apellidoMaterno">${becado.Apellido_materno}</td>
				<td class="px-2 py-2 editable" data-key="noControl">${becado.No_control}</td>
				<td class="px-2 py-2 editable" data-key="carrera">${carreras[becado.id_Carrera]}</td>
				<td class="px-2 py-2 editable" data-key="semestre">${becado.Semestre}</td>
				<td class="px-2 py-2 editable" data-key="correo">${becado.Correo}</td>
				<td class="px-2 py-2 editable" data-key="telefono">${becado.Telefono}</td>
				<td class="px-2 py-2">${cafeterias[becado.id_Cafeteria]}</td>
				<td class="px-2 py-2">
					<select class="rounded px-2 py-1 border border-gray-300">
						<option value="1" ${becado.estatus_beca == 1 ? 'selected' : ''}>✔️ Activo</option>
						<option value="0" ${becado.estatus_beca == 0 ? 'selected' : ''}>❌ Suspendido</option>
					</select>
				</td>
			`;
			tbody.appendChild(tr);
		});
	} catch (error) {
		console.error("Error al cargar datos:", error);
	}
}

window.addEventListener('DOMContentLoaded', () => {
	cargarBecados();
});