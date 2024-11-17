//document.querySelector('#secondStep').style.display = 'none';
document.querySelector('#firstStep').style.display = 'none';

var baseImponible = 0;

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

document.querySelectorAll('.steps .nextStep').forEach(button => {
    button.addEventListener('click', e => {
        let step = e.currentTarget.parentElement.parentElement;
        let nextStep = step.nextElementSibling;
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
    const iva = parseFloat(document.querySelector('#iva').textContent) / 100
    document.querySelector('#total').textContent = (baseImponible + (baseImponible * iva)).toFixed(2)
})