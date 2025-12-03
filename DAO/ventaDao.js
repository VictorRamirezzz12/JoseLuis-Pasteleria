const { query } = require('../database/connection');

class VentaDao {

    static getAllVentas(callback) {
        const sql = `
            SELECT v.id, v.cantidad, v.precio, v.usuario, v.fecha, 
                   s.nombre_producto AS producto, s.id AS id_producto
            FROM ventas v
            INNER JOIN stock s ON v.id_producto = s.id
            WHERE v.activo = true
            ORDER BY v.fecha DESC, v.id DESC
        `;
        query(sql, [], (err, result) => {
            if (err) {
                console.error('Error al obtener ventas:', err);
                callback(err, null);
            } else {
                callback(null, result.rows);
            }
        });
    }

    static getVentaById(id, callback) {
        const sql = `
            SELECT v.*, s.nombre_producto AS producto
            FROM ventas v
            INNER JOIN stock s ON v.id_producto = s.id
            WHERE v.id = $1 AND v.activo = true
        `;
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al obtener venta:', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0] || null);
            }
        });
    }

    static createVenta(id_producto, cantidad, precio, usuario, fecha, callback) {
        const sql = `
            INSERT INTO ventas (id_producto, cantidad, precio, usuario, fecha, activo) 
            VALUES ($1, $2, $3, $4, $5, true) RETURNING id
        `;
        query(sql, [id_producto, cantidad, precio, usuario, fecha || new Date().toISOString().split('T')[0]], (err, result) => {
            if (err) {
                console.error('Error al crear venta:', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0].id);
            }
        });
    }

    static updateVenta(id, id_producto, cantidad, precio, usuario, fecha, callback) {
        const sql = `
            UPDATE ventas 
            SET id_producto = $1, cantidad = $2, precio = $3, usuario = $4, fecha = $5
            WHERE id = $6
        `;
        query(sql, [id_producto, cantidad, precio, usuario, fecha, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar venta:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    static deleteVenta(id, callback) {
        const sql = 'UPDATE ventas SET activo = false WHERE id = $1';
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar venta:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    static getVentasByDateRange(fechaDesde, fechaHasta, callback) {
        const sql = `
            SELECT v.id, v.cantidad, v.precio, v.usuario, v.fecha, 
                   s.nombre_producto AS producto, s.id AS id_producto
            FROM ventas v
            INNER JOIN stock s ON v.id_producto = s.id
            WHERE v.fecha >= $1 AND v.fecha <= $2 AND v.activo = true
            ORDER BY v.fecha DESC, v.id DESC
        `;
        query(sql, [fechaDesde, fechaHasta], (err, result) => {
            if (err) {
                console.error('Error al obtener ventas por rango:', err);
                callback(err, null);
            } else {
                callback(null, result.rows);
            }
        });
    }
}

module.exports = VentaDao;

