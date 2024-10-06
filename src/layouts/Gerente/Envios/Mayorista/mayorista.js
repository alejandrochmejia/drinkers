let minorista = document.getElementById('minorista');
let mayorista = document.getElementById('mayorista');

minorista.addEventListener('mouseover',()=>{
    mayorista.style = "color: #232326; background-color: #fff;"
})
minorista.addEventListener('mouseout',()=>{
    mayorista.style = "color:#FFFFFF; background-color: #001752"
})