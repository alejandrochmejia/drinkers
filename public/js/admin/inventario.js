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

let modificar = document.getElementById('Modificar');
let modalModificar = document.getElementById('dialog--2');
let cerrarModificar = document.getElementById('Cerrar--ventana');

//Evento que abre la ventana modal de eliminar producto del inventario
modificar.addEventListener('click',()=>{
    modalModificar.showModal();
})

//Evento que cierra la ventana modal de eliminar
cerrarModificar.addEventListener('click',()=>{
    modalModificar.close();
})

// Evento para las tablas los cuales quede presionado
let Eliminar = document.getElementById('Eliminar');
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
Eliminar.addEventListener('click',()=>{
    confirm("Esta seguro que quiere eliminar este producto del inventario")
    clickTabla.forEach(async (fila)=>{
        if(fila.classList.contains('presionado--bottom')){
            await fetch('/admin/inventario/eliminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: fila.children[0].textContent})
            })
            .then(
                window.location.href = '/admin/inventario'
            )
        }
    })
})

let tipo = document.querySelector('select[name="tipo"]');

tipo.addEventListener('change',()=>{
    let tipoSeleccionado = tipo.value;
    let tabla = document.querySelector('.Table--inventario table tbody');
    let filas = tabla.querySelectorAll('tr');
    filas.forEach((fila)=>{
        let tipoFila = fila.children[2].textContent;
        if(tipoSeleccionado === ''){
            fila.style.display = 'table-row';
        }else if(tipoFila === tipoSeleccionado){
            fila.style.display = 'table-row';
        }else{
            fila.style.display = 'none';
        }
    })
})

let lupa = document.getElementById('Lupa');

lupa.addEventListener('click',()=>{
    let search = document.getElementById('Buscar').value;
    let tabla = document.querySelector('.Table--inventario table tbody');
    let filas = tabla.querySelectorAll('tr');
    filas.forEach((fila)=>{
        let nombre = fila.children[1].textContent;
        if(search === ''){
            fila.style.display = 'table-row';
        }else if(nombre.includes(search)){
            fila.style.display = 'table-row';
        }else{
            fila.style.display = 'none';
        }
    })
})
//Evento para un alert cuando se quiere agregar un nuevo producto al inventario
let submit = document.getElementById('submit--Agregar');
submit.addEventListener('click',()=>{
    confirm("Esta seguro que quiere agregar este producto al inventario?")
})
//Evento para un alert cuando se quiere modiicar un producto al inventario
let submit_modificar = document.getElementById('submit');
submit_modificar.addEventListener('click',()=>{
    confirm("Esta seguro que quiere modifcar este producto del inventario?")
})