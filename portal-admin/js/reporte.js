document.getElementById("btnReporte").addEventListener("click", function (event) {
	fetch("php/reporte.php")
		.then(response => response.json())
		.then(data => {
			if (data.status === "ok") {
				const textoReporte = data.reporte;

				// Usar jsPDF para generar el PDF
				const logoBase64 = pdf_logo;

				const { jsPDF } = window.jspdf;
				const doc = new jsPDF();

				const pageWidth = doc.internal.pageSize.getWidth();

				doc.addImage(logoBase64, 'PNG', 10, 10, 100, 16); // x, y, ancho, alto

				//Titulo
				doc.setFont("helvetica", "bold");
				doc.setFontSize(24);
				doc.setTextColor(40, 40, 40);
				doc.text("Reporte de Actividad Automático", pageWidth / 2, 40, { align: "center" });

				//Fecha y hora de generacion
				doc.setFont("helvetica", "normal");
				doc.setFontSize(12);
				doc.setTextColor(100);
				doc.text("Generado el " + new Date().toLocaleDateString() + " a las " + new Date().toLocaleTimeString(), pageWidth / 2, 50, { align: "center" });

				//Cuerpo
				doc.setTextColor(40, 40, 40);
				const maxLineLength = 200;
				const lines = doc.splitTextToSize(textoReporte, maxLineLength);
				doc.text(lines, 10, 70);

				const hoy = new Date();
				const dia = String(hoy.getDate()).padStart(2, '0');
				const mes = String(hoy.getMonth() + 1).padStart(2, '0');
				const anio = String(hoy.getFullYear()).slice(-2);

				const nombreArchivo = `checktec_reporte-${dia}-${mes}-${anio}.pdf`;
				doc.save(nombreArchivo);

			} else {
				alert("Error generando reporte");
			}
		})
		.catch(err => {
			console.error("Error:", err);
			alert("Error al generar el reporte");
		});
});