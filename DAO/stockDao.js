const { query } = require('../database/connection');

class StockDao {

    static getAllStock(callback) {
        const sql = `
            SELECT s.id, s.nombre_producto, s.cantidad, s.precio, s.unidad, c.nombre AS categoria
            FROM stock s
            INNER JOIN categorias c ON s.id_categoria = c.id
            WHERE s.activo = true
            ORDER BY s.id
        `;

        query(sql, [], (err, result) => {
            if (err) {
                console.error('Error al obtener stock:', err);
                callback(err, null);
            } else {
                callback(null, result.rows);
            }
        });
    }

    static getStockById(id, callback) {
        const sql = `
            SELECT s.*, c.nombre AS categoria
            FROM stock s
            INNER JOIN categorias c ON s.id_categoria = c.id
            WHERE s.id = $1 AND s.activo = true
        `;

        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al obtener producto:', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0] || null);
            }
        });
    }

    static createStock(nombre_producto, cantidad, precio, id_categoria, unidad, callback) {
        const sql = `
            INSERT INTO stock (nombre_producto, cantidad, precio, id_categoria, unidad, activo) 
            VALUES ($1, $2, $3, $4, $5, true) RETURNING id
        `;
        query(sql, [nombre_producto, cantidad, precio, id_categoria, unidad], (err, result) => {
            if (err) {
                console.error('Error al crear producto:', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0].id);
            }
        });
    }

    static updateStock(id, nombre_producto, cantidad, precio, id_categoria, unidad, callback) {
        const sql = `
            UPDATE stock 
            SET nombre_producto = $1, cantidad = $2, precio = $3, id_categoria = $4, unidad = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
        `;
        query(sql, [nombre_producto, cantidad, precio, id_categoria, unidad, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar producto:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    static deleteStock(id, callback) {
        const sql = 'UPDATE stock SET activo = false WHERE id = $1';
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar producto:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }
}

module.exports = StockDao;
