let minorista = document.getElementById('Minorista');
let mayorista = document.getElementById('Mayorista');

mayorista.addEventListener('mouseover',()=>{
    minorista.style = "color: #232326; background-color: #fff;";
})
mayorista.addEventListener('mouseout',()=>{
    minorista.style = "color:#FFFFFF; background-color: #001752"
})