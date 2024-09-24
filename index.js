//Importaciones
import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import {methods as authorization} from './src/middleware/authorization.js'
//Querys para (get) => Parametros (base.tabla) o (process.env.MYSQL_DATABASE+'.tabla')
import {
    getAll,
    getOne
} from './src/database/querys.js'

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

//Configurando Server
const app = express();
app.set('port',process.env.PORT)
app.use(express.static(resolve(__dirname, './public')));
app.listen(app.get('port'), async () => {
    console.log('http://localhost:'+app.get('port')+'/');
});

app.use(express.json())

//Configurando EJS
app.set('views',resolve(__dirname, './src/routes'))

app.set('view engine','ejs')

//Rutas
app.get('/', async (req,res)=>{
    res.render('index');
})

app.post('/login', async (req,res)=>{
    for (let user of await getAll('drinkers.usuario')){
        if(req.body.email == user.email){
            res.send('/dashboard')
            return
        }
    }
    res.send({
        url: '/login',
        error: 'Usuario no encontrado'
    })
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