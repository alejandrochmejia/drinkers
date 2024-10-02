const ctx = document.getElementById('myChart');

let etiq = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const grafica = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: etiq,
  datasets: [{
    label: 'Productos mas vendidos',
    data: data,
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

document.addEventListener('DOMContentLoaded', async () => {

  const data = await fetch('/admin/dashboard/ventas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const dataJson = await data.json()

  const inventario = await fetch('/admin/dashboard/inventario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const inventarioJson = await inventario.json()


  let productosVentas = dataJson.map(e => ({id: e.id_producto, ingresos: e.ingresos}));

  productosVentas.sort((a, b) => b.ingresos - a.ingresos);

  let top5ProductosVentas = productosVentas.slice(0, 5);

  let top5ProductosConNombres = top5ProductosVentas.map(pv => {
    let producto = inventarioJson.find(p => p.id == pv.id);
    return {
      nombre: producto ? producto.nombre_producto : 'Producto no encontrado',
      ingresos: pv.ingresos
    };
  });

  grafica.data.labels = top5ProductosConNombres.map(p => p.nombre);
  grafica.data.datasets[0].data = top5ProductosConNombres.map(p => p.ingresos);

  grafica.update();

})

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
