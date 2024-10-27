document.getElementById("cart").addEventListener("click",function(){
    cartMenu = document.querySelector("aside");
    if (cartMenu.style.right === '-31%'){
        cargarCarrito();
        cartMenu.style.right = '0%'
    } else {
        cartMenu.style.right = '-31%'
    }
});

let values = document.getElementsByClassName('value');
let selected = document.getElementById('dolars');
let unselected = NaN;

for (let value of values) {
    value.addEventListener("click", e => {
        if (selected == e.target){
            return;
        }
        unselected = selected;
        selected = e.target;
        selected.style.background = "var(--black)";
        selected.style.color = "var(--white)";
        unselected.style.background = "var(--white)";
        unselected.style.color = "var(--black)";
    });
}


document.addEventListener('DOMContentLoaded', function() {
// Selecciona todos los inputs de tipo number con una clase específica
const inputs = document.querySelectorAll('input[type="number"].productCant');

inputs.forEach(input => {
    // Establece el valor inicial en 1
    input.value = 1;

    // Evita que el valor sea menor a 1
    input.addEventListener('input', function() {
        if (input.value < 1) {
            input.value = 1;
        }
    });

    // Evita que se use la flecha abajo para bajar de 1
    input.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowDown' && input.value <= 1) {
            event.preventDefault();
        }
    });
});
});

document.addEventListener("DOMContentLoaded", function() {
let lastScroll = window.scrollY;

const product = document.querySelector('.productView button');
product.addEventListener('click', async () => {
    await fetch('/producto', {
        method: 'POST',
        body: JSON.stringify({
            name: 'test',
            price: 'test'
        })
    });
    alert('Producto agregado');
});

window.addEventListener("scroll", function() {
    const currentScroll = window.scrollY;
    if(window.scrollY >= 0 && window.scrollY <= 15){
        document.querySelector("header").style.top = '0%';
    }
    else if (currentScroll > lastScroll){
        // scroll down
        document.querySelector("header").style.top = '-20%';
        document.querySelector("aside").style.right = '-31%';
    } else if (currentScroll < lastScroll) {
        // scroll up
        document.querySelector("header").style.top = '0%';
    }
    // scroll update
    lastScroll = currentScroll;
    });
});

