let minorista = document.getElementById('minorista');
let mayorista = document.getElementById('mayorista');

minorista.addEventListener('mouseover',()=>{
    mayorista.style = "color: #232326; background-color: #fff;"
})
minorista.addEventListener('mouseout',()=>{
    mayorista.style = "color:#FFFFFF; background-color: #001752"
})

const buscador = document.querySelector('#tbodyMayorista');
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