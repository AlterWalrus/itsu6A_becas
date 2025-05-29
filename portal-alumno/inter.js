const CAFE_ID = 1;
const CONTACTO = "\r\n\r\nPara más información contacta a cesa.itsu.95@gmail.com";

let duracion = 1000;
let resultadoTimeout;


const ws = new WebSocket("ws://localhost:1880/huella");
ws.onmessage = function(event) {
	const mensaje = event.data.trim();
	console.log(mensaje);

	if (mensaje.startsWith("DETECT ")) {
		const idHuella = mensaje.split(" ")[1];

		fetch("php/registrar_asistencia_completa.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: new URLSearchParams({
				huella: idHuella,
				cafeteria: CAFE_ID
			})
		})
		.then(res => res.json())
		.then(result => {
			duracion = 8000;

			console.log(result);
			switch(result.status){
				case 'asistencia_registrada':
					duracion = 5000;
					mostrarResultado(true, "¡Buen provecho, " + result.nombre + "!");
					break;
				case 'ya_asistio':
					mostrarResultado(false, result.nombre + ", ya has cobrado tu beca hoy." + CONTACTO);
					break;
				case 'suspendido':
					mostrarResultado(false, result.nombre + ", tu beca está actualmente suspendida." + CONTACTO);
					break;
				case 'cafeteria_incorrecta':
					mostrarResultado(false, result.nombre + ", tu beca es para otra cafetería." + CONTACTO);
					break;
				case 'no_encontrado':
					mostrarResultado(false, "Huella no reconocida." + CONTACTO);
					break;
				default:
					console.error("Error inesperado:", result);
			}
		})
		.catch(error => {
			console.error("Error al registrar asistencia:", error);
		});
	}
};

//Comunicacion con node-red
/*
const ws = new WebSocket("ws://localhost:1880/huella");
ws.onmessage = function(event) {
    const mensaje = event.data.trim();
    console.log(mensaje);
	if(mensaje.startsWith("DETECT ")){
		const id = mensaje.split(" ")[1];

		fetch("php/cargar_alumno.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: "huella=" + encodeURIComponent(id)
		})
		.then(res => res.json())
		.then(result => {
			console.log(result);
			if(result.status === 'ok'){
				duracion = 5000;
				mostrarResultado(true, "¡Buen provecho, " + result.alumno.Nombre + "!");
			}
		})
		.catch(error => {
			console.error("Error en la solicitud de asistencia:", error);
		});
	}
};
*/
// Cargar cafeterías
var cafeterias = {};
cargarDatos();

async function cargarDatos(){
	const resCafeterias = await fetch("php/cargar.php", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: `tablaNombre=cafeteria`
	});
	const dataCafeterias = await resCafeterias.json();

	dataCafeterias.forEach(cafe => {
		cafeterias[cafe.id_Cafeteria] = cafe.Nombre;
	});
}

/*
setInterval(() => {
	fetch("php/verificar_huella.php")
		.then(res => res.json())
		.then(data => {
			if (data.huella_detectada) {
				console.log(data);
				var fail = 8000;
				
				if(data.estatus_beca === 0){
					duracion = fail;
					mostrarResultado(false, data.Nombre + ", tu beca está actualmente suspendida." + CONTACTO);
					return;
				}
				
				if(data.id_Cafeteria !== CAFE_ID){
					cargarDatos();
					duracion = fail;
					mostrarResultado(false, data.Nombre + ", tu beca es para la cafetería " + cafeterias[data.id_Cafeteria] + "." + CONTACTO);
					return;
				}
				
				duracion = 5000;
				mostrarResultado(true, "¡Buen provecho, " + data.Nombre + "!");

				// Agregar asistencia
				fetch("php/registrar_asistencia.php", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: "id_Alumno=" + encodeURIComponent(data.id_Alumno)
				})
				.then(res => res.json())
				.then(result => {
					if (result.success) {
						console.log("nueva asistencia");
					} else if (result.error === "already_checked"){
						duracion = fail;
						mostrarResultado(false, data.Nombre + ", ya has cobrado tu beca hoy." + CONTACTO);
					} else {
						console.error("Error al registrar asistencia:", result.error);
					}
				})
				.catch(error => {
					console.error("Error en la solicitud de asistencia:", error);
				});
			}
		})
		.catch(() => {
			// No hacer nada si el archivo no existe o hay error
		});
}, 2000);
*/
function mostrarResultado(exito, mensaje) {
	clearTimeout(resultadoTimeout);

	const bienvenida = document.getElementById("bienvenida");
	const resultado = document.getElementById("resultado");

	// Preparar contenido
	const titulo = document.getElementById("tituloResultado");
	const mensajeTexto = document.getElementById("mensajeResultado");
	const gifChecked = document.getElementById("gifChecked");
	const gifError = document.getElementById("gifError");

	if (exito) {
		var audio = new Audio('valid.mp3');
		audio.play();
		gifChecked.classList.remove("hidden");
		gifError.classList.add("hidden");
	} else {
		var audio = new Audio('invalid.wav');
		audio.play();
		gifChecked.classList.add("hidden");
		gifError.classList.remove("hidden");
	}
	
	titulo.textContent = exito ? "¡Validación exitosa!" : "Validación fallida...";
	titulo.className = `text-3xl font-bold mb-2 ${exito ? "text-green-600" : "text-red-600"}`;
	mensajeTexto.setAttribute('style', 'white-space: pre;');
	mensajeTexto.textContent = mensaje;

	// Animar salida de bienvenida
	anime({
		targets: bienvenida,
		opacity: [1, 0],
		translateY: [0, -30],
		duration: 500,
		easing: 'easeInOutQuad',
		complete: () => {
			bienvenida.style.pointerEvents = 'none';

			// Mostrar resultado
			resultado.style.pointerEvents = 'auto';
			anime({
				targets: resultado,
				opacity: [0, 1],
				translateY: [30, 0],
				duration: 700,
				easing: 'easeOutExpo'
			});
		}
	});

	// Volver automaticamente a bienvenida
	resultadoTimeout = setTimeout(() => {
		resetPantalla();
	}, duracion);
}

function resetPantalla() {
	const bienvenida = document.getElementById("bienvenida");
	const resultado = document.getElementById("resultado");

	anime({
		targets: resultado,
		opacity: [1, 0],
		translateY: [0, 30],
		duration: 500,
		easing: 'easeInOutQuad',
		complete: () => {
			resultado.style.pointerEvents = 'none';

			// Volver a bienvenida
			bienvenida.style.pointerEvents = 'auto';
			anime({
				targets: bienvenida,
				opacity: [0, 1],
				translateY: [-30, 0],
				duration: 700,
				easing: 'easeOutExpo'
			});
		}
	});
}
