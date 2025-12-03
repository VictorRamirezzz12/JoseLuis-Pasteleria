const { query } = require('../database/connection');

class CategoriaDao {

    static getAllCategorias(callback) {
        const sql = 'SELECT * FROM categorias ORDER BY id';
        query(sql, [], (err, result) => {
            if (err) {
                console.error('Error al obtener categorías:', err);
                callback(err, null);
            } else {
                callback(null, result.rows);
            }
        });
    }

    static getCategoriaById(id, callback) {
        const sql = 'SELECT * FROM categorias WHERE id = $1';
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al obtener categoría:', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0] || null);
            }
        });
    }

    static createCategoria(nombre, callback) {
        const sql = 'INSERT INTO categorias (nombre) VALUES ($1) RETURNING id';
        query(sql, [nombre], (err, result) => {
            if (err) {
                console.error('Error al crear categoría:', err);
                callback(err, null);
            } else {
                callback(null, result.rows[0].id);
            }
        });
    }

    static updateCategoria(id, nombre, callback) {
        const sql = 'UPDATE categorias SET nombre = $1 WHERE id = $2';
        query(sql, [nombre, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar categoría:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    static deleteCategoria(id, callback) {
        const sql = 'DELETE FROM categorias WHERE id = $1';
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar categoría:', err);
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }
}

module.exports = CategoriaDao;

