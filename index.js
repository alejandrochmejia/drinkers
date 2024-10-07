//Importaciones
import express from 'express';
import dotenv from 'dotenv'

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import path from 'path';

//Querys para (get) => Parametros (base.tabla) o (process.env.MYSQL_DATABASE+'.tabla')
import {
    getAll,
    getOne,
    create,
    exist,
    update,
    deleteOne
} from './src/database/querys.js'

//Configurando Path
const __dirname = dirname(fileURLToPath(import.meta.url));

//Configurando almacenamiento del multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, './public/images/Licores/'))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

//Configurando Multer para la subida de archivos
const upload = multer({ storage: storage });

//Configurando Dotenv para las variables de entorno
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

//Index
app.get('/', async (req,res)=>{

    const dataJson = await getAll(process.env.MYSQL_DATABASE+'.ventas')
  
    const inventario = await getAll(process.env.MYSQL_DATABASE+'.inventario')

    let productosVentas = dataJson.map(e => ({id: e.id_producto, ingresos: e.ingresos}));
  
    productosVentas.sort((a, b) => b.ingresos - a.ingresos);
  
    let top5ProductosVentas = productosVentas.slice(0, 5);
  
    let top5ProductosConNombres = top5ProductosVentas.map(pv => {
      let producto = inventario.find(p => p.id == pv.id);
      return {
        nombre: producto ? producto.nombre_producto : 'Producto no encontrado',
        precio_detal: producto ? producto.precio_detal : 'Precio no disponible'
      };
    });
    
    res.render('index', {
        productos: await getAll(process.env.MYSQL_DATABASE+'.inventario'),
        top5ProductosConNombres: top5ProductosConNombres
    });
})

//Catalogo o Seccion de Productos
app.get('/catalogo', async (req,res)=>{


    const productos = await getAll(process.env.MYSQL_DATABASE+'.inventario')

    const productosFiltrados = productos.filter(producto => producto.tipo == req.query.type)

    res.render('partials/catalogo', {
        productos: productosFiltrados,
        type: req.query.type
    });
})

//Preguntas Frecuentes
app.get('/faq', (req, res) => {
    res.render('user/faq');
})

//Login
app.get('/login',(req,res)=>{
    res.render('auth/login');
})

//Register
app.get('/register',(req,res)=>{
    res.render('auth/register');
})

//Dashboard
app.get('/admin/dashboard', async (req, res) => {
    res.render('admin/dashboard', {
        avisos: await getAll(process.env.MYSQL_DATABASE+'.avisos'),
        ventas: await getAll(process.env.MYSQL_DATABASE+'.ventas'),
        inventario: await getAll(process.env.MYSQL_DATABASE+'.inventario'),
        envios: await getAll(process.env.MYSQL_DATABASE+'.envios')
    });
});

//Inventario
app.get('/admin/inventario', async (req, res) => {
    res.render('admin/inventario', {inventario: await getAll(process.env.MYSQL_DATABASE+'.inventario')});
});

//Envios
app.get('/admin/envios', async (req, res) => {
    res.render('admin/envios', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.envios')
    });
});

//Envios Minorista
app.get('/admin/envios/minorista', async (req, res) => {
    res.render('admin/minorista', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.envios')
    });
});

//Envios Mayorista
app.get('/admin/envios/mayorista', async (req, res) => {
    res.render('admin/mayorista', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.envios')
    });
});

//Estadistica
app.get('/admin/estadistica', async (req, res) => {

    const dataJson = await getAll(process.env.MYSQL_DATABASE+'.ventas')
  
    const inventario = await getAll(process.env.MYSQL_DATABASE+'.inventario')

    let productosVentas = dataJson.map(e => ({id: e.id_producto, ingresos: e.ingresos}));
  
    productosVentas.sort((a, b) => b.ingresos - a.ingresos);
  
    let top5ProductosVentas = productosVentas.slice(0, 5);
  
    let top5ProductosConNombres = top5ProductosVentas.map(pv => {
      let producto = inventario.find(p => p.id == pv.id);
      return {
        nombre: producto ? producto.nombre_producto : 'Producto no encontrado',
        ingresos: pv.ingresos,
        precio_detal: producto ? producto.precio_detal : 'Precio no disponible'
      };
    });

    res.render('admin/estadistica', {
        ventas: await getAll(process.env.MYSQL_DATABASE+'.ventas'),
        inventario: await getAll(process.env.MYSQL_DATABASE+'.inventario'),
        vendidos: top5ProductosConNombres
    });
});

//Proveedor
app.get('/admin/proveedor', async (req, res) => {
    res.render('admin/proveedor', {proveedor: await getAll(process.env.MYSQL_DATABASE+'.proveedores')});
});

//Avisos o Reportes
app.get('/admin/avisos', async (req, res) => {
    res.render('admin/avisos', {avisos: await getAll(process.env.MYSQL_DATABASE+'.avisos')});
});

//Obtener los 5 productos mas vendidos
app.get('/api/productos/vendidos', async (req, res) => {

    const dataJson = await getAll(process.env.MYSQL_DATABASE+'.ventas')
  
    const inventario = await getAll(process.env.MYSQL_DATABASE+'.inventario')

    let productosVentas = dataJson.map(e => ({id: e.id_producto, ingresos: e.ingresos}));
  
    productosVentas.sort((a, b) => b.ingresos - a.ingresos);
  
    let top5ProductosVentas = productosVentas.slice(0, 5);
  
    let top5ProductosConNombres = top5ProductosVentas.map(pv => {
      let producto = inventario.find(p => p.id == pv.id);
      return {
        nombre: producto ? producto.nombre_producto : 'Producto no encontrado',
        ingresos: pv.ingresos,
        precio_detal: producto ? producto.precio_detal : 'Precio no disponible'
      };
    });
  
    res.send(top5ProductosConNombres);
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

app.post('/admin/dashboard/ventas', async (req, res) => {
    res.send(await getAll(process.env.MYSQL_DATABASE+'.ventas'));
});

app.post('/admin/dashboard/inventario', async (req, res) => {
    res.send(await getAll(process.env.MYSQL_DATABASE+'.inventario'));
});

app.post('/admin/proveedor/create', async (req, res) => {
    req.body.id = (await getAll(process.env.MYSQL_DATABASE+'.proveedores')).length + 1
    req.body.status = 'active'
    await create(process.env.MYSQL_DATABASE+'.proveedores', req.body);
    res.redirect('/admin/proveedor');
});

app.post('/admin/proveedor/modificar', async (req, res) => {
    req.body.status = 'active'
    await update(process.env.MYSQL_DATABASE+'.proveedores', req.body.id, req.body)
    res.redirect('/admin/proveedor')
})

app.post('/admin/proveedor/eliminar', async (req, res) => {
    await update(process.env.MYSQL_DATABASE+'.proveedores', req.body.id, {status: 'inactive'})
    res.send('Eliminado')
});
