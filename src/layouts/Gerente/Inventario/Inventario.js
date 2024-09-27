let añadir = document.getElementById('Añadir');
let modalAgregar = document.getElementById('dialog--1');
let cerrar = document.getElementById('Cerrar');
//Evento que abre la ventana modal
añadir.addEventListener('click',()=>{
    modalAgregar.showModal();
})
//Evento qeu cierra la ventana modal
cerrar.addEventListener('click',()=>{
    modalAgregar.close();
})
let eliminar = document.getElementById('Eliminar');
let modalEliminar = document.getElementById('dialog--2');
let cerrarVenta = document.getElementById('Cerrar--venta');
//Evento que abre la ventana modal de eliminar producto del inventario
eliminar.addEventListener('click',()=>{
    modalEliminar.showModal();
})
//Evento que cierra la ventana modal de eliminar
cerrarVenta.addEventListener('click',()=>{
    modalEliminar.close();
})
let modificar = document.getElementById('Modificar');
let modalModificar = document.getElementById('dialog--3');
let cerrarVentana = document.getElementById('Cerrar--ventana');
//Evento que abre la ventana modal de modificar un producto del inventario
modificar.addEventListener('click',()=>{
    modalModificar.showModal();
})
//Evento que cierra la ventana modal de modificar producto
cerrarVentana.addEventListener('click',()=>{
    modalModificar.close();
})