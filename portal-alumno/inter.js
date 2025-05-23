const CAFE_ID = 1;
const CONTACTO = "\r\n\r\nPara más información contacta a cesa.itsu.95@gmail.com";

let duracion = 1000;
let resultadoTimeout;

setInterval(() => {
	fetch("php/verificar_huella.php")
		.then(res => res.json())
		.then(data => {
			if (data.huella_detectada) {
				console.log(data);
				fail = 8000;
				
				if(data.estatus_beca === 0){
					duracion = fail;
					mostrarResultado(false, data.Nombre + ", tu beca está actualmente suspendida." + CONTACTO);
					return;
				}
				
				if(data.id_Cafeteria !== CAFE_ID){
					duracion = fail;
					mostrarResultado(false, data.Nombre + ", tu beca es para la cafetería " + data.id_Cafeteria + "." + CONTACTO);
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
					}else{
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
		gifChecked.classList.remove("hidden");
		gifError.classList.add("hidden");
	} else {
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

	// Volver automáticamente a bienvenida
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
