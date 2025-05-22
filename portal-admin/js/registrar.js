//MODAL PA AGREGAR WNS------------------------------------------------------
var huella = -1;

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
	
	if(tablaNombre == 'Alumno' && huella == -1){
		alert("Por favor, registre la huella digital.");
		return;
	}

	datos['tabla'] = tablaNombre.toLowerCase();
	datos['Huella'] = huella;
	fetch('php/registrar.php', {
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
	estadoHuella = document.getElementById("estadoHuella");
	if(estadoHuella != null){
		estadoHuella.textContent = "Huella no registrada";
	}
	huella = -1;

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

document.addEventListener("click", function (e) {
	if (e.target && e.target.id === "btnCapturarHuella") {
		const estado = document.getElementById("estadoHuella");
		document.getElementById("btnCapturarHuella").disabled = true;
		
		estado.classList.remove("text-green-600");
		estado.classList.remove("text-red-600");
		estado.classList.add("text-gray-600");
		estado.textContent = "Esperando huella...";
		
		fetch("php/registrar_huella.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "accion=capturar"
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if (data.exito) {
					huella = data.mensaje;
					estado.textContent = "✅ Huella registrada con éxito";
					estado.classList.remove("text-gray-600");
					estado.classList.add("text-green-600");
				} else {
					estado.textContent = "❌ " + (data.mensaje || "Error al registrar huella");
					estado.classList.remove("text-gray-600");
					estado.classList.add("text-red-600");
				}
				document.getElementById("btnCapturarHuella").disabled = false;
			})
			.catch(error => {
				console.error("Error al capturar huella:", error);
				estado.textContent = "❌ Error de comunicación con el sensor";
				estado.classList.remove("text-gray-600");
				estado.classList.add("text-red-600");
				document.getElementById("btnCapturarHuella").disabled = false;
			});
	}
});

