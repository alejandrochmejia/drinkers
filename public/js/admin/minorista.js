let minorista = document.getElementById('Minorista');
let mayorista = document.getElementById('Mayorista');

mayorista.addEventListener('mouseover',()=>{
    minorista.style = "color: #232326; background-color: #fff;";
})
mayorista.addEventListener('mouseout',()=>{
    minorista.style = "color:#FFFFFF; background-color: #001752"
})

const buscador = document.querySelector('#tbodyMinorista');
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