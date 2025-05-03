document.getElementById("btnIniciar").addEventListener("click", function () {
	const usuario = document.getElementById("usuario").value;
	const contrasenia = document.getElementById("contrasenia").value;

	fetch("php/login.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `usuario=${encodeURIComponent(usuario)}&contrasenia=${encodeURIComponent(contrasenia)}`
	})
		.then(response => response.json())
		.then(data => {
			if (data.status === "ok") {
				// Guardar datos en localStorage
				localStorage.setItem("usuarioNombre", data.nombre);
				localStorage.setItem("usuarioRol", data.rol);
				window.location.href = "dashboard.html";
			} else {
				alert("Credenciales incorrectas");
			}
		})
		.catch(error => {
			console.error("Error en la solicitud:", error);
		});
});
