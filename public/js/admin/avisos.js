document.querySelector('.Tipo--aviso select').addEventListener('change', (e) => {

    let tipoSeleccionado = e.target.value;
    let tabla = document.querySelector('.Table--Container table tbody');
    let filas = tabla.querySelectorAll('tr');
    filas.forEach((fila)=>{
        let tipoFila = fila.children[1].textContent;
        if(tipoSeleccionado === ''){
            fila.style.display = 'table-row';
        }else if(tipoFila === tipoSeleccionado){
            fila.style.display = 'table-row';
        }else{
            fila.style.display = 'none';
        }
    })
})
//Validaciones
