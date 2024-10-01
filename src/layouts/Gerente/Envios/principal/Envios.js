let minorista = document.getElementById('Minorista');
//Evento que  muestra la view de minorista
minorista.addEventListener('click',()=>{
    const enlace = '../Minorista/Minorista.html';
    if(enlace){
        window.location.href = enlace;
    }else{
        console.log("Error: no se encontro la ruta")
    }
})
let mayorista = document.getElementById('Mayorista');
//Evento que muestra la view de mayorista
mayorista.addEventListener('click',()=>{
    const enlace = '../Mayorista/Mayorista.html';
    if(enlace){
        window.location.href = enlace;
    }else{
        console.log("Error: no se encontro la ruta")
    }
})