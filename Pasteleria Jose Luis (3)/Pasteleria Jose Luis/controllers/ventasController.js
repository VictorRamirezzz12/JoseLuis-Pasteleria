const API_URL = 'http://localhost:3000/api';

let ventas = [];
let productos = [];
let selectedVenta = null;

async function loadProductos() {
    try {
        const response = await fetch(`${API_URL}/stock`);
        if (response.ok) {
            productos = await response.json();
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

async function loadVentas() {
    try {
        const response = await fetch(`${API_URL}/ventas`);
        if (response.ok) {
            ventas = await response.json();
            displayVentas();
        } else {
            alert('Error al cargar ventas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

function displayVentas() {
    const tbody = document.querySelector('#ventasTable tbody');
    tbody.innerHTML = '';

    ventas.forEach((venta) => {
        const row = document.createElement('tr');
        row.dataset.id = venta.id;
        row.innerHTML = `
            <td>${venta.producto}</td>
            <td>${venta.id_producto}</td>
            <td>${venta.cantidad}</td>
            <td>S/. ${venta.precio}</td>
            <td>${venta.usuario}</td>
        `;
        row.addEventListener('click', () => selectVenta(venta));
        tbody.appendChild(row);
    });
}

function selectVenta(venta) {
    selectedVenta = venta;
    document.getElementById('usuario').value = venta.usuario;
    document.getElementById('cantidad').value = venta.cantidad;
    document.getElementById('idProducto').value = venta.id_producto;
    document.getElementById('precio').value = venta.precio;
}

function clearForm() {
    document.getElementById('usuario').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('idProducto').value = '';
    document.getElementById('precio').value = '';
    selectedVenta = null;
}

async function addVenta() {
    const usuario = document.getElementById('usuario').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const idProducto = parseInt(document.getElementById('idProducto').value);
    const precio = parseFloat(document.getElementById('precio').value);

    if (!usuario || !cantidad || !idProducto || !precio) {
        alert('Por favor, complete todos los campos');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_producto: idProducto,
                cantidad: cantidad,
                precio: precio,
                usuario: usuario,
                fecha: new Date().toISOString().split('T')[0]
            })
        });

        if (response.ok) {
            alert('Venta agregada exitosamente');
            clearForm();
            await loadVentas();
        } else {
            const error = await response.json();
            alert(error.error || 'Error al agregar venta');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

async function deleteVenta() {
    if (!selectedVenta) {
        alert('Por favor, seleccione una venta de la tabla haciendo clic en la fila');
        return;
    }

    if (confirm('¿Está seguro de que desea eliminar esta venta?')) {
        try {
            const response = await fetch(`${API_URL}/ventas/${selectedVenta.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Venta eliminada exitosamente');
                clearForm();
                await loadVentas();
            } else {
                const error = await response.json();
                alert(error.error || 'Error al eliminar venta');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    }
}

async function modifyVenta() {
    if (!selectedVenta) {
        alert('Por favor, seleccione una venta de la tabla haciendo clic en la fila');
        return;
    }

    const usuario = document.getElementById('usuario').value.trim();
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const idProducto = parseInt(document.getElementById('idProducto').value);
    const precio = parseFloat(document.getElementById('precio').value);

    if (!usuario || !cantidad || !idProducto || !precio) {
        alert('Por favor, complete todos los campos');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/ventas/${selectedVenta.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_producto: idProducto,
                cantidad: cantidad,
                precio: precio,
                usuario: usuario,
                fecha: selectedVenta.fecha || new Date().toISOString().split('T')[0]
            })
        });

        if (response.ok) {
            alert('Venta modificada exitosamente');
            clearForm();
            await loadVentas();
        } else {
            const error = await response.json();
            alert(error.error || 'Error al modificar venta');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProductos();
    loadVentas();

    document.getElementById('agregarBtn').addEventListener('click', addVenta);
    document.getElementById('eliminarBtn').addEventListener('click', deleteVenta);
    document.getElementById('modificarBtn').addEventListener('click', modifyVenta);
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});
