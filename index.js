//Importaciones de librerias
import express from 'express';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import otplib from 'otplib';
import QRCode from 'qrcode';
import {GoogleGenerativeAI} from '@google/generative-ai';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

//Controlador de la base de datos
import * as dbController from './src/controllers/db.controller.js';

//Controlador de Utils
import * as utilsController from './src/controllers/utils.controller.js';

//Controlador de PDF
import {generatePDF} from './src/controllers/pdf.controller.js'

//Middleware de autenticacion
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
const inventarioBot = await dbController.getAll(process.env.MYSQL_DATABASE + '.INVENTARIO');
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
        {
            role: "user",
            parts: [
                {text: "Que tienes en el inventario."},
            ],
        },
        {
            role: "model",
            parts: [
                {text: `${inventarioBot.map(p => p.nombre_producto).join(', ')}`},
            ],
        }
    ]
});

///////////////////////
////// SERVIDOR //////
///////////////////////

//Creacion de Servidor
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
        const ron = await dbController.getAllBy(process.env.MYSQL_DATABASE+'.INVENTARIO', 'tipo','Ron');
        const whisky = await dbController.getAllBy(process.env.MYSQL_DATABASE+'.INVENTARIO', 'tipo','Whisky');

        //Verificar si hay una compra pendiente de los proveedores
        utilsController.verifyCompras()

        res.render('index', {
            top5ProductosConNombres: await dbController.getBestProducts(),
            ron: ron,
            whisky: whisky
        });

    } catch (error) {
        console.error("Error fetching data: ", error);
        res.render('user/error');
    }
})

//Catalogo o Seccion de Productos
app.get('/catalogo', async (req, res) => {
    const obtenerProductosFiltrados = async (req) => {

        let query = `SELECT * FROM ${process.env.MYSQL_DATABASE}.INVENTARIO WHERE 1=1`;
        const params = [];
    
        if (req.query.search) {
            query += ` AND nombre_producto LIKE ?`;
            params.push(`%${req.query.search.toLowerCase()}%`);
        }
    
        if (req.query.type) {
            query += ` AND tipo LIKE ?`;
            params.push(`%${req.query.type.toLowerCase()}%`);
        }
    
        return await dbController.customQuery(query, params);
    };

    const productos = await obtenerProductosFiltrados(req);

    res.render('partials/catalogo', {
        productos: productos,
        type: req.query.type || 'Productos',
    });
});

app.get('/product', async (req, res) => {
        const producto = (await dbController.getOneBy(process.env.MYSQL_DATABASE+'.INVENTARIO', 'nombre_producto', req.query.name))[0];


        if (producto.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const relacionadosQuery = `
            SELECT *    
            FROM ${process.env.MYSQL_DATABASE}.INVENTARIO 
            WHERE tipo = ? AND nombre_producto != ? LIMIT 5
        `;
        
        const relacionados = await dbController.customQuery(relacionadosQuery, [producto.tipo, producto.nombre_producto]);
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
    const iva = await dbController.getOne(process.env.MYSQL_DATABASE + '.IMPUESTOS', 1);
    const email = jwt.verify(req.cookies.token, JWT_KEY).email;
    const usuario = await dbController.exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);
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

    const result = await dbController.customQuery(`
    SELECT 
        (SELECT COUNT(*) FROM ${process.env.MYSQL_DATABASE}.PRODUCTOS_FACTURADOS) AS ventas,
        (SELECT COUNT(*) FROM ${process.env.MYSQL_DATABASE}.INVENTARIO) AS inventario,
        (SELECT COUNT(*) FROM ${process.env.MYSQL_DATABASE}.ENVIOS) AS envios
    `);

    const { ventas, inventario, envios } = result[0];

    res.render('admin/dashboard', {
        ventas: ventas,
        inventario: inventario,
        envios: envios
    });
});

//Inventario
app.get('/admin/inventario',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/inventario', {inventario: await dbController.getAll(process.env.MYSQL_DATABASE+'.INVENTARIO')});
});

//Envios
app.get('/admin/envios',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/envios', {
        envios: await dbController.getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Envios Minorista
app.get('/admin/envios/minorista',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/minorista', {
        envios: await dbController.getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Envios Mayorista
app.get('/admin/envios/mayorista',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/mayorista', {
        envios: await dbController.getAll(process.env.MYSQL_DATABASE+'.ENVIOS')
    });
});

//Estadistica
app.get('/admin/estadistica',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/estadistica', {
        ventas: await dbController.getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS'),
        vendidos: await dbController.getBestProducts()
    });
});

//Proveedor
app.get('/admin/proveedor',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/proveedor', {proveedor: await dbController.getAll(process.env.MYSQL_DATABASE+'.PROVEEDORES')});
});

//Avisos o Reportes
app.get('/admin/avisos',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/avisos', {avisos: await dbController.getAll(process.env.MYSQL_DATABASE+'.AVISOS')});
});

//Envios Mayorista
app.get('/admin/consulta',authenticate.authenticateOTP, async (req, res) => {
    res.render('admin/consulta');
});

//Obtener los 5 productos mas vendidos
app.get('/api/productos/vendidos', async (req, res) => {  
    res.send(await dbController.getBestProducts());
});

//////////////////
// METODOS POST //
//////////////////

//Autenticacion
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usuario = await dbController.exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);

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
    const usuario = await dbController.exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'email', email);
    const nombreUsuario = await dbController.exist(process.env.MYSQL_DATABASE + '.CLIENTES', 'username', username);

    if (usuario.length > 0) {
        return res.status(400).send(JSON.stringify({ error: 'El usuario ya existe' }));
    }

    if (nombreUsuario.length > 0) {
        return res.status(400).send(JSON.stringify({ error: 'El nombre de usuario ya existe' }));
    }

    

    await dbController.create(process.env.MYSQL_DATABASE + '.CLIENTES', 
    { username, email, nacimiento, password, nombre, apellido, direccion, cedula });
    res.send(JSON.stringify({ mensaje: 'Usuario registrado con éxito' }));
});

//Inventario

app.post('/admin/inventario/create', upload.single('imagen'), async (req, res) => {
    req.body.id = (await dbController.getAll(process.env.MYSQL_DATABASE+'.INVENTARIO')).length + 1
    if (req.file) {
        req.body.imagen = '/images/Licores/' + req.file.filename;
    }
    await dbController.create(process.env.MYSQL_DATABASE+'.INVENTARIO', req.body);
    res.redirect('/admin/inventario');
});

app.post('/admin/inventario/modificar', upload.single('imagen'), async (req, res) => {
    if (req.file) {
        req.body.imagen = '/images/Licores/' + req.file.filename;
    }
    await dbController.update(process.env.MYSQL_DATABASE+'.INVENTARIO', req.body.id, req.body)
    res.redirect('/admin/inventario')
})

app.post('/admin/inventario/eliminar', async (req, res) => {
    await dbController.update(process.env.MYSQL_DATABASE+'.INVENTARIO', req.body.id, {status: 'inactive'})
    res.send('Eliminado')
})

//Avisos

app.post('/admin/avisos/create', async (req, res) => {
    req.body.titulo = req.body.descripcion.split(' ')[0]
    req.body.id = (await dbController.getAll(process.env.MYSQL_DATABASE+'.AVISOS')).length + 1
    await dbController.create(process.env.MYSQL_DATABASE+'.AVISOS', req.body);
    res.redirect('/admin/avisos');
});

//Dashboard

app.post('/admin/dashboard/ventas', async (req, res) => {
    res.send(await dbController.getAll(process.env.MYSQL_DATABASE+'.PRODUCTOS_FACTURADOS'));
});

app.post('/admin/dashboard/inventario', async (req, res) => {
    res.send(await dbController.getAll(process.env.MYSQL_DATABASE+'.INVENTARIO'));
});

app.post('/admin/proveedor/create', async (req, res) => {
    req.body.id = (await dbController.getAll(process.env.MYSQL_DATABASE+'.PROVEEDORES')).length + 1
    req.body.status = 'active'
    await dbController.create(process.env.MYSQL_DATABASE+'.PROVEEDORES', req.body);
    res.redirect('/admin/proveedor');
});

app.post('/admin/proveedor/modificar', async (req, res) => {
    req.body.status = 'active'
    await dbController.update(process.env.MYSQL_DATABASE+'.PROVEEDORES', req.body.id, req.body)
    res.redirect('/admin/proveedor')
})

app.post('/admin/proveedor/eliminar', async (req, res) => {
    await dbController.update(process.env.MYSQL_DATABASE+'.PROVEEDORES', req.body.id, {status: 'inactive'})
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

app.post('/inventory/available', async (req, res) => {
    let { products } = req.body;
    let productos = Object.entries(products).map(([key, value]) => {
        return {
          nombre: key,
          ...JSON.parse(value)
        };
    });
    
    const errores = [];

    for (const { nombre, cantidad } of productos) {
        const inventario = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.INVENTARIO WHERE nombre_producto = ?`, [nombre]);
        if (inventario.length === 0) {
            errores.push(`Producto no encontrado: ${nombre}`);
            continue;
        }
        if (inventario[0].stock < cantidad) {
            //Verifica los proveedores que tienen el producto y mandar aviso
            utilsController.verifyProveedor();
            errores.push(`Producto Agotado: ${nombre}`);
        }
    }

    if (errores.length > 0) {
        return res.send(JSON.stringify({ error: errores.join(', ') }));
    }

    res.send(JSON.stringify({ mensaje: 'Todos los productos están disponibles' }));
});

app.post('/payment', async (req, res) => {
    const { products, baseImponible: base , iva, total, fecha, entrega, direccion } = req.body;
    //Contruccion de la Factura
    const {email} = jwt.verify(req.cookies.token, JWT_KEY);
    const user = (await dbController.getAll(process.env.MYSQL_DATABASE + '.CLIENTES')).find(c => c.email == email);
    const id_user = user.id;
    const facturas = await dbController.getAll(process.env.MYSQL_DATABASE + '.FACTURA');
    const id = facturas.length + 1;
    let control = randomInt(100000, 999999);
    while (facturas.find(f => f.control == control)) {
        control = randomInt(100000, 999999);
    }


    await dbController.create(process.env.MYSQL_DATABASE + '.FACTURA', {id, base, iva, total, id_user, control, fecha });

    // Crear Envio
    if(entrega.length > 0) {
        const envios = await dbController.getAll(process.env.MYSQL_DATABASE + '.ENVIOS');
        const id_envio = envios.length + 1;
        await dbController.create(process.env.MYSQL_DATABASE + '.ENVIOS', {id: id_envio, destino: direccion, entrega, id_factura: id});
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
        const producto = (await dbController.getAll(process.env.MYSQL_DATABASE + '.INVENTARIO')).find(p => p.nombre_producto == product.nombre);
        
        if (!producto) {
            console.error(`Producto no encontrado: ${product.nombre}`);
            continue;
        }
        const id_producto = producto.id;
        const ingresos = product.cantidad * producto.precio_detal;
        const facturaExists = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.FACTURA WHERE id = ?`, [id]);
    
        if (facturaExists.length === 0) {
            console.error(`Factura con id ${id} no existe. No se puede insertar el producto.`);
            continue;
        }
    
        try {
            await dbController.create(process.env.MYSQL_DATABASE + '.PRODUCTOS_FACTURADOS', { id_factura: id, id_producto, cantidad: product.cantidad, ingresos });
            
            // Restar la cantidad del producto del inventario
            const nuevaCantidad = parseInt(producto.stock) - parseInt(product.cantidad);
            if (nuevaCantidad < 0) {
                console.error(`No hay suficiente inventario para el producto: ${product.nombre}`);
                continue;
            }
            if(nuevaCantidad == 0) {
                await dbController.create(process.env.MYSQL_DATABASE + '.AVISOS', {id: (await dbController.count(process.env.MYSQL_DATABASE + ".AVISOS")) + 1, titulo: 'Producto Agotado', descripcion: `El producto ${producto.nombre_producto} se ha agotado`, 'tipo': 'stock', 'fecha': new Date().toISOString().slice(0, 19).replace('T', ' ')});
            }
            await dbController.customQuery(`UPDATE ${process.env.MYSQL_DATABASE}.INVENTARIO SET stock = ? WHERE id = ?`, [nuevaCantidad, id_producto]);
        } catch (error) {
            console.error("Error al insertar en PRODUCTOS_FACTURADOS o actualizar INVENTARIO: ", error);
        }
    }

    //Creacion de la Factura
    res.send(JSON.stringify({mensaje: 'Compra Exitosa', factura: id}));
})

//Generacion de PDF de la Factura
app.post('/pdf', async (req, res) => {
    const id = req.body.id;
    const factura = await dbController.getOne(process.env.MYSQL_DATABASE + '.FACTURA', id);
    const productos = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.PRODUCTOS_FACTURADOS WHERE id_factura = ?`, [id]);
    const productosFacturados = [];

    for (const producto of productos) {
        const { nombre_producto, precio_detal } = (await dbController.getOne(process.env.MYSQL_DATABASE + '.INVENTARIO', producto.id_producto))[0];
        productosFacturados.push({
            nombre: nombre_producto,
            cantidad: producto.cantidad,    
            precio: precio_detal,
            ingresos: producto.ingresos
        });
    }

    // Transformar de ProductoFacturado a Inventario y Darselo a ProductosFacturados
    
    const { base, iva, total, fecha, control } = factura[0];
    const { nombre, apellido, direccion, cedula } = (await dbController.getOne(process.env.MYSQL_DATABASE + '.CLIENTES', factura[0].id_user))[0];
    const doc = generatePDF(productosFacturados, base, iva, total, fecha, direccion, control, nombre, apellido, cedula);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=facturaDrinkers.pdf');
    doc.pipe(res);
    doc.end();
})

//Obtener factura en consultas
app.post('/admin/consulta', async (req, res) => {
    const { numero, categoria } = req.body;
    let factura;

    if(categoria == 'id'){
        factura = await dbController.getOne(process.env.MYSQL_DATABASE + '.FACTURA', numero);
        if(factura.length == 0) {
            return res.send(JSON.stringify({mensaje: 'Factura no encontrada'}));
        }
    } else {
        factura = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.FACTURA WHERE control = ?`, [numero]);
        if(factura.length == 0) {
            return res.send(JSON.stringify({mensaje: 'Factura no encontrada'}));
        }
    }

    res.send(JSON.stringify(factura[0]));
})

//Obtener cliente en consultas
app.post('/admin/consulta/client', async (req, res) => {
    const { numero, categoria } = req.body;
    let cliente;

    if(categoria == 'id'){
        cliente = await dbController.getOne(process.env.MYSQL_DATABASE + '.CLIENTES', numero);
        if(cliente.length == 0) {
            return res.send(JSON.stringify({mensaje: 'Cliente no encontrado/a'}));
        }
    } else {
        cliente = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.CLIENTES WHERE cedula = ?`, [numero]);
        if(cliente.length == 0) {
            return res.send(JSON.stringify({mensaje: 'Cliente no encontrado/a'}));
        }
    }

    res.send(JSON.stringify(cliente[0]));
})