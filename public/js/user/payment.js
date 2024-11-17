//Ocultando Pasos del DOM
document.querySelector('#firstStep').style.display = 'none';
document.querySelector('#secondStep').style.display = 'none';
//document.querySelector('#thirdStep').style.display = 'none';

//Variables
var baseImponible = 0;
const iva = parseFloat(document.querySelector('#iva').textContent) / 100

//Evento de Regresar Paso
document.querySelectorAll('.steps .backStep').forEach(button => {
    button.addEventListener('click', e => {
        let step = e.currentTarget.parentElement.parentElement;
        let previousStep = step.previousElementSibling;
        if(step.id === 'firstStep'){
            window.location.href = '/'
            return
        }
        step.style.display = 'none';
        previousStep.style.display = 'flex';
    })
})

//Evento de Siguiente Paso
document.querySelectorAll('.steps .nextStep').forEach(button => {
    button.addEventListener('click', e => {
        let step = e.currentTarget.parentElement.parentElement;
        let nextStep = step.nextElementSibling;
        if(nextStep.id === 'secondStep'){
            Swal.fire({
                title: "Ingrese un numero telefonico",
                input: "number",
                confirmButtonText: "Confirmar",
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                const phone = result.value
                document.querySelector('#phone').textContent = phone
              });
        }
        step.style.display = 'none';
        nextStep.style.display = 'flex';
    })
})

document.addEventListener('DOMContentLoaded', () => {

    let products = []
    for(let i = 0; i < window.sessionStorage.length; i++){
        products.push(JSON.parse(window.sessionStorage.getItem(window.sessionStorage.key(i))))
        baseImponible += parseFloat(products[i].precio) * parseInt(products[i].cantidad)
    }
    document.querySelector('#baseImponible').textContent = baseImponible.toFixed(2)
    document.querySelector('#total').textContent = (baseImponible + (baseImponible * iva)).toFixed(2)
})