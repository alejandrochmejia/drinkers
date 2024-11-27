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

document.querySelector('#lupaUsuario').addEventListener('click', async () => {
    const input = document.querySelector('#inputUsuario');
    const select = document.querySelector('#selectUsuario');

    if (input.value === '') {
        input.focus();
        return;
    }

    let user;

    if(select.value === '0') {
        await fetch('/admin/consulta/client',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({numero: input.value, categoria: 'id'})
        }).then(res => res.json())
        .then(data => {
            if(data.mensaje) return alert(data.mensaje);
            user = data;
        })
    }
    else{
        await fetch('/admin/consulta/client',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({numero: input.value, categoria: 'cedula'})
        }).then(res => res.json())
        .then(data => {
            if(data.mensaje) return alert(data.mensaje);
            user = data;
        })
    }

    user.nacimiento = new Date(user.nacimiento).toLocaleDateString();

    if(user.direccion === null) user.direccion = 'No tiene dirección';

    const tbody = document.querySelector('#tbodyUsuario');

    if (user) {
        tbody.innerHTML = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.nacimiento}</td>
                <td>******</td>
                <td>${user.nombre}</td>
                <td>${user.apellido}</td>
                <td>${user.cedula}</td>
                <td>${user.direccion}</td>
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