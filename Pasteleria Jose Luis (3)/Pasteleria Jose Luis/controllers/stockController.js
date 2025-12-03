const API_URL = 'http://localhost:3000/api';

class StockController {
    constructor() {
        this.productos = [];
        this.categorias = [];
        this.selectedProducto = null;
        this.init();
    }

    async init() {
        await this.loadCategorias();
        await this.loadProductos();
        this.displayProductos();
        this.bindEvents();
    }

    async loadCategorias() {
        try {
            const response = await fetch(`${API_URL}/categorias`);
            if (response.ok) {
                this.categorias = await response.json();
                this.populateCategoriaSelect();
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }

    populateCategoriaSelect() {
        const select = document.getElementById('categoria');
        if (select) {
            select.innerHTML = '<option value="">Seleccione categoría</option>';
            this.categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nombre;
                select.appendChild(option);
            });
        }
    }

    async loadProductos() {
        try {
            const response = await fetch(`${API_URL}/stock`);
            if (response.ok) {
                this.productos = await response.json();
            } else {
                alert('Error al cargar productos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    }

    displayProductos() {
        const tbody = document.getElementById('stockTableBody');
        tbody.innerHTML = '';

        this.productos.forEach((producto) => {
            const row = document.createElement('tr');
            row.dataset.id = producto.id;
            row.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre_producto}</td>
                <td>${Math.round(producto.cantidad)}</td>
                <td>${producto.categoria || 'Sin categoría'}</td>
                <td>
                    <button class="select-btn" onclick="stockController.selectProducto(${producto.id})">
                        Seleccionar
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async selectProducto(id) {
        try {
            const response = await fetch(`${API_URL}/stock/${id}`);
            if (response.ok) {
                this.selectedProducto = await response.json();
                this.fillForm(this.selectedProducto);
                this.highlightRow(id);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fillForm(producto) {
        document.getElementById('idProducto').value = producto.id;
        document.getElementById('nombreProducto').value = producto.nombre_producto;
        document.getElementById('cantidad').value = producto.cantidad;
        document.getElementById('unidad').value = producto.unidad;
        if (document.getElementById('categoria')) {
            document.getElementById('categoria').value = producto.id_categoria;
        }
        if (document.getElementById('precio')) {
            document.getElementById('precio').value = producto.precio;
        }
    }

    highlightRow(id) {
        document.querySelectorAll('.stock-table tbody tr').forEach(row => {
            if (parseInt(row.dataset.id) === id) {
                row.style.backgroundColor = '#e3f2fd';
            } else {
                row.style.backgroundColor = '';
            }
        });
    }

    clearForm() {
        document.getElementById('stockForm').reset();
        this.selectedProducto = null;
        document.querySelectorAll('.stock-table tbody tr').forEach(row => {
            row.style.backgroundColor = '';
        });
    }

    async agregarProducto() {
        const nombre = document.getElementById('nombreProducto').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const unidad = document.getElementById('unidad').value;
        const id_categoria = parseInt(document.getElementById('categoria')?.value);
        const precio = parseFloat(document.getElementById('precio')?.value);

        if (!nombre || isNaN(cantidad) || cantidad < 0 || !unidad || !id_categoria || isNaN(precio) || precio < 0) {
            alert('Por favor complete todos los campos correctamente. La categoría y el precio son obligatorios.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_producto: nombre,
                    cantidad: cantidad,
                    precio: precio,
                    id_categoria: id_categoria,
                    unidad: unidad
                })
            });

            if (response.ok) {
                alert('Producto agregado exitosamente');
                this.clearForm();
                await this.loadProductos();
                this.displayProductos();
            } else {
                const error = await response.json();
                alert(error.error || 'Error al agregar producto');
                console.error('Error del servidor:', error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    }

    async modificarProducto() {
        if (!this.selectedProducto) {
            alert('Por favor seleccione un producto de la tabla');
            return;
        }

        const nombre = document.getElementById('nombreProducto').value.trim();
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const unidad = document.getElementById('unidad').value;
        const id_categoria = parseInt(document.getElementById('categoria')?.value || 1);
        const precio = parseFloat(document.getElementById('precio')?.value || 0);

        if (!nombre || isNaN(cantidad) || cantidad < 0 || !unidad || !id_categoria) {
            alert('Por favor complete todos los campos correctamente');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/stock/${this.selectedProducto.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre_producto: nombre,
                    cantidad: cantidad,
                    precio: precio,
                    id_categoria: id_categoria,
                    unidad: unidad
                })
            });

            if (response.ok) {
                alert('Producto modificado exitosamente');
                this.clearForm();
                await this.loadProductos();
                this.displayProductos();
            } else {
                const error = await response.json();
                alert(error.error || 'Error al modificar producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    }

    async eliminarProducto() {
        if (!this.selectedProducto) {
            alert('Por favor seleccione un producto de la tabla');
            return;
        }

        const confirmar = confirm(`¿Está seguro de eliminar el producto "${this.selectedProducto.nombre_producto}"?`);
        
        if (confirmar) {
            try {
                const response = await fetch(`${API_URL}/stock/${this.selectedProducto.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Producto eliminado exitosamente');
                    this.clearForm();
                    await this.loadProductos();
                    this.displayProductos();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Error al eliminar producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        }
    }

    volverAlMenu() {
        window.location.href = 'dashboard.html';
    }

    async crearCategoria() {
        const nombre = document.getElementById('nuevaCategoriaNombre').value.trim();
        if (!nombre) {
            alert('Por favor ingrese un nombre para la categoría');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/categorias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre: nombre })
            });

            if (response.ok) {
                alert('Categoría creada exitosamente');
                document.getElementById('nuevaCategoriaForm').style.display = 'none';
                document.getElementById('nuevaCategoriaNombre').value = '';
                await this.loadCategorias();
                const nuevaCategoria = this.categorias.find(cat => cat.nombre === nombre);
                if (nuevaCategoria) {
                    document.getElementById('categoria').value = nuevaCategoria.id;
                }
            } else {
                const error = await response.json();
                alert(error.error || 'Error al crear categoría');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    }

    ocultarFormularioCategoria() {
        document.getElementById('nuevaCategoriaForm').style.display = 'none';
        document.getElementById('nuevaCategoriaNombre').value = '';
    }

    bindEvents() {
        document.getElementById('agregarBtn').addEventListener('click', () => this.agregarProducto());
        document.getElementById('modificarBtn').addEventListener('click', () => this.modificarProducto());
        document.getElementById('eliminarBtn').addEventListener('click', () => this.eliminarProducto());
        document.getElementById('backBtn').addEventListener('click', () => this.volverAlMenu());
        document.getElementById('guardarCategoriaBtn').addEventListener('click', () => this.crearCategoria());
        document.getElementById('cancelarCategoriaBtn').addEventListener('click', () => this.ocultarFormularioCategoria());
    }
}

let stockController;

document.addEventListener('DOMContentLoaded', () => {
    stockController = new StockController();
});
