let Nombre = document.getElementById('Nombre');
let Apellido = document.getElementById('Apellido');
let email = document.getElementById('Correo');
let contraseña = document.getElementById('Password');
const button = document.getElementsByClassName('Submit--From')[0];

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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        //Creo que me tira vacio porque faltan datos respecto a la base de datos
        if (Nombre.value && Apellido.value && email.value && contraseña.value) {

            const data = {
                nombre: Nombre.value,
                apellido: Apellido.value,
                email: email.value,
                password: contraseña.value
            };

            try {
                const response = await fetch('/register', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const responseData = await response.json();
                location.href = responseData.ruta
            } catch (error) {
                console.error("Error en el registro:", error);
            }
        } else {
            console.log("Tienes que llenar todos los campos para poder crear la cuenta");
        }
    });
});