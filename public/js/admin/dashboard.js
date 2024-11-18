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
  indexAxis: 'x'
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
/*
function actualizarHora() {
  const horaActual = new Date();
  const hora = horaActual.getHours();
  const minutos = horaActual.getMinutes();
  const segundos = horaActual.getSeconds();
  const horaFormateada = `${hora}:${minutos}:${segundos}`;
  document.querySelector('.Hora--avisos').textContent = horaFormateada;
}

setInterval(actualizarHora, 1000);
actualizarHora();*/

