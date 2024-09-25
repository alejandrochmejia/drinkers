let añadir = document.getElementById('Añadir');
let modificar = document.getElementById('Modificar');
let eliminar = document.getElementById('Eliminar');
let modalAñadir = document.getElementById('Agregar')
let button = document.getElementById('submit')

añadir.addEventListener('click',()=>{
    modalAñadir.showModal();
})
button.addEventListener('click',()=>{
    modalAñadir.close()
})