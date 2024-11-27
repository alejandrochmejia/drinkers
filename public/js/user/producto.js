async function addFromDetail(button) {
    const productView = button.closest('.info-container'); // Cambiado para buscar el contenedor de información
    const productLi = button.closest('.principal-container');
    const nombreProducto = productLi.querySelector('h2').innerText;
    const cantidad = productView.querySelector('.productCant').value;
    let precio = parseFloat(productLi.querySelector('.product-price').innerText.split(' ')[1]);
    
    // Asegúrate de que el selector sea correcto
    const imagenElement = productLi.querySelector('.productImg'); // Cambiado para buscar en el contenedor principal
    const imagen = imagenElement ? imagenElement.src : ''; // Manejo de caso nulo

    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
    const data = await response.json();
    const dolar = data.promedio;

    let producto = nombreProducto.replace(/ /g, '');

    let cantidadTotal = cantidad;
    if (sessionStorage.getItem(producto)) {
        cantidadTotal = parseInt(cantidad) + parseInt(JSON.parse(sessionStorage.getItem(producto)).cantidad);
    }

    if (document.getElementById('bs').style.background === "var(--black)") {
        precio = (precio / dolar).toFixed(2);
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