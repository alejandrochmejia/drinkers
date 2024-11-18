document.querySelector('#Dolar').oninput = async () => {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial")
    const data = await response.json()
    let dolar = data.promedio
    document.querySelector('#Bolivares').value = (dolar * document.querySelector('#Dolar').value).toFixed(2)
}

document.querySelector('#Bolivares').oninput = async () => {

    const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial")
    const data = await response.json()
    let dolar = data.promedio

    document.querySelector('#Dolar').value = (document.querySelector('#Bolivares').value / dolar).toFixed(2)
}

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/productos/vendidos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()    
    
})

const ctx = document.getElementById('myChart');


const grafica = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
  datasets: [{
    label: 'Productos mas vendidos ($)',
    data: [],
    borderWidth: 1
  }]
},
options: {
  scales: {
    y: {
      beginAtZero: true
    }
  },
  indexAxis: 'y'
}
});

document.addEventListener('DOMContentLoaded', async () => {

  const data = await fetch('/api/productos/vendidos', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const dataJson = await data.json()

  grafica.data.labels = dataJson.map(p => p.nombre_producto);
  grafica.data.datasets[0].data = dataJson.map(p => p.ingresos);

  grafica.update();

})

const buscador = document.querySelector('.Tabla-Ventas table tbody');
const input = document.querySelector('#Search');

input.addEventListener('keyup', () => {
  const filter = input.value.toLowerCase();
  const rows = buscador.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    let match = false;

    cells.forEach(cell => {
      if (cell.textContent.toLowerCase().includes(filter)) {
        match = true;
      }
    });

    if (match) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});