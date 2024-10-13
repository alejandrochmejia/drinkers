function Modal(){
    let modal = document.getElementById('modalContainer');
    if (modal.style.display == "flex"){
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

let modes = document.getElementsByClassName("selectMode");
let selectedMode = document.getElementById('selected-container');
let unselectedMode = null;

for (let mode of modes) {
    mode.addEventListener("click", e => {
        // Asegurarse de que el clic siempre sea del contenedor principal, no de los hijos
        const container = e.currentTarget;

        // Si el elemento ya está seleccionado, no hacer nada
        if (selectedMode === container) {
            return;
        }

        // Desmarcar el modo anteriormente seleccionado
        if (selectedMode) {
            selectedMode.classList.remove('selected-container');
            selectedMode.style.background = '#EBEBEB';
            selectedMode.style.color = '#040C5D';
            let selectedImage = selectedMode.querySelector('img');
            if (selectedImage) {selectedImage.src = '../../../../public/images/icons/checkunfill.svg';}
        }

        // Asignar el nuevo modo seleccionado
        selectedMode = container;
        selectedMode.classList.add('selected-container');
        selectedMode.style.background = '#040C5D';
        selectedMode.style.color = '#EBEBEB';

        let selectedImage = selectedMode.querySelector('img');
        if (selectedImage) {selectedImage.src = '../../../../public/images/icons/checkfill.svg';} // Cambia a la nueva imagen
    });
}
