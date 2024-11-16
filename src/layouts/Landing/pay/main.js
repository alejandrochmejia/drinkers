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

function setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // Sumar 10 minutos
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Formato para input datetime-local: "YYYY-MM-DDTHH:MM"
    const dateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    const dateTimeInput = document.getElementById("date-delivery");
    dateTimeInput.min = dateTime;  // Establecer como mínimo
    dateTimeInput.value = dateTime; // Establecer como valor predeterminado

    updateDateView(new Date(dateTime)); // Actualizar vista inicial
}

function updateDateView(selectedDate) {
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleString('es-ES', { month: 'long' });
    const year = selectedDate.getFullYear();

    document.getElementById("day").textContent = day;
    document.getElementById("month-year").textContent = `${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
}

let datetimeinput = document.getElementById("date-delivery");
datetimeinput.addEventListener("input", function() {
    const selectedDate = new Date(this.value);
    updateDateView(selectedDate);
});

window.onload = setMinDateTime;