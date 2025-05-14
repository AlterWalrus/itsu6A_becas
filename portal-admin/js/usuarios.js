// Modal Agregar Usuario
document.getElementById("btnAgregarUsuario").addEventListener("click", () => {
	document.getElementById("modalAgregarUsuario").classList.remove("hidden");
});

document.getElementById("cancelarModal").addEventListener("click", () => {
	document.getElementById("modalAgregarUsuario").classList.add("hidden");
});

document.getElementById("formNuevoUsuario").addEventListener("submit", function (e) {
	e.preventDefault();
	alert("Usuario agregado correctamente (simulado)");
	document.getElementById("modalAgregarUsuario").classList.add("hidden");
});

// Variables de modo edición y eliminación
let editMode = false;
let deletionMode = false;
let originalValues = {};

// Función para modificar usuario
document.getElementById('btnModificarUsuario').addEventListener('click', () => {
	const filas = document.querySelectorAll('.editable-row .editable');

	if (editMode) {
		// Si ya está en modo edición, cancelar y restaurar los valores originales
		filas.forEach((cell, i) => {
			const key = cell.getAttribute('data-key');
			cell.innerHTML = originalValues[key + i];
		});
		editMode = false;
		return;
	}

	// Activar modo edición
	editMode = true;
	originalValues = {};

	filas.forEach((cell, i) => {
		const key = cell.getAttribute('data-key');
		const original = cell.textContent;
		originalValues[key + i] = original;

		// Para el campo "rol" se crea un select con las opciones
		if (key === 'rol') {
			const select = document.createElement('select');
			select.className = 'w-full px-2 py-1 rounded border';
			const optionAdmin = document.createElement('option');
			optionAdmin.value = 'Admin';
			optionAdmin.text = 'Admin';
			const optionMiembro = document.createElement('option');
			optionMiembro.value = 'Miembro CESA';
			optionMiembro.text = 'Miembro CESA';
			select.appendChild(optionAdmin);
			select.appendChild(optionMiembro);
			select.value = original;
			select.setAttribute('data-key', key);

			select.addEventListener('keydown', e => {
				if (e.key === 'Enter') {
					document.getElementById('modalConfirmacion').classList.remove('hidden');
					document.querySelector('#modalConfirmacion h2').innerText = 'Confirmar cambios';
					document.querySelector('#modalConfirmacion p').innerText = '¿Deseas guardar los cambios realizados?';
				}
			});
			cell.innerHTML = '';
			cell.appendChild(select);
		} else {
			const input = document.createElement('input');
			input.type = 'text';
			input.value = original;
			input.className = 'w-full px-2 py-1 rounded border';
			input.setAttribute('data-key', key);

			input.addEventListener('keydown', e => {
				if (e.key === 'Enter') {
					document.getElementById('modalConfirmacion').classList.remove('hidden');
					document.querySelector('#modalConfirmacion h2').innerText = 'Confirmar cambios';
					document.querySelector('#modalConfirmacion p').innerText = '¿Deseas guardar los cambios realizados?';
				}
			});
			cell.innerHTML = '';
			cell.appendChild(input);
		}
	});
});

// Confirmación y cancelación del modal
document.getElementById('btnCancelar').addEventListener('click', () => {
	if (editMode) {
		// Restaurar valores originales en modo edición
		document.querySelectorAll('.editable-row .editable').forEach((cell, i) => {
			const key = cell.getAttribute('data-key');
			cell.innerHTML = originalValues[key + i];
		});
		editMode = false;
	}
	document.getElementById('modalConfirmacion').classList.add('hidden');
});

document.getElementById('btnConfirmar').addEventListener('click', () => {
	if (editMode) {
		// Guardar cambios de la edición
		const nuevosDatos = {};
		document.querySelectorAll('.editable-row .editable').forEach((cell, i) => {
			const key = cell.getAttribute('data-key');
			let value;
			const input = cell.querySelector('input, select');
			if (input) {
				value = input.value;
				cell.innerHTML = value;
			} else {
				value = cell.textContent;
			}
			nuevosDatos[key] = value;
		});
		console.log('Datos actualizados:', nuevosDatos);
		editMode = false;
	} else if (deletionMode) {
		// Confirmar eliminación de usuarios seleccionados
		const seleccionados = document.querySelectorAll('.checkbox-usuario:checked');
		seleccionados.forEach(c => c.closest('tr').remove());
		deletionMode = false;
		document.querySelectorAll('.checkbox-col').forEach(col => col.classList.add('hidden'));
		document.removeEventListener('keydown', detectarEnterEliminar);
	}
	document.getElementById('modalConfirmacion').classList.add('hidden');
});

// Función para el modo de eliminación
document.getElementById('btnEliminarUsuario').addEventListener('click', () => {
	deletionMode = !deletionMode;
	document.querySelectorAll('.checkbox-col').forEach(col => {
		col.classList.toggle('hidden');
	});
	// Limpiar selección de checkboxes
	document.querySelectorAll('.checkbox-usuario').forEach(cb => cb.checked = false);

	if (deletionMode) {
		document.addEventListener('keydown', detectarEnterEliminar);
	} else {
		document.removeEventListener('keydown', detectarEnterEliminar);
	}
});

function detectarEnterEliminar(e) {
	if (e.key === 'Enter') {
		const seleccionados = document.querySelectorAll('.checkbox-usuario:checked');
		if (seleccionados.length > 0) {
			document.querySelector('#modalConfirmacion h2').innerText = 'Eliminar usuario(s)';
			document.querySelector('#modalConfirmacion p').innerText = `¿Estás seguro de eliminar ${seleccionados.length} usuario(s)? Esta acción no se puede deshacer.`;
			document.getElementById('modalConfirmacion').classList.remove('hidden');
		} else {
			alert('Selecciona al menos un usuario para eliminar.');
		}
	}
}

document.getElementById("btnPanel").addEventListener("click", function () {
	window.location.href = "dashboard.html";
});