let Nombre = document.getElementById('Nombre--persona');
let Apellido = document.getElementById('Apellido--persona');
let nacimiento = document.getElementById('Fecha--nacimiento');
let email = document.getElementById('Correo');
let contraseña = document.getElementById('Password');
let user = document.getElementById('Username');
const Button = document.getElementById('Cuenta');

// Funcion que valida el correo
function IsvalidEmail(Email) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(Email)
}
email.addEventListener('input',()=>{
    const Correo = email.value
    const validar = IsvalidEmail(Correo)

    if (validar) {
        email.style.border = "2px solid #04f"
    }else{
        email.style.border = "2px solid #f00"
    }
})
// Funcion que valida la contraseña
contraseña.addEventListener('input',()=>{
    if (contraseña.value.length == 8) {
        contraseña.style.border = "2px solid #04f"
    } else {
        contraseña.style.border = "2px solid #f00"
    }
})

Button.addEventListener('click', (e)=>{
    e.preventDefault()
    if (Nombre.value == 0 && Apellido.value == 0 && email.value == 0 && contraseña.value == 0 && nacimiento.value == 0 && user.value == 0) {
        alert("Todos los campos esta vacios para hacer la cuenta rellene los campos")
    } else if(Nombre.value == 0 || Apellido.value == 0 || email.value == 0 || contraseña.value == 0 || nacimiento.value == 0 || user.value == 0){
        alert("Alguns campos no esta completos por favor complete los campos faltantes")
    }else {
        alert("Se ha creado la cuenta")
        window.location.href = "../Login/index.html"
    }
})