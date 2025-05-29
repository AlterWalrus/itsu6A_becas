
document.getElementById("formLogin").addEventListener("submit", function (event) {
	event.preventDefault(); // Evita recargar la página

	const usuario = document.getElementById("usuario").value.trim();
	const contrasenia = document.getElementById("contrasenia").value;

	if (!usuario || !contrasenia) {
		alert("Por favor, rellena ambos campos.");
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
			
			fetch('php/modificar.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					tabla: "usuario",
					cambios: {
						id_: data.id,
						Ultimo_acceso: obtenerFechaHoraLocal()
					}
				})
			});
		} else {
			alert("Credenciales incorrectas");
		}
	})
	.catch(error => {
		console.error("Error en la solicitud:", error);
	});
});

function obtenerFechaHoraLocal() {
	const ahora = new Date();
	const yyyy = ahora.getFullYear();
	const mm = String(ahora.getMonth() + 1).padStart(2, '0');
	const dd = String(ahora.getDate()).padStart(2, '0');
	const hh = String(ahora.getHours()).padStart(2, '0');
	const mi = String(ahora.getMinutes()).padStart(2, '0');
	const ss = String(ahora.getSeconds()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}


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