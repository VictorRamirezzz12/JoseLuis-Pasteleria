const { query } = require('../database/connection');

class UserDao {

    static getAllUsers(callback) {
        const sql = 'SELECT * FROM usuarios WHERE activo = true';
        query(sql, [], (err, result) => {
            if (err) {
                console.error('Error al obtener usuarios:', err);
                callback(err, null);
                return;
            }
            callback(null, result.rows);
        });
    }

    static getUserById(id, callback) {
        const sql = 'SELECT * FROM usuarios WHERE id = $1 AND activo = true';
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al obtener el usuario:', err);
                callback(err, null);
                return;
            }
            callback(null, result.rows[0] || null); 
        });
    }

    static createUser(usuario, password, rol, nombre, callback) {
        const sql = 'INSERT INTO usuarios (usuario, password, rol, nombre, activo) VALUES ($1, $2, $3, $4, true) RETURNING id';
        query(sql, [usuario, password, rol, nombre], (err, result) => {
            if (err) {
                console.error('Error al crear el usuario:', err);
                callback(err, null);
                return;
            }
            callback(null, result.rows[0].id); 
        });
    }

    static updateUser(id, usuario, password, rol, nombre, callback) {
        const sql = 'UPDATE usuarios SET usuario = $1, password = $2, rol = $3, nombre = $4 WHERE id = $5';
        query(sql, [usuario, password, rol, nombre, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar el usuario:', err);
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    }

    static deleteUser(id, callback) {
        const sql = 'UPDATE usuarios SET activo = false WHERE id = $1';
        query(sql, [id], (err, result) => {
            if (err) {
                console.error('Error al eliminar el usuario:', err);
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    }
}

module.exports = UserDao;
