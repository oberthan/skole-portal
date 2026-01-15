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
          <td class="p-4">${student.årgang}</td>
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

  const addBtn = document.getElementById('add-elev-btn');
  const modal = document.getElementById('add-elev-modal');
  const closeBtn = document.getElementById('close-elev-modal');
  const form = document.getElementById('add-elev-form');
  const feedback = document.getElementById('elev-feedback');

  // Open modal
  addBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });

  // Close modal
  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    feedback.textContent = '';
    form.reset();
  });

  // Close modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      feedback.textContent = '';
      form.reset();
    }
  });

  // Submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.textContent = 'Adding elev...';


    const payload = Object.fromEntries(new FormData(form).entries());
    console.log(payload);
    try {
      const res = await fetch('/api/addElev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        feedback.textContent = `Error: ${data.error}`;
      } else {
        feedback.textContent = `Elev "${data.elev.navn}" created!`;
        form.reset();
        //loadElever(); // reload table
      }
    } catch (err) {
      feedback.textContent = `Unexpected error: ${err.message}`;
    }
  });

});
