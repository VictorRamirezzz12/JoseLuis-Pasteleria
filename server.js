const express = require('express');
const cors = require('cors');
const path = require('path');
const UserDao = require('./DAO/userDao');
const StockDao = require('./DAO/stockDao');
const VentaDao = require('./DAO/ventaDao');
const CategoriaDao = require('./DAO/categoriaDao');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'Pasteleria Jose Luis (3)', 'Pasteleria Jose Luis')));

// ==================== RUTAS DE USUARIOS ====================
app.get('/api/usuarios', (req, res) => {
    UserDao.getAllUsers((err, usuarios) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(usuarios);
    });
});

app.get('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    UserDao.getUserById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener usuario' });
        }
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(usuario);
    });
});

app.post('/api/usuarios', (req, res) => {
    const { usuario, password, rol, nombre } = req.body;
    if (!usuario || !password || !rol || !nombre) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    UserDao.createUser(usuario, password, rol, nombre, (err, id) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear usuario' });
        }
        res.json({ id, message: 'Usuario creado exitosamente' });
    });
});

app.put('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { usuario, password, rol, nombre } = req.body;
    if (!usuario || !password || !rol || !nombre) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    UserDao.updateUser(id, usuario, password, rol, nombre, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar usuario' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
    });
});

app.delete('/api/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    UserDao.deleteUser(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }
        res.json({ message: 'Usuario eliminado exitosamente' });
    });
});

// ==================== RUTAS DE LOGIN ====================
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    
    UserDao.getAllUsers((err, usuarios) => {
        if (err) {
            return res.status(500).json({ error: 'Error al validar credenciales' });
        }
        
        const user = usuarios.find(u => u.usuario === usuario && u.password === password);
        if (user) {
            res.json({ 
                success: true, 
                usuario: user.usuario,
                rol: user.rol,
                nombre: user.nombre
            });
        } else {
            res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
    });
});

// ==================== RUTAS DE CATEGORÍAS ====================
app.get('/api/categorias', (req, res) => {
    CategoriaDao.getAllCategorias((err, categorias) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener categorías' });
        }
        res.json(categorias);
    });
});

app.post('/api/categorias', (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
        return res.status(400).json({ error: 'Nombre de categoría requerido' });
    }
    CategoriaDao.createCategoria(nombre, (err, id) => {
        if (err) {
            return res.status(500).json({ error: 'Error al crear categoría' });
        }
        res.json({ id, message: 'Categoría creada exitosamente' });
    });
});

// ==================== RUTAS DE STOCK ====================
app.get('/api/stock', (req, res) => {
    StockDao.getAllStock((err, stock) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener stock' });
        }
        res.json(stock);
    });
});

app.get('/api/stock/:id', (req, res) => {
    const id = parseInt(req.params.id);
    StockDao.getStockById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener producto' });
        }
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(producto);
    });
});

app.post('/api/stock', (req, res) => {
    const { nombre_producto, cantidad, precio, id_categoria, unidad } = req.body;
    if (!nombre_producto || cantidad === undefined || precio === undefined || !id_categoria || !unidad) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    StockDao.createStock(nombre_producto, cantidad, precio, id_categoria, unidad, (err, id) => {
        if (err) {
            console.error('Error detallado al crear producto:', err);
            if (err.code === '23503') {
                return res.status(400).json({ error: 'La categoría seleccionada no existe. Por favor, seleccione una categoría válida.' });
            }
            return res.status(500).json({ error: err.message || 'Error al crear producto' });
        }
        res.json({ id, message: 'Producto creado exitosamente' });
    });
});

app.put('/api/stock/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre_producto, cantidad, precio, id_categoria, unidad } = req.body;
    if (!nombre_producto || cantidad === undefined || precio === undefined || !id_categoria || !unidad) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    StockDao.updateStock(id, nombre_producto, cantidad, precio, id_categoria, unidad, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar producto' });
        }
        res.json({ message: 'Producto actualizado exitosamente' });
    });
});

app.delete('/api/stock/:id', (req, res) => {
    const id = parseInt(req.params.id);
    StockDao.deleteStock(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar producto' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    });
});

// ==================== RUTAS DE VENTAS ====================
app.get('/api/ventas', (req, res) => {
    VentaDao.getAllVentas((err, ventas) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener ventas' });
        }
        res.json(ventas);
    });
});

app.get('/api/ventas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    VentaDao.getVentaById(id, (err, venta) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener venta' });
        }
        if (!venta) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(venta);
    });
});

app.post('/api/ventas', (req, res) => {
    const { id_producto, cantidad, precio, usuario, fecha } = req.body;
    if (!id_producto || !cantidad || !precio || !usuario) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    VentaDao.createVenta(id_producto, cantidad, precio, usuario, fecha, (err, id) => {
        if (err) {
            console.error('Error detallado al crear venta:', err);
            // Si es un error de foreign key, dar mensaje más específico
            if (err.code === '23503') {
                return res.status(400).json({ error: 'El producto con ID ' + id_producto + ' no existe en el stock. Por favor, verifique el ID del producto.' });
            }
            return res.status(500).json({ error: err.message || 'Error al crear venta' });
        }
        res.json({ id, message: 'Venta creada exitosamente' });
    });
});

app.put('/api/ventas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { id_producto, cantidad, precio, usuario, fecha } = req.body;
    if (!id_producto || !cantidad || !precio || !usuario) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    VentaDao.updateVenta(id, id_producto, cantidad, precio, usuario, fecha, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar venta' });
        }
        res.json({ message: 'Venta actualizada exitosamente' });
    });
});

app.delete('/api/ventas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    VentaDao.deleteVenta(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar venta' });
        }
        res.json({ message: 'Venta eliminada exitosamente' });
    });
});

app.post('/api/ventas/reportes', (req, res) => {
    const { fechaDesde, fechaHasta } = req.body;
    if (!fechaDesde || !fechaHasta) {
        return res.status(400).json({ error: 'Fechas requeridas' });
    }
    VentaDao.getVentasByDateRange(fechaDesde, fechaHasta, (err, ventas) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener reportes' });
        }
        res.json(ventas);
    });
});

// Ruta para servir el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pasteleria Jose Luis (3)', 'Pasteleria Jose Luis', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

