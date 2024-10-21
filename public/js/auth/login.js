let Email = document.getElementById('Email');
let Contraseña = document.getElementById('Contraseña');
const Button = document.getElementsByClassName('Submit--From')[0];
const Link = document.getElementById('Link')

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

document.addEventListener('DOMContentLoaded', ()=>{
    const form = document.getElementsByClassName('Form__page')[0]
    form.addEventListener('submit', async (e)=>{
        e.preventDefault()
        const email = document.getElementById('Email').value
        const password = document.getElementById('Contraseña').value

        try {
            const response = await fetch('/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            const data = await response.json()
            if (data.token) {
                // Almacena el token en el localStorage o en una cookie
                window.localStorage.setItem('token', data.token);
                // Redirige al usuario
                window.location.href = data.redirectTo;
            } else {
                // Manejo de errores (credenciales inválidas)
                alert(data.mensaje);
            }
        } catch (error) {
            console.log(error)
        }
    })
})