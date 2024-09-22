//Importaciones
import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {login} from './controllers/auth.js'
import {methods as authorization} from './middleware/authorization.js'
import {getAll} from './database/querys.js'
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
    const users = await getAll(process.env.MYSQL_DATABASE+'.usuario')
    res.render('index',{users});
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