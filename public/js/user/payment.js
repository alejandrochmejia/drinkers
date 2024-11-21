//Ocultando Pasos del DOM
//document.querySelector('#firstStep').style.display = 'none';
document.querySelector('#secondStep').style.display = 'none';
document.querySelector('#thirdStep').style.display = 'none';
document.querySelector('#addressStep').style.display = 'none';

//Variables
var baseImponible = 0;
const iva = parseFloat(document.querySelector('#iva').textContent)
let products = []
let address = ''
let entrega = ''

//Evento de Regresar Paso
document.querySelectorAll('.steps .backStep').forEach(button => {
    button.addEventListener('click', e => {
        let step = e.currentTarget.parentElement.parentElement;
        let previousStep = step.previousElementSibling;
        if(step.id === 'firstStep'){
            window.location.href = '/'
            return
        }
        if(previousStep.id === 'secondStep' || previousStep.id === 'addressStep'){
            previousStep = document.querySelector('#firstStep')
        }
        step.style.display = 'none';
        previousStep.style.display = 'flex';
    })
})

//Evento de Siguiente Paso
document.querySelectorAll('.steps .nextStep').forEach(button => {
    button.addEventListener('click',async e => {
        let step = e.currentTarget.parentElement.parentElement;
        let nextStep = step.nextElementSibling;
        if (!nextStep){
            //Enviar Peticion de Pago
            await fetch('/payment',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    products: window.sessionStorage,
                    baseImponible: baseImponible,
                    iva: iva,
                    total: baseImponible + (baseImponible * (iva/100)),
                    fecha: new Date().toISOString().slice(0, 10),
                    direccion: address,
                    entrega: entrega,
                }),
                credentials: 'include'
            }).then(response => response.json())
            .then(data =>
                (
                    Swal.fire({
                    title: "Compra Exitosa",
                    text: "Muchas gracias por su compra",
                    icon: "success"
                }).then(() => {
                    // Limpiar Carrito
                    window.sessionStorage.clear();

                    // Función para descargar el PDF y redirigir
                    async function downloadPDFAndRedirect(id) {
                        const response = await fetch('/pdf',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: id
                            })
                        }); // Cambia la URL según sea necesario
                        if (response.ok) {
                            const blob = await response.blob(); // Obtener el archivo PDF como blob
                            const url = window.URL.createObjectURL(blob); // Crear una URL para el blob
                            const a = document.createElement('a'); // Crear un elemento <a>
                            a.href = url;
                            a.download = 'facturaDrinkers.pdf'; // Nombre del archivo
                            document.body.appendChild(a); // Agregar el elemento al DOM
                            a.click(); // Simular clic para descargar
                            a.remove(); // Eliminar el elemento del DOM
                            window.URL.revokeObjectURL(url); // Liberar la URL del blob

                            // Redirigir a otra ruta después de la descarga
                            window.location.href = '/';
                        } else {
                            console.error('Error al descargar el PDF');
                        }
                    }

                    // Llamar a la función para descargar el PDF y redirigir
                    downloadPDFAndRedirect(data.factura);
                    return
                }))
            );
        }
        if(document.querySelector('#firstStep select').value === 'delivery'){
            nextStep = document.querySelector('#addressStep')
        }
        if(document.querySelector('#firstStep select').value === 'pickup') {
            nextStep = document.querySelector('#secondStep')
            document.querySelector('#address').textContent = 'Retiro en Tienda'
        }

        if(step.id === 'addressStep'){
            if(document.querySelector('#addressInput').value.length > 0){
                document.querySelector('#address').textContent = document.querySelector('#addressInput').value
                address = document.querySelector('#addressInput').value
            }
            else{
                address = 'Predeterminada'
            }
            if(document.querySelector('#dateInput').value.length > 0){
                entrega = document.querySelector('#dateInput').value
            }
            else {
                entrega = new Date().toISOString().slice(0, 10);
            }
            

            e.target.textContent = 'Loading...';
            e.target.disabled = true;
    

            await fetch('/bot/route',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    direccion: address,
                }),
            }).then(response => response.json())
            .then(data => {
                const distancia = parseFloat(data.distancia)
                baseImponible += distancia * 0.5
                document.querySelector('#baseImponible').textContent = baseImponible.toFixed(2)
                document.querySelector('#total').textContent = (baseImponible + (baseImponible * (iva / 100))).toFixed(2)
            }).finally(() => {
                e.target.textContent = 'Siguiente';
                e.target.disabled = false;
            })

            nextStep = document.querySelector('#secondStep')
        }

        if(step.id === 'secondStep'){
            nextStep = document.querySelector('#thirdStep')
        }

        if(step.id === 'thirdStep'){
            nextStep = undefined
        }

        if(nextStep.id === 'secondStep'){
            Swal.fire({
                title: "Ingrese un numero telefonico",
                input: "number",
                confirmButtonText: "Confirmar",
                allowOutsideClick: false,
                allowEscapeKey: false,
                inputValidator: (value) => {
                    const venezuelaPhoneRegex = /^(\+58|0)?(4\d{2}|2\d{2})\d{7}$/;
                    if (!value) {
                        return 'Debe ingresar un número telefónico';
                    } else if (!venezuelaPhoneRegex.test(value)) {
                        return 'Debe ingresar un número telefónico válido de Venezuela';
                    }
                }
            }).then((result) => {
                const phone = result.value;
                document.querySelector('#phone').textContent = phone;
            });
        }
        step.style.display = 'none';
        nextStep.style.display = 'flex';
    })
})

document.addEventListener('DOMContentLoaded', () => {

    for(let i = 0; i < window.sessionStorage.length; i++){
        products.push(JSON.parse(window.sessionStorage.getItem(window.sessionStorage.key(i))))
        baseImponible += parseFloat(products[i].precio) * parseInt(products[i].cantidad)
    }

    document.querySelector('#baseImponible').textContent = baseImponible.toFixed(2)
    document.querySelector('#total').textContent = (baseImponible + (baseImponible * (iva / 100))).toFixed(2)
})