//Ordenamiento de Mayor - Menor - Alfabeto
document.getElementById('sorting').addEventListener('change', function() {
    const lista = document.querySelector('.productSection')
    const items = Array.from(lista.getElementsByTagName('li'));

    // Ordenar según la opción seleccionada
    const valorSeleccionado = this.value;

    if (valorSeleccionado === 'menor') {
        items.sort((a, b) => {
            const precioA = parseFloat(a.querySelector('.product-price').innerText.replace('Desde ', '').replace(' $', ''));
            const precioB = parseFloat(b.querySelector('.product-price').innerText.replace('Desde ', '').replace(' $', ''));
            return precioA - precioB; // Orden ascendente
        });
    } else if (valorSeleccionado === 'mayor') {
        items.sort((a, b) => {
            const precioA = parseFloat(a.querySelector('.product-price').innerText.replace('Desde ', '').replace(' $', ''));
            const precioB = parseFloat(b.querySelector('.product-price').innerText.replace('Desde ', '').replace(' $', ''));
            return precioB - precioA; // Orden descendente
        });
    } else if (valorSeleccionado === 'alfabetico') {
        items.sort((a, b) => {
            const nombreA = a.querySelector('h4').innerText.toLowerCase();
            const nombreB = b.querySelector('h4').innerText.toLowerCase();
            return nombreA.localeCompare(nombreB); // Orden alfabético
        });
    }

    // Limpiar la lista y volver a agregar los elementos ordenados
    lista.innerHTML = '';
    items.forEach(item => lista.appendChild(item));
});