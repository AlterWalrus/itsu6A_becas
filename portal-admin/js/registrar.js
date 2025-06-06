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

	fetch('php/cargar_cafeterias.php')
		.then(response => response.json())
		.then(data => {
			data.forEach(cafe => {
				if (cafeterias[datos['id_Cafeteria']] === cafe.Nombre) {
					if (cafe.Ocupados == cafe.Capacidad) {
						alert("La cafetería seleccionada está llena.");
						return;
					}
				}
			});
		})
		.catch(error => {
			console.error("Error al obtener cafeterías:", error);
		});

	if (tablaNombre == 'Alumno' && huella == -1) {
		alert("Por favor, registre la huella digital.");
		return;
	}

	console.log(datos);

	datos['tabla'] = tablaNombre.toLowerCase();
	if (tablaNombre === 'Alumno') {
		datos['Huella'] = huella;
	}
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

				//Bitacora
				fetch('php/registrar.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						tabla: 'accion',
						Tabla_afectada: tablaNombre,
						Tipo_accion: 'INSERT',
						Fecha_cambio: new Date().toISOString().slice(0, 19).replace('T', ' '),
						id_Usuario: '1'
					})
				})
				.then(res => res.json())
				.then(resp => {
					console.log(resp);
				});
			} else {
				alert('Error: ' + resp.error);
			}
		});

});

function resetearCampos() {
	const form = document.getElementById("form");
	estadoHuella = document.getElementById("estadoHuella");
	if (estadoHuella != null) {
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
		document.getElementById("btnCapturarHuella").disabled = true;

		// Paso 1: Obtener IP de la computadora con Node-RED
		fetch("php/obtener_ip_servidor.php")
			.then(res => res.text())
			.then(ip => {
				console.log("IP del servidor:", ip);

				// Paso 2: Enviar solicitud a Node-RED en esa IP
				return fetch(`http://${ip.trim()}:1880/enroll`);
			})
			.then(response => response.text())
			.then(data => {
				console.log("Respuesta de Node-RED:", data);
			})
			.catch(error => {
				console.error("Error al contactar Node-RED:", error);
			});
	}
});

/*
document.addEventListener("click", function (e) {
	if (e.target && e.target.id === "btnCapturarHuella") {
		//const estado = document.getElementById("estadoHuella");
		document.getElementById("btnCapturarHuella").disabled = true;

		fetch("http://localhost:1880/enroll")
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
	}
});
		
		estado.classList.remove("text-green-600");
		estado.classList.remove("text-red-600");
		estado.classList.add("text-gray-600");
		estado.textContent = "Coloque y retire el dedo dos veces...";

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
*/
