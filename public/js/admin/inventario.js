let añadir = document.getElementById('Añadir');
let modificar = document.getElementById('Modificar');
let eliminar = document.getElementById('Eliminar');
let modalAñadir = document.getElementById('dialog--1')
let button = document.getElementById('submit')
let eliminarProducto = document.getElementById('dialog--2')
let buttonEliminar = document.getElementById('delete')
let modificarproducto = document.getElementById('dialog--3')
let buttonModificar = document.getElementById('modified')

añadir.addEventListener('click',()=>{
    modalAñadir.showModal();
})
button.addEventListener('click',()=>{
    modalAñadir.close()
})
eliminar.addEventListener('click',()=>{
    eliminarProducto.showModal();
})
buttonEliminar.addEventListener('click',()=>{
    eliminarProducto.close();
})

modificar.addEventListener('click',()=>{
    modificarproducto.showModal();
})
buttonModificar.addEventListener('click',()=>{
    modificarproducto.close();
})