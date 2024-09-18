import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

//Configurando Server
const app = express();
app.set('port',process.env.PORT)
app.use(express.json())
app.listen(app.get('port'),()=>{
    console.log('Server on port',app.get('port'))
})
app.use(express.static(resolve(__dirname, '..')));

//Rutas

app.get('/',(req,res)=>{
    res.sendFile(resolve(__dirname, '../index.html'))
})

app.get('/login',(req,res)=>{
    res.sendFile(resolve(__dirname, './routes/login.html'))
})