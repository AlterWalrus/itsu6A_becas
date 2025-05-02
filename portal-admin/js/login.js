document.getElementById("btnIniciar").addEventListener("click", function () {
	const usuario = document.getElementById("usuario").value;
	const contrasenia = document.getElementById("contrasenia").value;
  
	fetch("php/login.php", {
	  method: "POST",
	  headers: {
		"Content-Type": "application/x-www-form-urlencoded",
	  },
	  body: `usuario=${encodeURIComponent(usuario)}&contrasena=${encodeURIComponent(contrasenia)}`
	})
	  .then(response => response.text())
	  .then(data => {
		if (data.trim() === "ok") {
		  window.location.href = "dashboard.html";
		} else {
		  console.log("Usuario o contraseña inválidos");
		  alert("Credenciales incorrectas");
		}
	  })
	  .catch(error => {
		console.error("Error en la solicitud:", error);
	  });
  });