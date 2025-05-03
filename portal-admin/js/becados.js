fetch('listar_becados.php')
  .then(response => response.json())
  .then(data => {
	console.log("hey");
	/*
    const tbody = document.getElementById('cuerpoTablaBecados');

    data.forEach(alumno => {
      const tr = document.createElement('tr');

	

      tr.innerHTML = `
        <td>${alumno.Nombre}</td>
        <td>${alumno.Apellido_paterno}</td>
        <td>${alumno.Apellido_materno}</td>
        <td>${alumno.No_Control}</td>
        <td>${alumno.Carrera}</td>
        <td>${alumno.Semestre}</td>
        <td>${alumno.Correo}</td>
        <td>${alumno.Telefono}</td>
        <td>${alumno.Cafeteria || '—'}</td>
        <td>
          <select>
            <option value="1" ${alumno.estatus_beca ? 'selected' : ''}>Activo</option>
            <option value="0" ${!alumno.estatus_beca ? 'selected' : ''}>Suspendido</option>
          </select>
        </td>
      `;

      tbody.appendChild(tr);
    });
	*/

  })
  .catch(err => {
    console.error("Error al obtener los becados (js):", err);
  });