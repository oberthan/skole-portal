document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/klasser');
    if (!response.ok) throw new Error('Failed to fetch klasser');
    const klasser = await response.json();

    const tableBody = document.getElementById('klasser-table-body');
    tableBody.innerHTML = '';

    if (klasser.length > 0) {
      klasser.forEach(klasse => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
          <td class="p-4">${klasse.navn}</td>
          <td class="p-4">${klasse.lærere ? klasse.lærere.navn : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="2" class="p-4 text-center">No classes found.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading klasser data:', error);
    const tableBody = document.getElementById('klasser-table-body');
    tableBody.innerHTML = '<tr><td colspan="2" class="p-4 text-center">Error loading data.</td></tr>';
  }
});
