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
Eliminar.addEventListener('click',()=>{
    confirm("Esta seguro que quieres eliminar este proveedor de la tabla?")
    clickTabla.forEach(async (fila)=>{
        if(fila.classList.contains('presionado--bottom')){
            await fetch('/admin/proveedor/eliminar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: fila.children[0].textContent})
            })
            .then(
                window.location.href = '/admin/proveedor'
            )
        }
    })
})
//Validaciones
//Valdaciones en la ventana modal de agregar proveedor
const Nombreprov = document.getElementById('Nombre--proveedor');
const RIFprov = document.getElementById('RIF');
const Productoprov = document.getElementById('Bebida');
const Ubiprov = document.getElementById('Ubicación');
const Tlfprov = document.getElementById('Telefono');
const fechaCompra = document.getElementById('Fecha--compra');
const fechaEntrega = document.getElementById('Fecha--entrega');
// Funcion que valida si en el campo se ingresa numeros
function ValidNum(validar) {
    const regex = /^-?\d+\.?\d*$/
    return regex.test(validar)
}
RIFprov.addEventListener('input',()=>{
    let validar = ValidNum(RIFprov.value)

    if(validar){
        RIFprov.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(RIFprov.value == 0){
            RIFprov.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            RIFprov.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Tlfprov.addEventListener('input',()=>{
    let validar = ValidNum(Tlfprov.value)
    
    if(validar){
        Tlfprov.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Tlfprov.value == 0){
            Tlfprov.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Tlfprov.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
// Funcion que valida si el campo se ingreso palabras
function ValidLetra(validar) {
    const regex = /\b[a-zA-Z]+\b/
    return regex.test(validar)
}
Nombreprov.addEventListener('input',()=>{
    let validar = ValidLetra(Nombreprov.value)

    if(validar){
        Nombreprov.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Nombreprov.value == 0){
            Nombreprov.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Nombreprov.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Productoprov.addEventListener('input',()=>{
    let validar = ValidLetra(Productoprov.value)

    if(validar){
        Productoprov.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Productoprov.value == 0){
            Productoprov.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Productoprov.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
//Funcion que valida si el campo se ingreso numeros,palabras y cararcteres especiales
function ValidUbicacion(validar) {
    const regex = /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-={}:<>?\/]+$/g
    return regex.test(validar)
}
Ubiprov.addEventListener('input',()=>{
    let validar = ValidUbicacion(Ubiprov.value)

    if(validar){
        Ubiprov.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Ubiprov.value == 0){
            Ubiprov.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Ubiprov.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
//Validaciones para las fechas
fechaCompra.addEventListener('input',()=>{
    const fecha = new Date();
    const valor = new Date(fechaCompra.value)
    if(valor < fecha){
        fechaCompra.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
    }else{
        fechaCompra.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }
})
fechaEntrega.addEventListener('input',()=>{
    const fecha = new Date(fechaCompra.value)
    const valor = new Date(fechaEntrega.value)
    if(valor <= fecha){
        fechaEntrega.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
    }else{
        fechaEntrega.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }
})
//Evento del boton de agregar en la ventana modal de agregar proveedor
let submitAgregar = document.getElementById('SubmitAgregar');
submitAgregar.addEventListener('click',()=>{
    if(Nombreprov.value == 0 && RIFprov.value == 0 && Tlfprov.value == 0 && Productoprov.value == 0 && fechaCompra.value == 0 
        && fechaEntrega.value == 0){
            alert("Tiene que llenar todos los campos para poder agregar al proveedor")
    }else if(Nombreprov.value == 0 || RIFprov.value == 0 || Tlfprov.value == 0 || Productoprov.value == 0 || fechaCompra.value == 0 
        || fechaEntrega.value == 0){
            alert("Hay campos que no esta completos, por favor complete los campos faltantes para poder continuar")
    }else{
        confirm("Esta seguro que quiere agregar este proveedor a la tabla?")
    }
})
//Validaciones para la ventana modal de modificar un proveedor

