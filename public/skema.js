document.addEventListener('DOMContentLoaded', async () => {
  const weekDays = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

  try {
    const response = await fetch('/api/skema');
    if (!response.ok) throw new Error('Failed to fetch skema');
    const skema = await response.json();

    const tableBody = document.getElementById('skema-table-body');
    tableBody.innerHTML = '';

    if (skema.length > 0) {
      skema.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
          <td class="p-4">${weekDays[item.ugedag]}</td>
          <td class="p-4">${item.start_tid} - ${item.slut_tid}</td>
          <td class="p-4">${item.fag.navn}</td>
          <td class="p-4">${item.klasser.navn}</td>
          <td class="p-4">${item.lærere.navn}</td>
          <td class="p-4">${item.lokale ? item.lokale.navn : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center">No schedule found.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading skema data:', error);
    const tableBody = document.getElementById('skema-table-body');
    tableBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center">Error loading data.</td></tr>';
  }
});
