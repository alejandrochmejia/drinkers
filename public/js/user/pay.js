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
            if (selectedImage) {selectedImage.src = '/images/icons/checkunfill.svg';}
        }

        // Asignar el nuevo modo seleccionado
        selectedMode = container;
        selectedMode.classList.add('selected-container');
        selectedMode.style.background = '#040C5D';
        selectedMode.style.color = '#EBEBEB';

        let selectedImage = selectedMode.querySelector('img');
        if (selectedImage) {selectedImage.src = '/images/icons/checkfill.svg';} // Cambia a la nueva imagen
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

let paymodes = document.getElementsByClassName("paymode")
let paymodeSelected = document.getElementById("paymode-selected")

for (let paymode of paymodes){
    paymode.addEventListener('click', e => {
        const container = e.currentTarget
        if (paymodeSelected === container){
            return;
        } else {
            paymodeSelected.classList.remove('selected-container');
            paymodeSelected.style.background = '#EBEBEB';
            paymodeSelected.style.color = '#040C5D';
            let selectedImage = paymodeSelected.querySelector('img');
            selectedImage.src = '/images/icons/checkunfill.svg';
            paymodeSelected = container;
            paymodeSelected.classList.add('selected-container');
            paymodeSelected.style.background = '#040C5D';
            paymodeSelected.style.color = '#EBEBEB';
            selectedImage = paymodeSelected.querySelector('img');
            selectedImage.src = '/images/icons/checkfill.svg'; // Cambia a la nueva imagen
        }
    });
}

let paytypes = document.getElementsByClassName("paytype");
let paytypeSelected = document.getElementById("selectedtype");

for(let paytype of paytypes){
    paytype.addEventListener('click', e => {
        const container = e.currentTarget
        if (paytypeSelected === container){
            return;
        } else{
            paytypeSelected.removeAttribute('id');
            paytypeSelected.style.background = '#EBEBEB';
            paytypeSelected.style.color = '#040C5D';
            paytypeSelected = container;
            paytypeSelected.id = 'selectedType';
            paytypeSelected.style.background = '#040C5D';
            paytypeSelected.style.color = '#EBEBEB';
        }

        let tarjetaContainer = document.getElementById('tarjeta')
        let pagoMovilContainer = document.getElementById('pagomovil');

        if (container.textContent == 'Tarjeta'){
            pagoMovilContainer.style.display = 'none'
            tarjetaContainer.style.display = 'flex'
        } else if (container.textContent == 'Pago Movil'){
            pagoMovilContainer.style.display = 'flex'
            tarjetaContainer.style.display = 'none'
        } else {
            pagoMovilContainer.style.display = 'none'
            tarjetaContainer.style.display = 'none'
        }
    })
}

let selectedarrow = document.getElementById('first-arrow');

function firstButtonClicked(){
    selectedarrow.classList.remove("selectedarrow");
    selectedarrow = document.getElementById("second-arrow");
    selectedarrow.classList.add("selectedarrow")
    let containerOut = document.getElementById('first-step')
    containerOut.style.display = 'none'
    let containerIn = document.getElementById('second-step')
    containerIn.style.display = 'grid'
}

function secondButtonClicked(){
    selectedarrow.classList.remove("selectedarrow");
    selectedarrow = document.getElementById("third-arrow");
    selectedarrow.classList.add("selectedarrow")
    let containerOut = document.getElementById('second-step')
    containerOut.style.display = 'none'
    let containerIn = document.getElementById('third-step')
    containerIn.style.display = 'grid'
}

function thirdButtonClicked(){
    selectedarrow.classList.remove("selectedarrow");
    selectedarrow = document.getElementById("fourth-arrow");
    selectedarrow.classList.add("selectedarrow")
    let containerOut = document.getElementById('third-step')
    containerOut.style.display = 'none'
    let containerIn = document.getElementById('fourth-step')
    containerIn.style.display = 'grid'
}

function fourthButtonClicked(){
    
}

