var valoresOriginales = {};

function iniciarEdicion() {
	document.getElementById('confirmPanel').classList.remove('hidden');
	document.getElementById('adminPanel').classList.add('hidden');

	const camposConSelect = {
		id_Carrera: carreras,
		id_Cafeteria: cafeterias,
		Semestre: semestres,
		estatus_beca: { 1: "Activo", 0: "Suspendido" },
		Rol: { "Admin": "Admin", "Miembro_CESA": "Miembro_CESA" }
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
}

function confirmarEdicion() {
	console.log("aceptar edicion");

	const camposConSelect = {
		id_Carrera: carreras,
		id_Cafeteria: cafeterias,
		Semestre: semestres,
		Rol: { "Admin": "Admin", "Miembro_CESA": "Miembro_CESA" }
	};

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
			fetch('php/modificar.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tabla: tablaNombre.toLowerCase(),
					cambios: cambios
				})
			})
				.then(res => res.json())
				.then(data => {
					if (data.status === 'ok') {
						cargarDatos();
					} else {
						console.error(data.error);
						alert('Error al guardar cambios: ' + data.error);
					}
				})
				.catch(err => {
					console.error(err);
					alert('Error en la comunicación con el servidor.');
				}); 
		}
	});
}
