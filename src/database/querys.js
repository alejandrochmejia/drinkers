import dbconfig from "./connection.js";

//Obtener todos los registros
export const getAll = (tabla) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla}`;
        dbconfig.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching data: " + err.stack);
                reject(err);
            } else {
                resolve(results);
            }
        })
        dbconfig.end()
    })
};

//Obtener un registro
export const getOne = (tabla, id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE id = ${id}`;
        dbconfig.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching data: " + err.stack);
                reject(err);
            } else {
                resolve(results);
            }
        });
        dbconfig.end();
    });
};

//Crear un registro
export const create = (tabla, data) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO ${tabla} SET ?`;
        dbconfig.query(query, data, (err, results) => {
            if (err) {
                console.error("Error creating data: " + err.stack);
                reject(err);
            } else {
                resolve(results);
            }
        });
        dbconfig.end();
    });
};

//Actualizar un registro
export const update = (tabla, id, data) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${tabla} SET ? WHERE id = ${id}`;
        dbconfig.query(query, data, (err, results) => {
            if (err) {
                console.error("Error updating data: " + err.stack);
                reject(err);
            } else {
                resolve(results);
            }
        });
        dbconfig.end();
    });
};
