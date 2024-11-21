let añadir = document.getElementById('Agregar');
let modalAgregar = document.getElementById('dialog--1');
let cerrarAgregar = document.getElementById('CerrarAgregar');

//Declaracion del Toast
const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
})
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
                await Toast.fire({
                    icon: 'info',
                    title: 'Proveedor eliminado'
                }),
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
        const pregunta = confirm("Esta seguro que quiere agregar este proveedor a la tabla?")
        if(pregunta){
            return
        }else{
            Nombreprov.value = ""
            RIFprov.value = ""
            Tlfprov.value = ""
            Productoprov.value = ""
            fechaCompra.value = ""
            fechaEntrega.value = ""
            Ubiprov.value = ""
        }
    }
})
//Validaciones para la ventana modal de modificar un proveedor
const IDprov = document.getElementById('ID--proveedor');
const Nombreprov__modificar = document.getElementById('Nombre--modificar');
const RIFprov__modificar = document.getElementById('RIF--modificar');
const Productoprov__modificar = document.getElementById('Bebida--modificar');
const Ubiprov__modificar = document.getElementById('Ubicación--modificar');
const Tlfprov__modificar = document.getElementById('Telefono--modificar');

// validacion para los campos que contenga numeros
IDprov.addEventListener('click',()=>{
    let validar = ValidNum(IDprov.value)

    if(validar){
        IDprov.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(IDprov.value == 0){
            IDprov.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            IDprov.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
RIFprov__modificar.addEventListener('click', ()=>{
    let validar = ValidNum(RIFprov__modificar.value)

    if(validar){
        RIFprov__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(RIFprov__modificar.value == 0){
            RIFprov__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            RIFprov__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Tlfprov__modificar.addEventListener('click',()=>{
    let validar = ValidNum(Tlfprov__modificar.value)

    if(validar){
        Tlfprov__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Tlfprov__modificar.value == 0){
            Tlfprov__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Tlfprov__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
// Validaciones para los campos que contenga palabras
Nombreprov__modificar.addEventListener('click',()=>{
    let validar = ValidLetra(Nombreprov__modificar.value)

    if(validar){
        Nombreprov__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Nombreprov__modificar.value == 0){
            Nombreprov__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Nombreprov__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
Productoprov__modificar.addEventListener('click', ()=>{
    let validar = ValidLetra(Productoprov__modificar.value)

    if(validar){
        Productoprov__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Productoprov__modificar.value == 0){
            Productoprov__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Productoprov__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
//Validacion para el campo de la ubicación
Ubiprov__modificar.addEventListener('click',()=>{
    let validar = ValidUbicacion(Ubiprov__modificar.value)

    if(validar){
        Ubiprov__modificar.style = "border-bottom: 2px solid #04f; border-right:2px solid #04f;"
    }else{
        if(Ubiprov__modificar.value == 0){
            Ubiprov__modificar.style = "border-bottom: 2px solid #aaa; border-right:2px solid #aaa;"
        }else{
            Ubiprov__modificar.style = "border-bottom: 2px solid #f00; border-right:2px solid #f00;"
        }
    }
})
// Evento para el boton modificar para la ventana modal de modificar un proveedor
let submitModificar = document.getElementById('SubmitModificar');
submitModificar.addEventListener('click', ()=>{
    if(IDprov.value == 0 && Nombreprov__modificar.value == 0 && RIFprov__modificar.value == 0 
        && Tlfprov__modificar.value == 0 && Productoprov__modificar == 0 && fechaCompra__modificar.value == 0
        && fechaEntrega__modificar.value == 0 && Ubiprov__modificar.value == 0){
            alert("Tiene que llenar todos los campos para poder modificar un proveedor")
    }else if(IDprov.value == 0 || Nombreprov__modificar.value == 0 || RIFprov__modificar.value == 0 
        || Tlfprov__modificar.value == 0 || Productoprov__modificar == 0 || fechaCompra__modificar.value == 0
        || fechaEntrega__modificar.value == 0 || Ubiprov__modificar.value == 0){
            alert("Hay algunos campos que no esta completos , por favor complete los campos faltantes para poder continuar")
    }else{
        const pregunta = confirm("Esta seguro que quiere modificar a este proveedor?")
        if(pregunta){
            return
        }else{
            IDprov.value == ""
            Nombreprov__modificar.value = ""
            RIFprov__modificar.value = ""
            Tlfprov__modificar.value = ""
            Productoprov__modificar.value = ""
            fechaCompra__modificar.value = ""
            fechaCompra__modificar.value = ""
            Ubiprov__modificar.value = ""
        }
    }
})

const buscador = document.querySelector('#tbodyProveedores');
const input = document.querySelector('#Search');

input.addEventListener('keyup', () => {
  const filter = input.value.toLowerCase();
  const rows = buscador.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    let match = false;

    cells.forEach(cell => {
      if (cell.textContent.toLowerCase().includes(filter)) {
        match = true;
      }
    });

    if (match) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});