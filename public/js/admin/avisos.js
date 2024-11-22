//Declaracion del Toast
const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    background: '#001752',
    color: '#fff',
    timer: 1500,
    timerProgressBar: true,
})

//Validaciones
const descripcion = document.getElementById('Descripcion');
const Tipo__aviso = document.getElementById('Tipo');
const fecha__aviso = document.getElementById('Fecha--aviso');
//Evento para la imagen que esta al lado del input
let borrar__cont = document.getElementById('Borrar');

borrar__cont.addEventListener('click',()=>{
    if(descripcion.value == 0){
        alert("No ha escrito un reporte")
    }else{
        descripcion.value = ""
    }
})
//validacion para ver si el campo contiene numeros,letras y caracteres especiales
function ValidDescripcion(validar) {
    const regex = /^[a-zA-Z0-9\s.,!?@#$%^&*()_+-={}:<>?\/]+$/g
    return regex.test(validar)
}
descripcion.addEventListener('input', ()=>{
    let validar = ValidDescripcion(descripcion.value)
    if(validar){
        return
    }
})
//validacion de la fecha del aviso
fecha__aviso.addEventListener('input',()=>{
    const fecha = new Date()
    const valor = new Date(fecha__aviso.value)
    if(valor <= fecha){
        alert("La fecha que coloco no es aceptable coloque una fecha de hoy hasta el futuro")
    }else{
        let border = document.getElementById('Border');
        border.style = "border: 1px solid #04f";
    }
})
// validacion para el boton de crear aviso
let boton__aviso = document.getElementById('Aviso')
boton__aviso.addEventListener('click',()=>{
    if(descripcion.value == 0 && Tipo__aviso.value == 0 && fecha__aviso.value == 0){
        alert("Tiene que llenar todos los campos para mandar el aviso o reporte")
    }else if(descripcion.value == 0 || Tipo__aviso.value == 0 || fecha__aviso == 0){
        alert("Hay algunos campos que no esta completos, por favor complete los campos faltantes para continuar")
    }else{
        const pregunta = confirm("Esta seguro que quiere crear este aviso o reporte?")

        if(pregunta){
            return
        }else{
            descripcion.value = 0
            Tipo__aviso.value = 0
            fecha__aviso.value = 0
        }
    }
})

document.querySelector('form[action="/admin/avisos/create"]').onsubmit = async (e) => {
    await Toast.fire({
        icon: 'info',
        title: 'Aviso creado'
    })
}