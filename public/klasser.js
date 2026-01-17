document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('klasser-table-body');
  const addBtn = document.getElementById('add-klasse-btn');
  const addModal = document.getElementById('add-klasse-modal');
  const closeAddBtn = document.getElementById('close-add-modal');
  const addForm = document.getElementById('add-klasse-form');
  const addFeedback = document.getElementById('add-klasse-feedback');
  const addLaererSelect = addForm.elements.laerer;

  const editModal = document.getElementById('edit-klasse-modal');
  const closeEditBtn = document.getElementById('close-edit-modal');
  const editForm = document.getElementById('edit-klasse-form');
  const editFeedback = document.getElementById('edit-klasse-feedback');
  const editLaererSelect = editForm.elements.laerer;

  let laerere = [];

  const loadLaerere = async () => {
    try {
      const response = await fetch('/api/laerere');
      if (!response.ok) throw new Error('Failed to fetch laerere');
      laerere = await response.json();

      addLaererSelect.innerHTML = laerere.map(l => `<option value="${l.id}">${l.navn}</option>`).join('');
      editLaererSelect.innerHTML = laerere.map(l => `<option value="${l.id}">${l.navn}</option>`).join('');

    } catch (error) {
      console.error('Error loading laerere data:', error);
    }
  };

  const loadKlasser = async () => {
    try {
      const response = await fetch('/api/klasser');
      if (!response.ok) throw new Error('Failed to fetch klasser');
      const klasser = await response.json();

      tableBody.innerHTML = '';

      if (klasser.length > 0) {
        klasser.forEach(klasse => {
          const row = document.createElement('tr');
          row.className = 'border-b cursor-pointer hover:bg-gray-100';
          row.addEventListener('click', () => {
            window.location.href = `/klasse.html?id=${klasse.id}`;
          });
          row.innerHTML = `
            <td class="p-4">${klasse.fag}</td>
            <td class="p-4">${klasse.lærer.navn}</td>
            <td class="p-4">
              <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" data-id="${klasse.id}" data-fag="${klasse.fag}" data-laerer="${klasse.lærer.id}">Edit</button>
              <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-id="${klasse.id}">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No classes found.</td></tr>';
      }
    } catch (error) {
      console.error('Error loading klasser data:', error);
      tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">Error loading data.</td></tr>';
    }
  };

  document.addEventListener('userLoaded', (e) => {
    if (user.rolle === 'admin' || user.rolle === 'staff') {
      addBtn.classList.remove("hidden");
    }
  });

  addBtn.addEventListener('click', () => {
    addModal.classList.remove('hidden');
    addModal.classList.add('flex');
  });

  closeAddBtn.addEventListener('click', () => {
    addModal.classList.add('hidden');
    addModal.classList.remove('flex');
    addFeedback.textContent = '';
    addForm.reset();
  });

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addFeedback.textContent = 'Adding klasse...';

    const payload = Object.fromEntries(new FormData(addForm).entries());

    try {
      const res = await fetch('/api/addKlasse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        addFeedback.textContent = `Error: ${data.error}`;
      } else {
        addFeedback.textContent = 'Klasse created successfully!';
        addForm.reset();
        setTimeout(() => {
          addModal.classList.add('hidden');
          addModal.classList.remove('flex');
          addFeedback.textContent = '';
        }, 2000)
        loadKlasser();
      }
    } catch (err) {
      addFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });

  tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const { id, fag, laerer } = e.target.dataset;
      editForm.elements.id.value = id;
      editForm.elements.fag.value = fag;
      editForm.elements.laerer.value = laerer;
      editModal.classList.remove('hidden');
      editModal.classList.add('flex');
    }

    if (e.target.classList.contains('delete-btn')) {
      const { id } = e.target.dataset;
      if (confirm('Are you sure you want to delete this class?')) {
        fetch(`/api/klasser/${id}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Failed to delete class');
            loadKlasser();
          })
          .catch(err => console.error(err));
      }
    }
  });

  closeEditBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
    editModal.classList.remove('flex');
    editFeedback.textContent = '';
    editForm.reset();
  });

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    editFeedback.textContent = 'Updating klasse...';

    const payload = {
        fag: editForm.elements.fag.value,
        lærer: editForm.elements.laerer.value
    };
    const id = editForm.elements.id.value;

    try {
      const res = await fetch(`/api/klasser/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        editFeedback.textContent = `Error: ${data.error}`;
      } else {
        editFeedback.textContent = 'Klasse updated successfully!';
        editForm.reset();
        setTimeout(() => {
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
            editFeedback.textContent = '';
        }, 2000);
        loadKlasser();
      }
    } catch (err) {
      editFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });

  loadLaerere();
  loadKlasser();
});
