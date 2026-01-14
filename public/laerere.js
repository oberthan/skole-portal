document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/laerere');
    if (!response.ok) throw new Error('Failed to fetch laerere');
    const laerere = await response.json();

    const tableBody = document.getElementById('laerere-table-body');
    tableBody.innerHTML = '';

    if (laerere.length > 0) {
      laerere.forEach(teacher => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
          <td class="p-4">${teacher.navn}</td>
          <td class="p-4">${teacher.email}</td>
          <td class="p-4">${teacher.telefon || 'N/A'}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No teachers found.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading laerere data:', error);
    const tableBody = document.getElementById('laerere-table-body');
    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">Error loading data.</td></tr>';
  }
});
