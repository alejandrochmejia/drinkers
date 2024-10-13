function Modal(){
    let modal = document.getElementById('modalContainer');
    if (modal.style.display == "flex"){
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}