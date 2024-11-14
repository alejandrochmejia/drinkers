let Nombre = document.getElementById('Nombre--persona');
let Apellido = document.getElementById('Apellido--persona');
let nacimiento = document.getElementById('Nacimiento');
let email = document.getElementById('Correo');
let contraseña = document.getElementById('Password');
let user = document.getElementById('Username');
let direccion = document.getElementById("Direccion");
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
    if (contraseña.value.length == 6) {
        contraseña.style.border = "2px solid #04f"
    } else {
        contraseña.style.border = "2px solid #f00"
    }
})

Button.addEventListener('click', (e)=>{
    e.preventDefault()
    if (Nombre.value == 0 && Apellido.value == 0 && email.value == 0 && contraseña.value == 0 && nacimiento.value == 0 && user.value == 0 && direccion.value == 0) {
        alert("Todos los campos esta vacios para hacer la cuenta rellene los campos")
    } else if(Nombre.value == 0 || Apellido.value == 0 || email.value == 0 || contraseña.value == 0 || nacimiento.value == 0 || user.value == 0 || direccion.value == 0){
        alert("Alguns campos no esta completos por favor complete los campos faltantes")
    }else {
        alert("Se ha creado la cuenta")
        window.location.href = "../Login/index.html"
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