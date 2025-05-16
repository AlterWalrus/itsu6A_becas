const DURACION_RESULTADO = 3000; // Duración del mensaje de resultado en milisegundos (10 segundos)

let resultadoTimeout;

function mostrarResultado(exito, mensaje) {
	clearTimeout(resultadoTimeout); // En caso de múltiples llamadas seguidas

	document.getElementById("bienvenida").classList.add("hidden");
	document.getElementById("resultado").classList.remove("hidden");

	const titulo = document.getElementById("tituloResultado");
	const mensajeTexto = document.getElementById("mensajeResultado");

	if (exito) {
		titulo.textContent = "¡Canje exitoso!";
		titulo.classList.remove("text-red-600");
		titulo.classList.add("text-green-600");
	} else {
		titulo.textContent = "Canje fallido...";
		titulo.classList.remove("text-green-600");
		titulo.classList.add("text-red-600");
	}

	mensajeTexto.textContent = mensaje;

	anime({
		targets: "#resultado",
		opacity: [0, 1],
		scale: [0.95, 1],
		duration: 800,
		easing: "easeOutExpo"
	});

	// Volver automáticamente a pantalla de bienvenida
	resultadoTimeout = setTimeout(() => {
		resetPantalla();
	}, DURACION_RESULTADO);
}

function resetPantalla() {
	document.getElementById("resultado").classList.add("hidden");
	document.getElementById("bienvenida").classList.remove("hidden");
}