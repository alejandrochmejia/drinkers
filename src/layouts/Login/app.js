let Email = document.getElementById('Email');
let Contraseña = document.getElementById('Contraseña');
const Button = document.getElementsByClassName('Submit--From')[0];
const CrearCuenta = document.getElementById('Crear')

//Funcion que valida el correo
function IsvalidEmail(validar) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    return regex.test(validar)
}
Email.addEventListener('input', ()=>{
    const gmail = Email.value
    let validar = IsvalidEmail(gmail)

    if (validar) {
        Email.style.border = "2px solid #04f"
    }else{
        Email.style.border = "2px solid #F00"
    }
})
//Funcion que valida la contraseña
Contraseña.addEventListener('input',()=>{
    if(Contraseña.value.length == 8){
        Contraseña.style.border = "2px solid #04f"
    }else{
        Contraseña.style.border = "2px solid #F00"
    }
})


Button.addEventListener('click',(e) =>{
    e.preventDefault()
    if (Email.value == 0 && Contraseña.value == 0) {
        alert("No ha rellenado los campos de texto")
    }else{
        window.location.href = "../Gerente/Main/Main.html"
    }
})
CrearCuenta.addEventListener('click',()=>{
    const enlace = "../Register/Index.html"
    if(enlace){
        window.location.href = enlace
    }else{
        console.log("Error")
    }
})