//Regresar
document.getElementById("btnPanel").addEventListener("click", function () {
	window.location.href = "dashboard.php";
});

const semestres =  {
		1: "Primero", 2: "Segundo", 3: "Tercero", 4: "Cuarto", 5: "Quinto", 
		6: "Sexto", 7: "Séptimo", 8: "Octavo", 9: "Noveno", 10: "Décimo"
	}

var tablaNombre = localStorage.getItem("tablaNombre");
var cafeterias = {};
var carreras = {};
var campos = [];
var huella=-1;

window.addEventListener('DOMContentLoaded', () => {
	/*fetch("php/obtener_ip_servidor.php")
		.then(res => res.text())
		.then(ip => {*/

			//const ws = new WebSocket(`ws://${ip.trim()}:1880/huella`);
			const ip = window.location.hostname;
			const ws = new WebSocket(`ws://${ip}:1880/huella`);

			document.getElementById("titulo").textContent = " | Administrar " + tablaNombre + "s";
			if(tablaNombre === 'Accion'){
				document.getElementById("titulo").textContent = " | Registro de acciones";
				document.getElementById("panelBotones").classList.add('hidden');
			}
			cargarDatos();

			// Comunicación con Node-RED
			ws.onmessage = function(event) {
				const estado = document.getElementById("estadoHuella");
				const mensaje = event.data.trim();

				if(mensaje == "WAIT_FINGER_1"){
					estado.classList.remove("text-green-600", "text-red-600");
					estado.classList.add("text-gray-600");
					estado.textContent = "Coloque su dedo en el sensor...";
				}else if(mensaje == "REMOVE_FINGER"){
					estado.textContent = "Retire su dedo del sensor.";
				}else if(mensaje == "WAIT_FINGER_2"){
					estado.textContent = "Coloque su dedo otra vez en el sensor...";
				}else if (mensaje.startsWith("ENROLL_OK")) {
					const id = mensaje.split(" ")[1];
					huella = id;
					estado.className = "text-green-600";
					estado.textContent = `✅ Huella registrada correctamente.`;
				} else if (mensaje.startsWith("ENROLL_FAIL")) {
					estado.className = "text-red-600";
					estado.textContent = "❌ Error al registrar la huella. Intente de nuevo.";
					document.getElementById("btnCapturarHuella").disabled = true;
				}
			};/*
		})
		.catch(err => {
			console.error("No se pudo obtener la IP del servidor:", err);
		});*/
});

/*
window.addEventListener('DOMContentLoaded', () => {
	document.getElementById("titulo").textContent = " | Administrar " + tablaNombre + "s";
	if(tablaNombre === 'Accion'){
		document.getElementById("titulo").textContent = " | Registro de acciones";
		document.getElementById("panelBotones").classList.add('hidden');
	}
	cargarDatos();

	//Comunicacion con node-red
	const ws = new WebSocket("ws://localhost:1880/huella");
	ws.onmessage = function(event) {
		const estado = document.getElementById("estadoHuella");
		const mensaje = event.data.trim();
		//console.log(mensaje);

		if(mensaje == "WAIT_FINGER_1"){
			estado.classList.remove("text-green-600");
			estado.classList.remove("text-red-600");
			estado.classList.add("text-gray-600");
			estado.textContent = "Coloque su dedo en el sensor...";
		}else if(mensaje == "REMOVE_FINGER"){
			estado.textContent = "Retire su dedo del sensor.";
		}else if(mensaje == "WAIT_FINGER_2"){
			estado.textContent = "Coloque su dedo otra vez en el sensor...";
		}else if (mensaje.startsWith("ENROLL_OK")) {
			const id = mensaje.split(" ")[1];
			huella = id;
			estado.className = "text-green-600";
			estado.textContent = `✅ Huella registrada correctamente.`;
		} else if (mensaje === "ENROLL_FAIL") {
			estado.className = "text-red-600";
			estado.textContent = "❌ Error al registrar la huella. Intente de nuevo.";
		}
	};
});
*/

//MODIFICAR Y ELIMINAR-------------------------------------------------
var modo = 0;

document.getElementById('btnModificar').addEventListener('click', () => {
	modo = 1;
	iniciarEdicion();
});

document.getElementById('btnEliminar').addEventListener('click', () => {
	modo = 2;
	inicarEliminacion();
});

//Cancelar----------------------------------------------------------------
document.getElementById('btnCancelar').addEventListener('click', () => {
	if (modo === 1) {
		//Edicion
		console.log("cancelar edicion");
		cargarDatos();
	} else if (modo === 2) {
		//Eliminacion
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
		confirmarEdicion();
	} else if (modo === 2) {
		confirmarEliminacion();
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
			fila.style.display = '';		// mostrar
		} else {
			fila.style.display = 'none';	// ocultar
		}
	});
});

