const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'JoseLuis',
    port: 5432
});

pool.on('connect', () => {
    console.log('Conexión exitosa a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error inesperado en la conexión a PostgreSQL:', err);
});

// Función para obtener una conexión
function getConnection() {
    return pool;
}

// Función para hacer queries (compatibilidad con código existente)
function query(text, params, callback) {
    if (callback) {
        pool.query(text, params, (err, res) => {
            if (err) {
                callback(err, null);
            } else {
                // Convertir resultados de PostgreSQL a formato similar a MySQL
                const results = res.rows;
                const result = {
                    rows: results,
                    insertId: res.rows[0]?.id || null,
                    affectedRows: res.rowCount || 0
                };
                callback(null, result);
            }
        });
    } else {
        return pool.query(text, params);
    }
}

module.exports = {
    pool,
    query,
    getConnection
};

// Exportar también como conexión directa para compatibilidad
module.exports.connection = {
    query: query
};
