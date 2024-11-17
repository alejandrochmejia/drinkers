document.querySelector('#secondStep').style.display = 'none';

document.querySelectorAll('.steps .backStep').forEach(button => {
    button.addEventListener('click', e => {
        let step = e.currentTarget.parentElement.parentElement;
        let previousStep = step.previousElementSibling;
        if(step.id === 'firstStep'){
            window.location.href = '/'
            return
        }
        step.style.display = 'none';
        previousStep.style.display = 'flex';
    })
})

document.querySelectorAll('.steps .nextStep').forEach(button => {
    button.addEventListener('click', e => {
        let step = e.currentTarget.parentElement.parentElement;
        let nextStep = step.nextElementSibling;
        step.style.display = 'none';
        nextStep.style.display = 'flex';
    })
})