const API_URL = 'http://localhost:3000/api';

let reportes = [];
let ventasData = [];

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    
    try {
        const date = new Date(fecha);
        
        if (isNaN(date.getTime())) {
            return fecha;
        }
        
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const año = date.getFullYear();
        
        return `${dia}/${mes}/${año}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fecha;
    }
}

async function loadVentasData() {
    try {
        const response = await fetch(`${API_URL}/ventas`);
        if (response.ok) {
            ventasData = await response.json();
        } else {
            ventasData = [];
        }
    } catch (error) {
        console.error('Error al cargar ventas:', error);
        ventasData = [];
    }
}

function displayReportes(data) {
    const tbody = document.getElementById('reportesTableBody');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No hay datos para el período seleccionado</td></tr>';
        return;
    }

    data.forEach((venta) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatearFecha(venta.fecha)}</td>
            <td>${venta.usuario}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>S/. ${venta.precio}</td>
        `;
        tbody.appendChild(row);
    });
}

async function generarReporte() {
    const tipoReporte = document.getElementById('tipoReporte').value;
    const fechaDesde = document.getElementById('fechaDesde').value;
    const fechaHasta = document.getElementById('fechaHasta').value;

    try {
        let datosFiltrados = [];

        if (!fechaDesde || !fechaHasta) {
            const response = await fetch(`${API_URL}/ventas`);
            if (response.ok) {
                datosFiltrados = await response.json();
            }
        } else {
            const response = await fetch(`${API_URL}/ventas/reportes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fechaDesde: fechaDesde,
                    fechaHasta: fechaHasta
                })
            });

            if (response.ok) {
                datosFiltrados = await response.json();
            } else {
                alert('Error al generar reporte');
                return;
            }
        }

        displayReportes(datosFiltrados);
        reportes = datosFiltrados;

        if (datosFiltrados.length === 0) {
            alert(`No se encontraron ventas para el período seleccionado.`);
        } else {
            alert(`Reporte generado: ${datosFiltrados.length} registros encontrados`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function convertirImagenABase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const scale = 3;
                const maxWidth = 180;
                const maxHeight = 80;
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width * scale;
                canvas.height = height * scale;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0, width, height);
                const base64 = canvas.toDataURL('image/png', 1.0);
                resolve({ data: base64, width: width, height: height });
            } catch (e) {
                reject(e);
            }
        };
        img.onerror = () => {
            reject(new Error('No se pudo cargar la imagen'));
        };
        img.src = url;
    });
}

async function exportarPDF() {
    if (reportes.length === 0) {
        alert('No hay datos para exportar. Genere un reporte primero.');
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const fechaActual = new Date().toISOString().split('T')[0];
        const nombreArchivo = `reporte_ventas_${fechaActual}.pdf`;

        let logoData = null;
        try {
            const logoPath = 'img/LOGO (2).png';
            logoData = await convertirImagenABase64(logoPath);
        } catch (error) {
            console.warn('No se pudo cargar el logo:', error);
        }

        if (logoData && logoData.data) {
            const logoWidth = logoData.width * 0.5;
            const logoHeight = logoData.height * 0.5;
            doc.addImage(logoData.data, 'PNG', 165, 10, logoWidth, logoHeight);
        }

        doc.setFillColor(33, 150, 243);
        doc.rect(20, 15, 140, 20, 'F');
        
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('REPORTE DE VENTAS', 85, 28, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.text('PASTELERÍA JOSÉ LUIS', 105, 42, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont(undefined, 'normal');
        doc.text(`Fecha de generación: ${fechaActual}`, 105, 50, { align: 'center' });
        doc.text(`Total de registros: ${reportes.length}`, 105, 57, { align: 'center' });

        let yPos = 70;
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        
        doc.text('Fecha', 20, yPos);
        doc.text('Cliente', 50, yPos);
        doc.text('Producto', 85, yPos);
        doc.text('Cant.', 140, yPos);
        doc.text('Total', 165, yPos);

        doc.setDrawColor(0, 0, 0);
        doc.line(20, yPos + 3, 190, yPos + 3);

        yPos += 10;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);

        reportes.forEach((venta) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }

            doc.text(formatearFecha(venta.fecha), 20, yPos);
            doc.text(venta.usuario || 'N/A', 50, yPos);
            
            const producto = (venta.producto || 'N/A').substring(0, 25);
            doc.text(producto, 85, yPos);
            
            doc.text(String(venta.cantidad || 0), 140, yPos);
            doc.text(`S/. ${venta.precio || 0}`, 165, yPos);

            yPos += 7;
        });

        const totalVentas = reportes.reduce((sum, venta) => sum + (parseFloat(venta.precio) || 0), 0);
        const totalCantidad = reportes.reduce((sum, venta) => sum + (parseInt(venta.cantidad) || 0), 0);

        yPos += 5;
        doc.line(20, yPos, 190, yPos);
        yPos += 7;
        
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('TOTALES:', 20, yPos);
        doc.text(`Cantidad: ${totalCantidad}`, 100, yPos);
        doc.text(`Total: S/. ${totalVentas.toFixed(2)}`, 140, yPos);

        doc.save(nombreArchivo);
        alert('PDF exportado exitosamente');
    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Asegúrese de tener conexión a internet para cargar la librería jsPDF.');
    }
}

function setDefaultDates() {
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    loadVentasData();
    setDefaultDates();
    
    document.getElementById('reportesTableBody').innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">Seleccione un período y haga clic en "Generar Reporte"</td></tr>';

    document.getElementById('generarBtn').addEventListener('click', generarReporte);
    document.getElementById('exportarBtn').addEventListener('click', exportarPDF);
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});
