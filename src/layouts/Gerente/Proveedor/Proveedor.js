let añadir = document.getElementById('Agregar');
let modalAgregar = document.getElementById('dialog--1');
let cerrarAgregar = document.getElementById('CerrarAgregar');
//Evento que abre la ventana modal
añadir.addEventListener('click',()=>{
    modalAgregar.showModal();
})
//Evento que cierra la ventana modal
cerrarAgregar.addEventListener('click',()=>{
    modalAgregar.close()
})
let modificar = document.getElementById('Modificar');
let modalModificar = document.getElementById('dialog--2');
let cerrarModificar = document.getElementById('CerrarModificar');
//Evento que abre la ventana modal
modificar.addEventListener('click',()=>{
    modalModificar.showModal();
})
//Evento que cierra la ventana modal
cerrarModificar.addEventListener('click',()=>{
    modalModificar.close();
})
//Evento para eliminar proveedores de la tabla
let eliminar = document.getElementById('Eliminar');
let clickTabla = document.querySelectorAll('tr');

clickTabla.forEach((fila)=>{
    fila.addEventListener('click',()=>{
        if(fila.classList.contains('presionado--bottom')){
            fila.classList.remove('presionado--bottom');
        }else{
            fila.classList.add('presionado--bottom');
        }
    })
})
eliminar.addEventListener('click',()=>{
    clickTabla.forEach((fila)=>{
        if(fila.classList.contains('presionado--bottom')){
            fila.remove();
        }
    })
})