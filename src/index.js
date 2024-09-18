import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {methods as auth} from './controllers/auth.js'
import {methods as authorization} from "./middlewares/authorization.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

//Configurando Server
const app = express();
app.set('port',process.env.PORT)
app.use(express.json())
app.listen(app.get('port'),()=>{
    console.log('http://localhost:'+app.get('port')+'/')
})
app.use(express.static(resolve(__dirname, '..')));

//Rutas
app.get('/',(req,res)=>{
    res.sendFile(resolve(__dirname, '../index.html'))
})

app.get('/login',(req,res)=>{
    res.sendFile(resolve(__dirname, './routes/login.html'))
})

app.get('/register',(req,res)=>{
    res.sendFile(resolve(__dirname, './routes/register.html'))
})