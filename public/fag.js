document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/fag');
    if (!response.ok) throw new Error('Failed to fetch fag');
    const fag = await response.json();

    const tableBody = document.getElementById('fag-table-body');
    tableBody.innerHTML = '';

    if (fag.length > 0) {
      fag.forEach(subject => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
          <td class="p-4">${subject.navn}</td>
          <td class="p-4">${subject.lærere ? subject.lærere.navn : 'N/A'}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="2" class="p-4 text-center">No subjects found.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading fag data:', error);
    const tableBody = document.getElementById('fag-table-body');
    tableBody.innerHTML = '<tr><td colspan="2" class="p-4 text-center">Error loading data.</td></tr>';
  }
});
