document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/elever');
    if (!response.ok) throw new Error('Failed to fetch elever');
    const elever = await response.json();

    const tableBody = document.getElementById('elever-table-body');
    tableBody.innerHTML = '';

    if (elever.length > 0) {
      elever.forEach(student => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        row.innerHTML = `
          <td class="p-4">${student.navn}</td>
          <td class="p-4">${student.email}</td>
          <td class="p-4">${student.klasser.navn}</td>
        `;
        tableBody.appendChild(row);
      });
    } else {
      tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No students found.</td></tr>';
    }
  } catch (error) {
    console.error('Error loading elever data:', error);
    const tableBody = document.getElementById('elever-table-body');
    tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">Error loading data.</td></tr>';
  }
});
