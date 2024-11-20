import dbconfig from "../database/connection.js";

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

// Obtener un registro por una columna específica
export const getAllBy = (tabla, column, value) => {
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
}

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

// Ejecutar una consulta personalizada
export const customQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        dbconfig.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(query, params, (err, results) => {
                connection.release(); // Libera la conexión de vuelta al pool
                if (err) {
                    console.error("Error executing custom query: " + err.stack);
                    return reject(err);
                }
                resolve(results);
            });
        });
    });
};

// Función para obtener los 5 productos con más ingresos
export const getBestProducts = async () => {
    try {
        // Obtener los ingresos por producto directamente desde la base de datos
        const top5Ingresos = await customQuery(`
            SELECT id_producto, SUM(ingresos) AS total_ingresos
            FROM ${process.env.MYSQL_DATABASE}.PRODUCTOS_FACTURADOS
            GROUP BY id_producto
            ORDER BY total_ingresos DESC
            LIMIT 5;
        `);

        // Obtener los IDs de los productos
        const top5ProductoIds = top5Ingresos.map(item => item.id_producto).join(', ');
        const detallesProductos = await customQuery(`
            SELECT id, nombre_producto, precio_detal, imagen 
            FROM ${process.env.MYSQL_DATABASE}.INVENTARIO 
            WHERE id IN (${top5ProductoIds});
        `);

        // Crear un objeto para acceder fácilmente a los detalles de los productos
        const inventarioMap = detallesProductos.reduce((acc, producto) => {
            acc[producto.id] = producto;
            return acc;
        }, {});

        // Construir el resultado final
        const resultado = top5Ingresos.map(item => {
            const producto = inventarioMap[item.id_producto] || {};
            return {
                nombre_producto: producto.nombre_producto || 'Producto no encontrado',
                precio_detal: producto.precio_detal ? producto.precio_detal.toFixed(2) : 'Precio no disponible',
                imagen: producto.imagen || '',
                ingresos: item.total_ingresos
            };
        });

        return resultado;
    } catch (error) {
        console.error("Error en obtenerTop5Productos: ", error);
        throw error; // Re-lanzar el error para manejarlo más arriba si es necesario
    }
};

// Contar los registros de una tabla
export const count = (tabla) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COUNT(*) FROM ${tabla}`;
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