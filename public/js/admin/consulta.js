document.querySelector('#lupaConsulta').addEventListener('click', async () => {
    const input = document.querySelector('#inputConsulta');
    const select = document.querySelector('#selectConsulta');

    if (input.value === '') {
        input.focus();
        return;
    }

    let factura;

    if(select.value === '0') {
        await fetch('/admin/consulta/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({numero: input.value, categoria: 'id'})
        }).then(res => res.json())
        .then(data => {
            if(data.mensaje) return alert(data.mensaje);
            factura = data;
        })
    }
    else{
        await fetch('/admin/consulta/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({numero: input.value, categoria: 'control'})
        }).then(res => res.json())
        .then(data => {
            if(data.mensaje) return alert(data.mensaje);
            factura = data;
        })
    }

    factura.fecha = new Date(factura.fecha).toLocaleDateString();

    const tbody = document.querySelector('#tbodyConsulta');

    if (factura) {
        tbody.innerHTML = `
            <tr>
                <td>${factura.id}</td>
                <td>${factura.control}</td>
                <td>${factura.fecha}</td>
                <td>${factura.id_user}</td>
                <td>${factura.base} $</td>
                <td>${factura.iva}%</td>
                <td>${factura.total} $</td>
            </tr>
        `;
    } else {
        tbody.innerHTML = `
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `;
    }
})
