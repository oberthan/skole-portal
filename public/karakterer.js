document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('karakterer-table-body');
  const addContainer = document.getElementById('add-karakter-container');
  const addForm = document.getElementById('add-karakter-form');
  const addFeedback = document.getElementById('add-karakter-feedback');
  const elevSelect = addForm.elements.elev;
  const fagSelect = addForm.elements.fag;

  let elever = [];
  let fag = [];

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

  const loadKarakterer = async () => {
    try {
      const response = await fetch('/api/karakterer');
      if (!response.ok) throw new Error('Failed to fetch karakterer');
      const karakterer = await response.json();

      tableBody.innerHTML = '';

      if (karakterer.length > 0) {
        karakterer.forEach(karakter => {
          const row = document.createElement('tr');
          row.className = 'border-b';
          row.innerHTML = `
            <td class="p-4">${karakter.elever.navn}</td>
            <td class="p-4">${karakter.fag.navn}</td>
            <td class="p-4">${karakter.karakter}</td>
            <td class="p-4">
              <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-id="${karakter.id}">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No grades found.</td></tr>';
      }
    } catch (error) {
      console.error('Error loading karakterer data:', error);
      tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Error loading data.</td></tr>';
    }
  };

  document.addEventListener('userLoaded', (e) => {
    if (user.rolle === 'admin' || user.rolle === 'staff') {
      addContainer.classList.remove("hidden");
    }
    if(user.rolle === 'student'){
        // Logic to only show own grades
    }
  });

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addFeedback.textContent = 'Adding karakter...';

    const payload = Object.fromEntries(new FormData(addForm).entries());

    try {
      const res = await fetch('/api/addKarakter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        addFeedback.textContent = `Error: ${data.error}`;
      } else {
        addFeedback.textContent = 'Karakter added successfully!';
        addForm.reset();
        setTimeout(() => {
          addFeedback.textContent = '';
        }, 2000)
        loadKarakterer();
      }
    } catch (err) {
      addFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });

  tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const { id } = e.target.dataset;
      if (confirm('Are you sure you want to delete this grade?')) {
        fetch(`/api/karakterer/${id}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Failed to delete grade');
            loadKarakterer();
          })
          .catch(err => console.error(err));
      }
    }
  });

  loadElever();
  loadFag();
  loadKarakterer();
});
