//Importaciones
import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {methods as authorization} from './middleware/authorization.js'
//Querys para (get) => Parametros (base.tabla) o (process.env.MYSQL_DATABASE+'.tabla')
import {
    getAll,
    getOne
} from './database/querys.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

//Configurando Server
const app = express();
app.set('port',process.env.PORT)
app.listen(app.get('port'), async () => {
    console.log('http://localhost:'+app.get('port')+'/');
});


//Configurando EJS
app.set('views',resolve(__dirname, './routes'))
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/CSS'));
app.set('view engine','ejs')

//Rutas
app.get('/', async (req,res)=>{
    res.render('index');
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