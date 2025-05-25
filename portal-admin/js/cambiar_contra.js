document.getElementById("btnContra").addEventListener("click", () => {
    document.getElementById("modalCambioContra").classList.remove("hidden");
});

document.getElementById("cancelarCambioContra").addEventListener("click", () => {
    document.getElementById("modalCambioContra").classList.add("hidden");
});

document.getElementById("formCambioContra").addEventListener("submit", function(e) {
    e.preventDefault();

    const pass1 = document.getElementById("nuevaContra1").value;
    const pass2 = document.getElementById("nuevaContra2").value;

    if (pass1 !== pass2) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Enviar al servidor para guardar
    fetch('php/cambiar_contra.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaContra: pass1 })
    })
    .then(res => res.json())
    .then(res => {
		console.log(res);
        if (res.success) {
            alert("Contraseña actualizada correctamente.");
            document.getElementById("modalCambioContra").classList.add("hidden");
        } else {
            alert("Error al actualizar contraseña.");
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Ocurrió un error.");
    });
});
