
document.getElementById("formLogin").addEventListener("submit", function (event) {
	event.preventDefault(); // Evita recargar la página

	const usuario = document.getElementById("usuario").value.trim();
	const contrasenia = document.getElementById("contrasenia").value;

	if (!usuario || !contrasenia) {
		alert("Por favor, completa ambos campos.");
		return;
	}

	fetch("php/login.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `usuario=${encodeURIComponent(usuario)}&contrasenia=${encodeURIComponent(contrasenia)}`,
		credentials: "include"
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		if (data.status === "ok") {
			window.location.href = "dashboard.php";
		} else {
			alert("Credenciales incorrectas");
		}
	})
	.catch(error => {
		console.error("Error en la solicitud:", error);
	});
});

/*
document.getElementById("btnIniciar").addEventListener("click", function (event) {
	event.preventDefault();
	const usuario = document.getElementById("usuario").value;
	const contrasenia = document.getElementById("contrasenia").value;

	fetch("php/login.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `usuario=${encodeURIComponent(usuario)}&contrasenia=${encodeURIComponent(contrasenia)}`,
		credentials: "include"
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			if (data.status === "ok") {
				//localStorage.setItem("usuarioNombre", data.nombre);
				//localStorage.setItem("usuarioRol", data.rol);
				window.location.href = "dashboard.php";
			} else {
				alert("Credenciales incorrectas");
			}
		})
		.catch(error => {
			console.error("Error en la solicitud:", error);
		});
});
*/