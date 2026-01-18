document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('fravaer-table-body');
  const addContainer = document.getElementById('add-fravaer-container');
  const addForm = document.getElementById('add-fravaer-form');
  const addFeedback = document.getElementById('add-fravaer-feedback');
  const elevSelect = addForm.elements.elev;
  const fagSelect = addForm.elements.fag;

  let elever = [];
  let fag = [];
  let userRole = '';

  const loadElever = async () => {
    try {
      const response = await fetch('/api/elever');
      if (!response.ok) throw new Error('Failed to fetch elever');
      elever = await response.json();
      elevSelect.innerHTML = elever.map(e => `<option value="${e.id}">${e.navn}</option>`).join('');
    } catch (error) {
      console.error('Error loading elever data:', error);
    }
  };

  const loadFag = async () => {
    try {
        const response = await fetch('/api/fag');
        if (!response.ok) throw new Error('Failed to fetch fag');
        fag = await response.json();
        fagSelect.innerHTML = fag.map(f => `<option value="${f.id}">${f.navn}</option>`).join('');
    } catch (error) {
        console.error('Error loading fag data:', error);
    }
  };

  const loadFravaer = async () => {
    try {
      const response = await fetch('/api/fravaer');
      if (!response.ok) throw new Error('Failed to fetch fravær');
      const fravaer = await response.json();

      tableBody.innerHTML = '';

      if (fravaer.length > 0) {
        fravaer.forEach(f => {
          const row = document.createElement('tr');
          row.className = 'border-b';

            let actionsHtml = '';
            if (userRole === 'admin' || userRole === 'staff') {
                actionsHtml = `<button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-id="${f.id}">Delete</button>`;
            }

          row.innerHTML = `
            <td class="p-4">${f.elever.navn}</td>
            <td class="p-4">${f.fag.navn}</td>
            <td class="p-4">${new Date(f.dato).toLocaleDateString()}</td>
            <td class="p-4">${f.til_stede ? 'Ja' : 'Nej'}</td>
            <td class="p-4">${actionsHtml}</td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">No attendance records found.</td></tr>';
      }
    } catch (error) {
      console.error('Error loading fravær data:', error);
      tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">Error loading data.</td></tr>';
    }
  };

  document.addEventListener('userLoaded', (e) => {
    userRole = user.rolle;
    if (userRole === 'admin' || userRole === 'staff') {
      addContainer.classList.remove("hidden");
    }
    loadFravaer();
  });

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addFeedback.textContent = 'Adding fravær...';

    const payload = {
        elev: addForm.elements.elev.value,
        fag: addForm.elements.fag.value,
        dato: addForm.elements.dato.value,
        til_stede: addForm.elements.til_stede.checked
    }

    try {
      const res = await fetch('/api/fravaer/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        addFeedback.textContent = `Error: ${data.error}`;
      } else {
        addFeedback.textContent = 'Fravær added successfully!';
        addForm.reset();
        setTimeout(() => {
          addFeedback.textContent = '';
        }, 2000)
        loadFravaer();
      }
    } catch (err) {
      addFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });

  tableBody.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target.classList.contains('delete-btn')) {
      const { id } = e.target.dataset;
      if (confirm('Are you sure you want to delete this attendance record?')) {
        fetch(`/api/fravaer/${id}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Failed to delete attendance record');
            loadFravaer();
          })
          .catch(err => console.error(err));
      }
    }
  });

  loadElever();
  loadFag();
});
