//Importaciones
import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

import {methods as authorization} from './src/middleware/authorization.js'
//Querys para (get) => Parametros (base.tabla) o (process.env.MYSQL_DATABASE+'.tabla')
import {
    getAll,
    getOne,
    create,
    exist,
    update,
    deleteOne
} from './src/database/querys.js'

const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, './public/images/Licores/'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

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

//////////////////
// METODOS GET //
//////////////////

app.get('/', async (req,res)=>{
    res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('auth/login');
})

app.get('/register',(req,res)=>{
    res.render('auth/register');
})

app.get('/admin/dashboard', async (req, res) => {
    res.render('admin/dashboard', {
        avisos: await getAll(process.env.MYSQL_DATABASE+'.avisos'),
        ventas: await getAll(process.env.MYSQL_DATABASE+'.ventas'),
        inventario: await getAll(process.env.MYSQL_DATABASE+'.inventario')
    });
});

app.get('/admin/inventario', async (req, res) => {
    res.render('admin/inventario', {inventario: await getAll(process.env.MYSQL_DATABASE+'.inventario')});
});

app.get('/admin/envios', async (req, res) => {
    res.render('admin/envios', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.envios')
    });
});

app.get('/admin/estadistica', async (req, res) => {
    res.render('admin/estadistica', {
        ventas: await getAll(process.env.MYSQL_DATABASE+'.ventas'),
        inventario: await getAll(process.env.MYSQL_DATABASE+'.inventario')
    });
});

app.get('/admin/proveedor', async (req, res) => {
    res.render('admin/proveedor', {proveedor: await getAll(process.env.MYSQL_DATABASE+'.proveedores')});
});

app.get('/admin/avisos', async (req, res) => {
    res.render('admin/avisos', {avisos: await getAll(process.env.MYSQL_DATABASE+'.avisos')});
});

//////////////////
// METODOS POST //
//////////////////

//Autenticacion
app.post('/login', async (req,res)=>{
    const {email, password} = req.body
    const usuarios = await getAll(process.env.MYSQL_DATABASE+'.usuario')
    let ruta = ''
    console.log(email)

    for (const usuario of usuarios) {
        if(usuario.email == email){
            if(usuario.password == password){
                ruta = '/admin/dashboard'
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

app.post('/register', async (req,res)=>{
    const {nombre, apellido, email, password} = req.body
    const usuario = await exist(process.env.MYSQL_DATABASE+'.usuario', 'email', email)
    if(usuario){
        res.send(JSON.stringify({ruta: '/register'}))
    }else{
        await create(process.env.MYSQL_DATABASE+'.usuario', {nombre, apellido, email, password})
        res.send(JSON.stringify({ruta: '/login'}))
    }
})

//Inventario

app.post('/admin/inventario/create', upload.single('imagen'), async (req, res) => {
    req.body.id = (await getAll(process.env.MYSQL_DATABASE+'.inventario')).length + 1
    if (req.file) {
        req.body.imagen = '/images/Licores/' + req.file.filename;
    }
    await create(process.env.MYSQL_DATABASE+'.inventario', req.body);
    res.redirect('/admin/inventario');
});

app.post('/admin/inventario/modificar', upload.single('imagen'), async (req, res) => {
    if (req.file) {
        req.body.imagen = '/images/Licores/' + req.file.filename;
    }
    await update(process.env.MYSQL_DATABASE+'.inventario', req.body.id, req.body)
    res.redirect('/admin/inventario')
})

app.post('/admin/inventario/eliminar', async (req, res) => {
    await update(process.env.MYSQL_DATABASE+'.inventario', req.body.id, {status: 'inactive'})
    res.send('Eliminado')
})

//Avisos

app.post('/admin/avisos/create', async (req, res) => {
    req.body.titulo = req.body.descripcion.split(' ')[0]
    req.body.id = (await getAll(process.env.MYSQL_DATABASE+'.avisos')).length + 1
    console.log(req.body)
    await create(process.env.MYSQL_DATABASE+'.avisos', req.body);
    res.redirect('/admin/avisos');
});

//Dashboard

app.get('/admin/dashboard/ventas', async (req, res) => {
    res.send(await getAll(process.env.MYSQL_DATABASE+'.ventas'));
});

app.get('/admin/dashboard/inventario', async (req, res) => {
    res.send(await getAll(process.env.MYSQL_DATABASE+'.inventario'));
});