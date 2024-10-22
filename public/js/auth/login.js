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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementsByClassName('Form__page')[0];
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('Email').value;
        const password = document.getElementById('Contraseña').value;

        try {
            const response = await fetch('/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            if (data.token) {
                // Almacena el token en el localStorage
                window.localStorage.setItem('token', data.token);
                // Redirige al usuario o llama a la función para cargar el dashboard
                window.location.href = data.redirectTo; // O llama a loadDashboard aquí si no rediriges
            } else {
                // Manejo de errores (credenciales inválidas)
                alert(data.mensaje);
            }
        } catch (error) {
            console.log('Error en la solicitud de inicio de sesión:', error);
        }
    });

    // Función para cargar el dashboard
    const loadDashboard = async () => {
        const token = window.localStorage.getItem('token'); // Obtener el token
    
        if (!token) {
            console.error('No se proporcionó el token, redirigiendo a login');
            return window.location.href = '/login'; // Redirigir si no hay token
        }
    
        try {
            const response = await fetch('/admin/dashboard', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}` // Agregar el token al encabezado
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                // Procesar y mostrar los datos en la vista
                console.log(data);
            } else {
                const errorData = await response.json();
                alert(errorData.mensaje); // Mostrar el mensaje de error
            }
        } catch (error) {
            console.log('Error al cargar el dashboard:', error);
        }
    };

    // Llama a loadDashboard cuando necesites acceder a la dashboard
    loadDashboard();
});