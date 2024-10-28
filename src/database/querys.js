import dbconfig from "./connection.js";

// Obtener todos los registros
export const getAll = (tabla) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla}`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error fetching data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

// Obtener un registro
export const getOne = (tabla, id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE id = ?`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, [id], (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error fetching data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

export const exist = (tabla, column, value) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${column} = ?`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, [value], (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error fetching data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

// Obtener un registro por una columna específica
export const getOneBy = (tabla, column, value) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${column} = ?`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, [value], (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error fetching data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

// Crear un registro
export const create = (tabla, data) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${tabla} SET ?`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, data, (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error creating data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

// Actualizar un registro
export const update = (tabla, id, data) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${tabla} SET ? WHERE id = ?`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, [data, id], (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error updating data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

// Eliminar un registro
export const deleteOne = (tabla, id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM ${tabla} WHERE id = ?`;
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, [id], (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error deleting data: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};