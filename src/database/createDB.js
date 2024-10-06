import mysql from 'mysql'
import fs from 'fs';
import dbconfig from './connection.js'

export default function createDB () {
    fs.readFile('./db.sql', 'utf8', (err, sql) =>  {
        if (err) {
            console.error('Error al leer el archivo .sql:', err);
            return;
        }
    
        sql.split(';').forEach((query) => {
            dbconfig.query(query, (err,
                result) => {
                if (err) {
                    console.error('Error al ejecutar la query:', err);
                    return;
                }
            }
            );
        })
        dbconfig.end()
    });
    
}
