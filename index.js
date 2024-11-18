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
import { randomInt } from 'crypto';

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
    model: "gemini-1.5-pro",
});
  
// Configuración de la generación de texto
const generationConfig = {
    temperature: 0.3,
    topP: 0.9,
    topK: 30,
    maxOutputTokens: 200,
    responseMimeType: "text/plain",
};

//Darle contexto al chatbot
const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                {text: "Hola, quiero aprender sobre licores."},
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

app.get('/payment',authenticate.authenticateJWT, async (req, res) => {
    //Despues utilizar jwt para oobtene el email con verify
    const iva = await getOne(process.env.MYSQL_DATABASE + '.IMPUESTOS', 1);
    const email = jwt.verify(req.cookies.token, JWT_KEY).email;
    const usuario = await exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);
    res.render('user/payment', {usuario: usuario[0], iva: iva[0]});
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
    const { username, email, nacimiento, password, nombre, apellido, direccion, cedula } = req.body;
    const usuario = await exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);
    const nombreUsuario = await exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'username', username);

    if (usuario.length > 0) {
        return res.status(400).send(JSON.stringify({ error: 'El usuario ya existe' }));
    }

    if (nombreUsuario.length > 0) {
        return res.status(400).send(JSON.stringify({ error: 'El nombre de usuario ya existe' }));
    }

    

    await create(process.env.MYSQL_DATABASE + '.CLIENTES', 
    { username, email, nacimiento, password, nombre, apellido, direccion, cedula });
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

//Coordinar la ruta del envio Tiempo y Distancia
app.post('/bot/route', async (req, res) => {
    const message = req.body.direccion;
    const destino = 'Carabobo, Valencia, El Vinedo cerca de sushi ceviche'
    const result = await chatSession.sendMessage('Dime que tan lejos esta la siguiente ubicacion'+destino+'.Hasta la siguiente'+message+'.Y damelo en un formato JSON, que tenga su distancia en KM(distancia), tiempo en carro(tiempo), estado, pais, ciudad. Solo dame esa informacion no mas solo el json, solo los corchetes nada mas');
    function extractAndParseJson(input) {
        const regex = /```json\s*([\s\S]*?)```/;
        const match = input.match(regex);

        if (match && match[1]) {
            const jsonString = match[1].trim();
            try {
                const jsonObject = JSON.parse(jsonString);
                return res.send(extractAndParseJson(result.response.text())[0]);;
            } catch (error) {
                console.error("Error al parsear JSON:", error);
                res.send({
                    distancia: 4
                });
                return null;
            }
        } else {
            console.error("No se encontró un bloque JSON válido.");
            res.send({
                distancia: 4
            });
            return
        }
    }
    res.send({
        distancia: 4
    });
    
})

app.post('/payment', async (req, res) => {
    const { products, baseImponible: base , iva, total, fecha, entrega, direccion } = req.body;
    //Contruccion de la Factura
    const {email} = jwt.verify(req.cookies.token, JWT_KEY);
    const user = (await getAll(process.env.MYSQL_DATABASE + '.CLIENTES')).find(c => c.email == email);
    const id_user = user.id;
    const facturas = await getAll(process.env.MYSQL_DATABASE + '.FACTURA');
    const id = facturas.length + 1;
    let control = randomInt(100000, 999999);
    while (facturas.find(f => f.control == control)) {
        control = randomInt(100000, 999999);
    }

    await create(process.env.MYSQL_DATABASE + '.FACTURA', {id, base, iva, total, id_user, control, fecha });

    // Crear Envio
    if(entrega.length > 0) {
        const envios = await getAll(process.env.MYSQL_DATABASE + '.ENVIOS');
        const id_envio = envios.length + 1;
        await create(process.env.MYSQL_DATABASE + '.ENVIOS', {id: id_envio, direccion, entrega, id_factura: id});
    }

    //Contruccion de Productos Facturados
    // Convertir el objeto en un array de objetos
    const productos = Object.entries(products).map(([key, value]) => {
        return {
          nombre: key,
          ...JSON.parse(value)
        };
    });



    for (const product of productos) {
        const producto = (await getAll(process.env.MYSQL_DATABASE + '.INVENTARIO')).find(p => p.nombre_producto == product.nombre);
        
        if (!producto) {
            console.error(`Producto no encontrado: ${product.nombre}`);
            continue;
        }
        const id_producto = producto.id;
        const ingresos = product.cantidad * producto.precio_detal;
        const facturaExists = await customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.FACTURA WHERE id = ?`, [id]);
    
        if (facturaExists.length === 0) {
            console.error(`Factura con id ${id} no existe. No se puede insertar el producto.`);
            continue;
        }
    
        try {
            await create(process.env.MYSQL_DATABASE + '.PRODUCTOS_FACTURADOS', { id_factura: id, id_producto, cantidad: product.cantidad, ingresos });
        } catch (error) {
            console.error("Error al insertar en PRODUCTOS_FACTURADOS: ", error);
        }
    }

    //Creacion de la Factura
    res.send(JSON.stringify({mensaje: 'Compra Exitosa'}));
})