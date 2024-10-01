const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5'],
      datasets: [{
        label: 'Productos mas vendidos',
        data: [1, 2, 3, 4, 5],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


function actualizarHora() {
  const horaActual = new Date();
  const hora = horaActual.getHours();
  const minutos = horaActual.getMinutes();
  const segundos = horaActual.getSeconds();
  const horaFormateada = `${hora}:${minutos}:${segundos}`;
  document.querySelector('.Hora--avisos').textContent = horaFormateada;
}

setInterval(actualizarHora, 1000);
actualizarHora();
