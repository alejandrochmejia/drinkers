//Importaciones
import express from 'express';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import otplib from 'otplib';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import {GoogleGenerativeAI} from '@google/generative-ai';

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
    deleteOne,
    customQuery
} from './src/controllers/db.controller.js'

import authenticate from './src/middleware/authorization.js'

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

//Key para el JWT
const JWT_KEY = process.env.JWT_KEY;

// Genera una clave secreta aleatoria OTP
const secret = process.env.AUTH_SECRET; 

// Configuración de la API de Google Generative AI
const apiKey = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
  
// Configuración de la generación de texto
const generationConfig = {
    temperature: 0.3,
    topP: 0.9,
    topK: 30,
    maxOutputTokens: 100,
    responseMimeType: "text/plain",
};

//Darle contexto al chatbot
const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {text: "Hola, quiero aprender sobre licores. Se muy Breve"},
            ],
        },
        {
            role: "model",
            parts: [
                {text: "¡Hola! Con gusto te puedo ayudar. ¿Sobre qué tipo de licores te gustaría aprender? Tenemos whisky, vodka, ron, tequila, etc."},
            ],
        },
    ]
});

///////////////////////
////// SERVIDOR //////
///////////////////////

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
app.use(cookieParser());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});
//Rutas

//////////////////
// METODOS GET //
//////////////////
//Index
app.get('/', async (req,res)=>{
    try {

        const [dataJson, inventario] = await Promise.all([
            getAll(process.env.MYSQL_DATABASE + '.PRODUCTOS_FACTURADOS'),
            getAll(process.env.MYSQL_DATABASE + '.INVENTARIO')
        ]);


        const top5ProductosConNombres = dataJson
        .map(e => ({ id: e.id_producto, ingresos: e.ingresos }))
        .sort((a, b) => b.ingresos - a.ingresos)
        .slice(0, 5)
        .map(pv => {
            const producto = inventario.find(p => p.id == pv.id);
            return {
                nombre_producto: producto ? producto.nombre_producto : 'Producto no encontrado',
                precio_detal: producto ? producto.precio_detal.toFixed(2) : 'Precio no disponible',
                imagen: producto ? producto.imagen : '',
            };
        });
        res.render('index', {
            productos: inventario,
            top5ProductosConNombres: top5ProductosConNombres
        });

    } catch (error) {
        console.error("Error fetching data: ", error);
        res.render('user/error');
    }

})

//Catalogo o Seccion de Productos
app.get('/catalogo', async (req, res) => {
    const productos = await getAll(process.env.MYSQL_DATABASE + '.INVENTARIO');
    let productosFiltrados = productos;
    
    // Verifica si hay una consulta de búsqueda
    if (req.query.search) {
        // Filtra los productos directamente
        productosFiltrados = productos.filter(producto => 
            producto.nombre_producto.toLowerCase().includes(req.query.search.toLowerCase())
        );
    } else {
        if(req.query.type) {
            // Filtra los productos directamente
            productosFiltrados = productos.filter(producto => 
                producto.tipo.toLowerCase().includes(req.query.type.toLowerCase())
            );
        }
    }

    res.render('partials/catalogo', {
        productos: productosFiltrados,
        type: req.query.type || 'Productos',
    });
});

app.get('/product', async (req, res) => {
        const inventario = await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO');

        const producto = inventario.find(p => p.nombre_producto == req.query.name);
    
        const descripcionAI = await chatSession.sendMessage('Alargame un poco la siguiente descripcion (Tienes maximo 100 maxOutputTokens): '+ producto.descripcion);
    
        producto.descripcion =   descripcionAI.response.text().replace(/\*\*/g, '').replace(/\*/g, '').replace(/\d+\.\s*/g, '').replace(/:\s*/g, ': ').trim();
    
        const relacionados = inventario.filter(p => p.tipo == producto.tipo && p.nombre_producto != producto.nombre_producto);
        res.render('user/producto', { producto, relacionados });
})

//Preguntas Frecuentes
app.get('/faq', async (req, res) => {
    res.render('user/faq');
});

//Terminos y Condiciones
app.get('/terms', (req, res) => {
    res.render('user/terms');
})

//Acerca de Nosotros
app.get('/about', (req, res) => {
    res.render('user/about');
})

//Politicas de Privacion
app.get('/privacy', (req, res) => {
    res.render('user/privacy');
})

//Politica de Devolucion
app.get('/returns', (req, res) => {
    res.render('user/returns');
})

//Login
app.get('/login',(req,res)=>{
    if(req.cookies.otp === 'true') res.redirect('/admin/dashboard');
    else res.render('auth/login');
})

//Register
app.get('/register',(req,res)=>{
    res.render('auth/register');
})

//Dashboard
app.get('/admin/dashboard',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/dashboard', {
        avisos: await getAll(process.env.MYSQL_DATABASE+'.AVISOS'),
        ventas: await getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS'),
        inventario: await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO'),
        envios: await getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Inventario
app.get('/admin/inventario',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/inventario', {inventario: await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO')});
});

//Envios
app.get('/admin/envios',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/envios', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Envios Minorista
app.get('/admin/envios/minorista',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/minorista', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Envios Mayorista
app.get('/admin/envios/mayorista',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/mayorista', {
        envios: await getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Estadistica
app.get('/admin/estadistica',authenticate.authenticateOTP, async (req, res) => {

    const dataJson = await getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS')
  
    const inventario = await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO')

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
        ventas: await getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS'),
        inventario: await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO'),
        vendidos: top5ProductosConNombres
    });
});

//Proveedor
app.get('/admin/proveedor',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/proveedor', {proveedor: await getAll(process.env.MYSQL_DATABASE+'.PROVEEDORES')});
});

//Avisos o Reportes
app.get('/admin/avisos',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/avisos', {avisos: await getAll(process.env.MYSQL_DATABASE+'.AVISOS')});
});

//Obtener los 5 productos mas vendidos
app.get('/api/productos/vendidos', async (req, res) => {

    const dataJson = await getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS')
  
    const inventario = await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO')

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
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usuario = await exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);

    if (!usuario[0] || usuario[0].password !== password) {
        return res.status(400).send(JSON.stringify({ mensaje: 'Usuario o contraseña incorrectos' }));
    }

    const token = jwt.sign({ email }, JWT_KEY);
    res.cookie('token', token, { httpOnly: true });
    res.send(JSON.stringify({mensaje: 'Usuario autenticado'}));
});

//Falta Arreglar el register cuando se haga merge
app.post('/register', async (req, res) => {
    const { username, email, nacimiento, password, nombre, apellido, direccion } = req.body;
    const usuario = await exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);
    const nombreUsuario = await exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'username', username);

    if (usuario.length > 0) {
        return res.status(400).send(JSON.stringify({ error: 'El usuario ya existe' }));
    }

    if (nombreUsuario.length > 0) {
        return res.status(400).send(JSON.stringify({ error: 'El nombre de usuario ya existe' }));
    }

    await create(process.env.MYSQL_DATABASE + '.CLIENTES', 
    { username, email, nacimiento, password, nombre, apellido, direccion });
    res.send(JSON.stringify({ mensaje: 'Usuario registrado con éxito' }));
});

//Inventario

app.post('/admin/inventario/create', upload.single('imagen'), async (req, res) => {
    req.body.id = (await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO')).length + 1
    if (req.file) {
        req.body.imagen = '/images/Licores/' + req.file.filename;
    }
    await create(process.env.MYSQL_DATABASE+'.INVENTARIO', req.body);
    res.redirect('/admin/inventario');
});

app.post('/admin/inventario/modificar', upload.single('imagen'), async (req, res) => {
    if (req.file) {
        req.body.imagen = '/images/Licores/' + req.file.filename;
    }
    await update(process.env.MYSQL_DATABASE+'.INVENTARIO', req.body.id, req.body)
    res.redirect('/admin/inventario')
})

app.post('/admin/inventario/eliminar', async (req, res) => {
    await update(process.env.MYSQL_DATABASE+'.INVENTARIO', req.body.id, {status: 'inactive'})
    res.send('Eliminado')
})

//Avisos

app.post('/admin/avisos/create', async (req, res) => {
    req.body.titulo = req.body.descripcion.split(' ')[0]
    req.body.id = (await getAll(process.env.MYSQL_DATABASE+'.AVISOS')).length + 1
    await create(process.env.MYSQL_DATABASE+'.AVISOS', req.body);
    res.redirect('/admin/avisos');
});

//Dashboard

app.post('/admin/dashboard/ventas', async (req, res) => {
    res.send(await getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS'));
});

app.post('/admin/dashboard/inventario', async (req, res) => {
    res.send(await getAll(process.env.MYSQL_DATABASE+'.INVENTARIO'));
});

app.post('/admin/proveedor/create', async (req, res) => {
    req.body.id = (await getAll(process.env.MYSQL_DATABASE+'.PROVEEDORES')).length + 1
    req.body.status = 'active'
    await create(process.env.MYSQL_DATABASE+'.PROVEEDORES', req.body);
    res.redirect('/admin/proveedor');
});

app.post('/admin/proveedor/modificar', async (req, res) => {
    req.body.status = 'active'
    await update(process.env.MYSQL_DATABASE+'.PROVEEDORES', req.body.id, req.body)
    res.redirect('/admin/proveedor')
})

app.post('/admin/proveedor/eliminar', async (req, res) => {
    await update(process.env.MYSQL_DATABASE+'.proveedores', req.body.id, {status: 'inactive'})
    res.send('Eliminado')
});

/*
// Ruta para generar y enviar el código QR
app.get('/generate-qr', async (req, res) => {
    const otpauth = otplib.authenticator.keyuri('ventas@drinkers.com', 'Drinkers', secret);
    
    try {
        const qrCodeUrl = await QRCode.toDataURL(otpauth); // Genera el código QR como una URL de imagen
        res.json({ qrCodeUrl }); // Envía la URL para generar el QR
    } catch (err) {
        res.status(500).json({ message: 'Error al generar el código QR' });
    }
});
*/

// Ruta para verificar el código OTP
app.post('/verify-otp', (req, res) => {
    const token = req.body.password;

    // Verificar si el token fue proporcionado
    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
    }

    //Falta encriptacion con bycript del otp

    // Verificar el código OTP
    const isValid = otplib.authenticator.check(token, secret);
    res.cookie('otp', isValid,  { httpOnly: true});
    res.send(isValid);
});

// POST para interaccion con GEMINI
app.post('/bot', async (req, res) => {
    const { message } = req.body;
    chatSession.history = []
    if(req.cookies.token) {
        const result = await chatSession.sendMessage('Se Breve (Tienes maximo 100 maxOutputTokens) no se pases y no respondas cosas que no sean de licores, solo dices que eres experto en licores: '+message);
        res.send(JSON.stringify(result.response.text()));
    } else {    
        res.send(JSON.stringify("Inicie Sesion o Registrese en Drinkers para poder acceder a funciones de Chatbot"));
    }
        
})

//Cerrar Sesion
app.post('/logout', (req, res) => {
    res.clearCookie('otp');
    res.clearCookie('token');
    res.send(JSON.stringify({mensaje: 'Sesion cerrada'}));
})

//Para Mostrar la foto del usuaro y verificar si es un usuaro
app.post('/getUser', async (req, res) => {
    const token = req.cookies.token;
    if(token) res.send(JSON.stringify({mensaje: true}));
    else res.send(JSON.stringify({mensaje: null}));
})