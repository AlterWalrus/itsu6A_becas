function inicarEliminacion() {
	document.getElementById('confirmPanel').classList.remove('hidden');
	document.getElementById('adminPanel').classList.add('hidden');

	document.querySelectorAll('.checkbox-col').forEach(col => {
		col.classList.toggle('hidden');
	});
	document.querySelectorAll('.checkbox-carrera').forEach(c => (c.checked = false));
}

function confirmarEliminacion() {
	console.log("aceptar eliminacion");
	const seleccionados = document.querySelectorAll('.checkbox-dato:checked');
	if (seleccionados.length > 0) {
		if (!confirm("¿Eliminar " + seleccionados.length + " registro(s)?\nEsta acción no se puede revertir.")) {
			return;
		}
		seleccionados.forEach(checkbox => {
			const fila = checkbox.closest('tr');
			const id = fila.dataset.id;

			fetch("php/eliminar.php", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: `tabla=${encodeURIComponent(tablaNombre.toLowerCase())}&id=${encodeURIComponent(id)}`
			})
				.then(response => response.json())
				.then(data => {
					if (data.status === 'ok') {
						//Bitacora
						fetch('php/registrar.php', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								tabla: 'accion',
								Tabla_afectada: tablaNombre,
								Tipo_accion: 'DELETE',
								Fecha_cambio: new Date().toISOString().slice(0, 19).replace('T', ' '),
								id_Usuario: '1'
							})
						})
							.then(res => res.json())
							.then(resp => {
								console.log(resp);
							});
					} else {
						alert("Este registro está enlazado con otros registros.");
					}
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