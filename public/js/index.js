document.addEventListener('DOMContentLoaded', function() {
    const cartMenu = document.querySelector("aside");
    cartMenu.style.right = '-110%';
});

document.getElementById("cart").addEventListener("click", function() {
    const cartMenu = document.querySelector("aside");
    if (cartMenu.style.right === '-110%') {
        closeChatbot()
        cargarCarrito();
        cartMenu.style.right = '0%';
    } else {
        cartMenu.style.right = '-110%';
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
});

window.addEventListener("scroll", function() {
    const currentScroll = window.scrollY;
    if(window.scrollY >= 0 && window.scrollY <= 15){
        document.querySelector("header").style.top = '0%';
    }
    else if (currentScroll > lastScroll){
        // scroll down
        document.querySelector("header").style.top = '-20%';
        document.querySelector("aside").style.right = '-110%';
    } else if (currentScroll < lastScroll) {
        // scroll up
        document.querySelector("header").style.top = '0%';
    }
    // scroll update
    lastScroll = currentScroll;
    });
});

async function addProduct(button) {
    const productView = button.parentElement;
    const productLi = productView.parentElement;
    const nombreProducto = productLi.querySelector('h4').innerText;
    const cantidad = productView.querySelector('.productCant').value;
    let precio = parseFloat(productLi.querySelector('.product-price').innerText.split(' ')[1]);
    const imagen = productView.querySelector('.productImg').src;
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial")
    const data = await response.json()
    const dolar = data.promedio

    let producto = nombreProducto.replace(/ /g, '');

    let cantidadTotal = cantidad;
    if (sessionStorage.getItem(producto)) {
        cantidadTotal = parseInt(cantidad) + parseInt(JSON.parse(sessionStorage.getItem(producto)).cantidad);
    }

    if(document.getElementById('bs').style.background === "var(--black)"){
        precio = (precio / dolar).toFixed(2)
    }

    const productStorage = {
        cantidad: cantidadTotal,
        precio: precio,
        imagen: imagen
    };

    sessionStorage.setItem(producto, JSON.stringify(productStorage));

    document.getElementById('cart-length').innerText = sessionStorage.length;

    cargarCarrito();
}

function AdultQuestionButton(){
    let content = document.querySelector('body');
    content.style.overflowY = 'auto'
    let modal = document.getElementById('modalBackground')
    modal.style.opacity = '0'
    setTimeout(()=>{
        modal.style.display = 'none'
    },200)
}

document.addEventListener('DOMContentLoaded',() => {
    let container = document.getElementById('modalContainer')
    container.style.opacity = "1"
})