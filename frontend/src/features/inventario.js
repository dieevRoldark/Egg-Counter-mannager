const mockData = {
  primeras: [
    { tamaño: 'B', cantidad: 100, fecha: '2023-10-01', hora: '08:00' },
    { tamaño: 'A', cantidad: 150, fecha: '2023-10-01', hora: '08:00' },
    { tamaño: 'AA', cantidad: 200, fecha: '2023-10-01', hora: '08:00' },
    { tamaño: 'AAA', cantidad: 250, fecha: '2023-10-01', hora: '08:00' }
  ],
  segundas: [
    { tamaño: 'B', cantidad: 80, fecha: '2023-10-02', hora: '09:00' },
    { tamaño: 'A', cantidad: 120, fecha: '2023-10-02', hora: '09:00' },
    { tamaño: 'AA', cantidad: 180, fecha: '2023-10-02', hora: '09:00' },
    { tamaño: 'AAA', cantidad: 220, fecha: '2023-10-02', hora: '09:00' }
  ],
  terceras: [
    { tamaño: 'B', cantidad: 60, fecha: '2023-10-03', hora: '10:00' },
    { tamaño: 'A', cantidad: 100, fecha: '2023-10-03', hora: '10:00' },
    { tamaño: 'AA', cantidad: 160, fecha: '2023-10-03', hora: '10:00' },
    { tamaño: 'AAA', cantidad: 200, fecha: '2023-10-03', hora: '10:00' }
  ]
};

function renderTable(data) {
  const container = document.getElementById('inventory-table-container');
  const total = data.reduce((sum, row) => sum + row.cantidad, 0);

  const rowsHtml = data.map(row => `
    <tr>
      <td>${row.tamaño}</td>
      <td>${row.cantidad}</td>
      <td>${row.fecha}</td>
      <td>${row.hora}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <p>Información de las ${container.dataset.galpon || 'Primeras'}</p>
    <table class="inventory__table">
      <caption>Distribución de inventario</caption>
      <thead>
        <tr>
          <th>Tamaño</th>
          <th>Cantidad</th>
          <th>Fecha</th>
          <th>Hora</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" colspan="2">Total</th>
          <td>${total}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  `;
}

function updateSummary(data) {
  const totals = { B: 0, A: 0, AA: 0, AAA: 0 };
  data.forEach(row => {
    if (totals.hasOwnProperty(row.tamaño)) {
      totals[row.tamaño] += row.cantidad;
    }
  });

  document.getElementById('inventory-results').innerHTML = `
    <li>B: ${totals.B}</li>
    <li>A: ${totals.A}</li>
    <li>AA: ${totals.AA}</li>
    <li>AAA: ${totals.AAA}</li>
  `;
}

function loadGalpon(galponKey) {
  const data = mockData[galponKey] || [];
  const container = document.getElementById('inventory-table-container');
  container.dataset.galpon = galponKey;
  renderTable(data);
  updateSummary(data);
}

export function init() {
  const select = document.getElementById('galpon-select');
  if (!select) return;

  select.addEventListener('change', (e) => {
    loadGalpon(e.target.value);
  });

  loadGalpon(select.value);
}