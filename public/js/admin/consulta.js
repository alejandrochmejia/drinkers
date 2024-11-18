document.querySelector('#lupaConsulta').addEventListener('click', async () => {
    const input = document.querySelector('#inputConsulta');
    const select = document.querySelector('#selectConsulta');

    if (input.value === '') {
        input.focus();
        return;
    }

    if(select.value === '0') {
        await fetch('/admin/consulta/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({numero: input.value, categoria: 'control'})
        }).then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }
    else{
        await fetch('/admin/consulta/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({numero: input.value, categoria: 'id'})
        }).then(res => res.json())
        .then(data => {
            console.log(data)
        })
    }
})
