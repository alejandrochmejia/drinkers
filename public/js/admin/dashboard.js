
let inventario = []
let ventas = []

async function actualizarVentas() {
  const response = await fetch('/admin/dashboard/ventas');
  const inventarioResponse = await fetch('/admin/dashboard/inventario');
  const data = await response.json();
  const inventarioData = await inventarioResponse.json();
  console.log(data);
  console.log(inventarioData);
  inventario = inventarioData
  ventas = data
}

actualizarVentas()

console.log(inventario)
console.log(ventas)

const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5'],
      datasets: [{
        label: 'Productos mas vendidos',
        data: [12, 19, 3, 5, 2],
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
