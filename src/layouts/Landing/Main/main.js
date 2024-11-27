function AdultQuestionButton(){
    let content = document.querySelector('body');
    content.style.overflowY = 'auto'
    let modal = document.getElementById('modalBackground')
    modal.style.opacity = '0'
    setTimeout(()=>{
        modal.style.display = 'none'
    },400)
}

document.addEventListener('DOMContentLoaded',() => {
    let container = document.getElementById('modalContainer')
    container.style.opacity = "1"
})