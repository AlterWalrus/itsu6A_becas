const DURACION_RESULTADO = 10000;
const CAFE = 1;
const CONTACTO = "\r\nPara más información contacte a CESA123@gmail.com";

let resultadoTimeout;

setInterval(() => {
	fetch("php/verificar_huella.php")
		.then(res => res.json())
		.then(data => {
			if (data.huella_detectada) {
				console.log(data);
				
				if(data.estatus_beca === 0){
					mostrarResultado(false, data.Nombre + ", tu cuenta está actualmente suspendida." + CONTACTO);
					return;
				}
				
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
	}, DURACION_RESULTADO);
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

/*
window.addEventListener('DOMContentLoaded', () => {
    fetch('php/iniciar_detector.php')
        .then(response => {
            if (!response.ok) {
                console.error("No se pudo iniciar el script de detección");
            } else {
                console.log("Script de detección iniciado correctamente");
            }
        })
        .catch(error => {
            console.error("Error al contactar PHP:", error);
        });
});
*/
