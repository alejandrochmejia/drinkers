//Importaciones
import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {methods as auth} from './controllers/auth.js'
import {methods as authorization} from './middleware/authorization.js'
import {getAll} from './database/querys.js'
const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

//Configurando Server
const app = express();
app.set('port',process.env.PORT)
app.use(express.json())
app.listen(app.get('port'), async () => {
    console.log('http://localhost:'+app.get('port')+'/');
});


//Configurando EJS
app.set('views',resolve(__dirname, './routes'))
app.set('view engine','ejs')

//Rutas
app.get('/', async (req,res)=>{
    const usuarios = await getAll('drinkers.usuario');
    console.log(usuarios);
    res.render('index', {usuarios});
})

app.get('/login',(req,res)=>{
    res.render('auth/login');
})

app.get('/register',(req,res)=>{
    res.render('auth/register');
})

app.get('/dashboard',authorization.soloAdmin, (req, res) => {
    res.render('admin/dashboard');
});