let Nombre = document.getElementById('Nombre');
let Apellido = document.getElementById('apellido');
let email = document.getElementById('Email');
let contraseña = document.getElementById('password');
const Button = document.getElementsByClassName('Submit--From')[0];

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
    if (Nombre.valeu == 0 && Apellido.value && 0 && email.value == 0 && contraseña.value) {
        alert("Tienque llenar todos los campos para poder crear la cuenta")
    } else {
        alert("Se ha creado la cuenta")
        window.location.href = "../index.html"
    }
})