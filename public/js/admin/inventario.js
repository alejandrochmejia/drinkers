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

//Validaciones
//Valiación para la ventana-modal de agregar inventario
const Nombrebebida = document.getElementById('NombreProducto');
const TipoBebida = document.getElementById('tipo');
const grados = document.getElementById('Grados');
const Litros = document.getElementById('Litros');
const Paquetes = document.getElementById('Paquetes');
const Iva = document.getElementById('Iva');
const Precio__detal = document.getElementById('Precio--detal');
const Precio__mayorista = document.getElementById('Precio--mayorista');
const descripcion = document.getElementById('Descripcion');
const stock = document.getElementById('stock');
//Validacion si en el campo solo se esta ingresando letras
function ValidLetra(validar){
    const regex = /\b[a-zA-Z]+\b/
    return regex.test(validar)
}
Nombrebebida.addEventListener('input',()=>{
    let nombre = Nombrebebida.value
    let validar = ValidLetra(nombre)

    if(validar){
        Nombrebebida.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Nombrebebida.value == 0){
            Nombrebebida.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Nombrebebida.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
//Validacion para el textarea
function ValidTextarea(validar) {
    const regex = /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-={}:<>?\/]+$/g
    return regex.test(validar)
}
descripcion.addEventListener('input',()=>{
    let Desc = descripcion.value
    let validar = ValidTextarea(Desc)

    if(validar){
        descripcion.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(descripcion.value == 0){
            descripcion.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            descripcion.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
//Validación si en el campo solo se esta ingresando numeros
function ValidNum(validar) {
    const regex = /^-?\d+\.?\d*$/
    return regex.test(validar)
}
grados.addEventListener('input', ()=>{
    let Grados = grados.value
    let validar = ValidNum(Grados)

    if(validar){
        grados.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(grados.value == 0){
            grados.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            grados.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Litros.addEventListener('input', ()=>{
    let litros = Litros.value
    let validar = ValidNum(litros)

    if(validar){
        Litros.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Litros.value == 0){
            Litros.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Litros.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Paquetes.addEventListener('input', ()=>{
    let paquete = Paquetes.value
    let validar = ValidNum(paquete)

    if(validar){
        Paquetes.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Paquetes.value == 0){
            Paquetes.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Paquetes.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Iva.addEventListener('input',()=>{
    let iva = Iva.value
    let validar = ValidNum(iva)

    if(validar){
        Iva.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Iva.value == 0){
            Iva.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Iva.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Precio__detal.addEventListener('input',()=>{
    let precio_detal = Precio__detal.value
    let validar = ValidNum(precio_detal)

    if(validar){
        Precio__detal.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Precio__detal.value == 0){
            Precio__detal.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Precio__detal.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Precio__mayorista.addEventListener('input',()=>{
    let precio_mayorista = Precio__mayorista.value
    let validar = ValidNum(precio_mayorista)

    if(validar){
        Precio__mayorista.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Precio__mayorista.value == 0){
            Precio__mayorista.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Precio__mayorista.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
stock.addEventListener('input',()=>{
    let Stock = stock.value
    let validar = ValidNum(Stock)

    if(validar){
        stock.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(stock.value == 0){
            stock.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            stock.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
let submit = document.getElementById('submit--Agregar');
submit.addEventListener('click',()=>{
    if(Nombrebebida.value == 0 && TipoBebida.value == 0 && grados.value == 0 && Litros.value == 0 && Paquetes.value == 0 
        && Iva.value == 0 && Precio__detal.value == 0 && Precio__mayorista.value == 0 && descripcion.value == 0 && stock.value == 0){
            alert("Tiene que llenar todos los campos para poder agregar el producto")
    }else{
        confirm("Esta seguro que quiere agregar este producto al inventario?")
    }
})
//Validaciones para la ventana modal de modificar producto
const ID = document.getElementById('Modificar--producto');
const Nombre__Modificar = document.getElementById('Nombre--modificar');
const tipo__modificar = document.getElementById('Tipo--modificar');
const Grados__modificar = document.getElementById('Grados--modificar');
const Litros__modificar = document.getElementById('Litros--modificar');
const Paquetes__modificar = document.getElementById('Paquetes--modificar');
const Iva__modificar = document.getElementById('Iva--modificar');
const precio__detal__modificar = document.getElementById('Precio--detal--modificar');
const precio__mayorista__modificar = document.getElementById('Precio--mayorista--modificar');
const descripcion__modificar = document.getElementById('Descripcion--modificar');
const stock__modificar = document.getElementById('stock--modificar');

//validacion para si en el campo se ingresa palabras
Nombre__Modificar.addEventListener('input',()=>{
    let validar = ValidLetra(Nombre__Modificar.value);
    if(validar){
        Nombre__Modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Nombre__Modificar.value == 0){
            Nombre__Modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Nombre__Modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
// validacion para el textarea
descripcion__modificar.addEventListener('input',()=>{
    let validar = ValidTextarea(descripcion__modificar.value)
    if(validar){
        descripcion__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(descripcion__modificar.value == 0){
            descripcion__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            descripcion__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
// validaciones para los campos que contiene numeros
ID.addEventListener('input',()=>{
    let validar = ValidNum(ID.value)
    if(validar){
        ID.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(ID.value == 0){
            ID.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            ID.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Grados__modificar.addEventListener('input',()=>{
    let validar = ValidNum(Grados__modificar.value)
    if(validar){
        Grados__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Grados__modificar.value == 0){
            Grados__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Grados__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Litros__modificar.addEventListener('input',()=>{
    let validar = ValidNum(Litros__modificar.value)
    if(validar){
        Litros__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Litros__modificar.value == 0){
            Litros__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Litros__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Paquetes__modificar.addEventListener('input',()=>{
    let validar = ValidNum(Paquetes__modificar.value)
    if(validar){
        Paquetes__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Paquetes__modificar.value == 0){
            Paquetes__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Paquetes__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
precio__detal__modificar.addEventListener('input',()=>{
    let validar = ValidNum(precio__detal__modificar.value)
    if(validar){
        precio__detal__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(ID.value == 0){
            precio__detal__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            precio__detal__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
precio__mayorista__modificar.addEventListener('input',()=>{
    let validar = ValidNum(precio__mayorista__modificar.value)
    if(validar){
        precio__mayorista__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(precio__mayorista__modificar.value == 0){
            precio__mayorista__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            precio__mayorista__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
stock__modificar.addEventListener('input',()=>{
    let validar = ValidNum(stock__modificar.value)
    if(validar){
        stock__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(stock__modificar.value == 0){
            stock__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            stock__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
//Evento para un alert cuando se quiere modiicar un producto al inventario
let submit_modificar = document.getElementById('submit');
submit_modificar.addEventListener('click',()=>{
    if(ID.value == 0 && Nombre__Modificar.value == 0 && tipo__modificar.value == 0 && Grados__modificar.value == 0 && Litros__modificar.value == 0
        && Paquetes__modificar.value == 0 && Iva__modificar.value == 0 && precio__detal__modificar.value == 0 && precio__mayorista__modificar.value == 0 
        && descripcion__modificar.value == 0 && stock__modificar.value == 0){
        
        alert("Tiene que llenar todos los campos para poder modificar un producto")
    }else{
        confirm("Esta seguro que quiere modificar este producto del inventario")
    }
})

