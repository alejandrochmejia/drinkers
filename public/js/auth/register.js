let Nombre = document.getElementById('Nombre');
let Apellido = document.getElementById('Apellido');
let email = document.getElementById('Correo');
let contraseña = document.getElementById('Password');
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
    if (Nombre.value == 0 && Apellido.value == 0 && email.value == 0 && contraseña.value == 0) {
        alert("Tienque llenar todos los campos para poder crear la cuenta")
    } else {
        const form = document.getElementsByClassName('Form__page')[0]
        form.addEventListener('submit', async (e)=>{
            e.preventDefault()
            //Extraer elementos del DOM
    
            try {
                const response = await fetch('/register', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        //Ingresar Claves del DOM
                    })
                })
                const data = await response.json()
                location.href = data.ruta
            } catch (error) {
                console.log(error)
            }
        })
    }
})