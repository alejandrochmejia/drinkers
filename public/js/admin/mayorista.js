let minorista = document.getElementById('minorista');
let mayorista = document.getElementById('mayorista');

minorista.addEventListener('mouseover',()=>{
    mayorista.style = "color: #232326; background-color: #fff;"
})
minorista.addEventListener('mouseout',()=>{
    mayorista.style = "color:#FFFFFF; background-color: #001752"
})


let lupa = document.getElementById('Lupa');

lupa.addEventListener('click',()=>{
    let search = document.getElementById('Destino').value;
    let tabla = document.querySelector('.Table--Container table tbody');
    let filas = tabla.querySelectorAll('tr');
    filas.forEach((fila)=>{
        let destino = fila.children[2].textContent;
        if(search === ''){
            fila.style.display = 'table-row';
        }else if(destino.includes(search)){
            fila.style.display = 'table-row';
        }else{
            fila.style.display = 'none';
        }
    })
})