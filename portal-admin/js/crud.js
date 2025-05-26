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

window.addEventListener('DOMContentLoaded', () => {
	document.getElementById("titulo").textContent = " | Administrar " + tablaNombre + "s";
	cargarDatos();
});
