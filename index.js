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

//Configurando EJS
app.set('views',resolve(__dirname, './src/routes'))

app.set('view engine','ejs')

//Configurando Body-Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Rutas
app.get('/', async (req,res)=>{
    res.render('index');
})

app.post('/login', async (req,res)=>{
    const {email, password} = req.body
    const usuarios = await getAll('drinkers.usuario')
    let ruta = ''
    console.log(email)

    for (const usuario of usuarios) {
        if(usuario.email == email){
            if(usuario.password == password){
                ruta = '/dashboard'
            }else{
                ruta = '/register'
            }
        }
        else {
            ruta = '/register'
        }
    }
    res.send(JSON.stringify({ruta: ruta}))
})

app.get('/login',(req,res)=>{
    res.render('auth/login');
})

app.get('/register',(req,res)=>{
    res.render('auth/register');
})

app.get('/dashboard', (req, res) => {
    res.render('admin/dashboard');
});

app.get('/admin/inventario', async (req, res) => {
    res.render('admin/inventario', {inventario: await getAll('drinkers.inventario')});
});