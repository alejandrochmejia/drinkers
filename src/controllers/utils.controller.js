import * as dbController from './db.controller.js';


//Funcion para verificar los productos que estan por agotarse y agregarlos a la DB
export async function verifyProveedor() {
    const day = new Date();
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    const inventario = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.INVENTARIO WHERE stock < 20`);
    for (const producto of inventario) {
        let proveedor = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.PROVEEDORES WHERE id_producto = ${producto.id}`);
        if(proveedor === undefined || proveedor === null || proveedor.length === 0) {
            await dbController.create(process.env.MYSQL_DATABASE+'.AVISOS', {id: (await dbController.count(process.env.MYSQL_DATABASE+'.AVISOS'))+1 ,titulo: 'Proveedor no encontrado', descripcion: `No se ha encontrado un proveedor para el producto ${producto.nombre_producto} con id ${producto.id}`, tipo: 'error', fecha: new Date()});
        }
        else{
            proveedor = proveedor[0];
            await dbController.create(process.env.MYSQL_DATABASE+'.COMPRA_PROVEEDORES',{id_proveedor: proveedor.id, fecha_compra: day, fecha_entrega: nextDay, cantidad_paquete: 100});    
        }
    }
}

//Funcion para verificar las compras que se tienen en el dia y agregarlas a la DB
export async function verifyCompras(){
    const compras = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.COMPRA_PROVEEDORES WHERE fecha_entrega <= CURDATE()`);
    for (const compra of compras) {
        const proveedor = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.PROVEEDORES WHERE id = ${compra.id_proveedor}`);
        const producto = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.INVENTARIO WHERE id = ${proveedor[0].id_producto}`);
        await dbController.customQuery(`UPDATE ${process.env.MYSQL_DATABASE}.INVENTARIO SET stock = stock + ${compra.cantidad_paquete} WHERE id = ${producto[0].id}`);
    }
}
export async function verifyEnvios(){
    const envios = await dbController.customQuery(`SELECT * FROM ${process.env.MYSQL_DATABASE}.ENVIOS WHERE fecha_entrega <= CURDATE()`);
    for (const envio of envios) {
        await dbController.customQuery(`UPDATE ${process.env.MYSQL_DATABASE}.ENVIOS SET status = delivered WHERE id = ${envio[0].id}`);
    }
}