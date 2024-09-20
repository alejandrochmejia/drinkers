import mysql from 'mysql'
import dotenv from 'dotenv'
import fs from 'fs';

dotenv.config()

const dbconfig = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password'
})

 dbconfig.connect((err) => {
    if (err) {
        console.error('Error connecting to MYSQL: ' + err.stack)
        return
    }
    console.log('Connected to MYSQL as id ' + dbconfig.threadId)
})

 fs.readFile('./db.sql', 'utf8', (err, sql) =>  {
    if (err) {
        console.error('Error al leer el archivo .sql:', err);
        return;
    }

    console.log(sql)

});



dbconfig.end()