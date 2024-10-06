import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()

const dbconfig = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password'
})

export default dbconfig
