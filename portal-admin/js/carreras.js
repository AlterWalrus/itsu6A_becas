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

//MODAL PA AGREGAR WNS
document.getElementById('btnAgregar').addEventListener('click', () => {
	document.getElementById('agregarCarrera').classList.remove('hidden');
	document.body.classList.add('modal-open');
});

document.getElementById("cancelarModal").addEventListener("click", () => {
	if (confirm("¿Cancelar registro?")) {
		document.getElementById('agregarCarrera').classList.add('hidden');
		document.body.classList.remove('modal-open');
		resetearCampos();
	}
});

document.getElementById("formCarrera").addEventListener("submit", function (e) {
	e.preventDefault();
	var nom = document.getElementById("Nombre").value;

	//Validacion de todos los campos
	if (nom === '') {
		alert("Por favor, llenar todos los campos.");
		return;
	}

	fetch("php/registro_carrera.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `nom=${encodeURIComponent(nom)}`
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "ok") {
				//Registro exitoso
				document.getElementById("agregarCarrera").classList.add("hidden");
				document.getElementById("exitoBox").classList.remove("hidden");
				document.getElementById("btnIrDashboard").addEventListener("click", () => {
					document.getElementById("exitoBox").classList.add("hidden");
					document.body.classList.remove('modal-open');
					resetearCampos();
					cargarCarreras();
				});
			} else {
				alert("Hubo un error al registrar: " + (data.error || "desconocido"));
			}
		})
		.catch(error => {
			console.error("Error en la solicitud:", error);
		});
});

function resetearCampos() {
	document.getElementById("Nombre").value = '';
}

//CARGAR WNS
async function cargarCarreras() {
	try {
		const resBecados = await fetch('php/cargar.php');
		const becados = await resBecados.json();

		const tbody = document.getElementById('cuerpoTablaCarreras');
		tbody.innerHTML = "";

		becados.forEach((becado, index) => {
			const tr = document.createElement('tr');
			tr.classList.add('editable-row');

			tr.dataset.id = becado.id_Carrera;

			tr.innerHTML = `
				<td class="px-2 py-2 hidden checkbox-col">
					<input type="checkbox" class="checkbox-becado" />
				</td>
				<td class="px-2 py-2">${index + 1}</td>
				<td class="px-2 py-2 editable" data-key="nombre">${becado.Nombre}</td>
				</td>
			`;
			tbody.appendChild(tr);
		});
	} catch (error) {
		console.error("Error al cargar datos:", error);
	}
}

//MODIFICAR Y ELIMINAR-------------
var modo = 0;
var valoresOriginales = {};

document.getElementById('btnModificar').addEventListener('click', () => {
	modo = 1;
	document.getElementById('confirmPanel').classList.remove('hidden');
	document.getElementById('adminPanel').classList.add('hidden');

	valoresOriginales = {};

	document.querySelectorAll('.editable-row').forEach((fila, filaIndex) => {
		valoresOriginales[filaIndex] = {};
		fila.querySelectorAll('.editable').forEach(celda => {
			const key = celda.getAttribute('data-key');
			const original = celda.textContent.trim();

			valoresOriginales[filaIndex][key] = original;

			const input = document.createElement('input');
			input.type = 'text';
			input.value = original;
			input.className = 'w-full px-2 py-1 rounded border';
			input.setAttribute('data-key', key);

			celda.innerHTML = '';
			celda.appendChild(input);
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

//Cancelar-------------------------
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
			document.querySelectorAll('.checkbox-becado').forEach(c => (c.checked = false));
		}
	document.getElementById('confirmPanel').classList.add('hidden');
	document.getElementById('adminPanel').classList.remove('hidden');
});

//Confirmar------------------------
document.getElementById('btnConfirmar').addEventListener('click', () => {
	//Edicion
	if (modo === 1) {
		console.log("aceptar edicion");
		document.querySelectorAll('.editable-row').forEach((fila, filaIndex) => {
			const celdas = fila.querySelectorAll('.editable');
			const cambios = {};

			celdas.forEach(celda => {
				const input = celda.querySelector('input');
				const key = celda.getAttribute('data-key');
				const nuevo = input.value.trim();
				const original = valoresOriginales[filaIndex][key];

				// Comparar original vs nuevo
				if (nuevo !== original) {
					cambios["id_Carrera"] = fila.dataset.id;
					cambios[key] = nuevo;
				}

				// Mostrar valor final
				celda.innerHTML = nuevo;
			});
			
			if (Object.keys(cambios).length > 0) {
				fetch("php/modificar.php", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: `id=${encodeURIComponent(cambios.id_Carrera)}&nom=${encodeURIComponent(cambios.nombre)}`
				})
					.then(response => response.json())
					.then(data => {
						if (data.status === "ok") {
							console.log(`Cambios en fila ${filaIndex + 1}:`, cambios);
						} else {
							alert("Hubo un error al actualizar datos: " + (data.error || "desconocido"));
						}
					})
					.catch(error => {
						console.error("Error en la solicitud:", error);
					});
			}
		});
	} else
		//Eliminacion
		if (modo === 2) {
			console.log("aceptar eliminacion");
			const seleccionados = document.querySelectorAll('.checkbox-becado:checked');
			if (seleccionados.length > 0) {
				if(!confirm("¿Eliminar " + seleccionados.length + " registro(s)?\nEsta acción no se puede revertir.")){
					return;
				}
				seleccionados.forEach(checkbox => {
					const fila = checkbox.closest('tr'); // Sube al <tr>
					const id = fila.dataset.id;
					/*
					fetch("php/eliminar.php", {
						method: "POST",
						headers: { "Content-Type": "application/x-www-form-urlencoded" },
						body: `id=${encodeURIComponent(id)}`
					})
						.then(response => response.json())
						.then(data => {
							console.log("ID eliminado:", id);
						})
						.catch(error => {
							alert("Este registro está enlazado con otros registros.");
						});
						*/
					});
					
			} else {
				alert('Selecciona al menos un elemento para eliminar.');
			}
			document.querySelectorAll('.checkbox-col').forEach(col => col.classList.add('hidden'));
			document.querySelectorAll('.checkbox-becado').forEach(c => (c.checked = false));
		}

	cargarCarreras(); 
	document.getElementById('confirmPanel').classList.add('hidden');
	document.getElementById('adminPanel').classList.remove('hidden');
});

//Filtrar--------------------------
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
	cargarCarreras();
});