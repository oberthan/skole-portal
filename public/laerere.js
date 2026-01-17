document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('laerere-table-body');
  const addBtn = document.getElementById('add-laerer-btn');
  const addModal = document.getElementById('add-laerer-modal');
  const closeAddBtn = document.getElementById('close-add-modal');
  const addForm = document.getElementById('add-laerer-form');
  const addFeedback = document.getElementById('add-laerer-feedback');

  const editModal = document.getElementById('edit-laerer-modal');
  const closeEditBtn = document.getElementById('close-edit-modal');
  const editForm = document.getElementById('edit-laerer-form');
  const editFeedback = document.getElementById('edit-laerer-feedback');

  const loadLaerere = async () => {
    try {
      const response = await fetch('/api/laerere');
      if (!response.ok) throw new Error('Failed to fetch laerere');
      const laerere = await response.json();

      tableBody.innerHTML = '';

      if (laerere.length > 0) {
        laerere.forEach(teacher => {
          const row = document.createElement('tr');
          row.className = 'border-b cursor-pointer hover:bg-gray-100';
          row.addEventListener('click', () => {
            window.location.href = `/laerer.html?id=${teacher.id}`;
          });
          row.innerHTML = `
            <td class="p-4">${teacher.navn}</td>
            <td class="p-4">${teacher.initialer}</td>
            <td class="p-4">
              <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" data-id="${teacher.id}" data-navn="${teacher.navn}" data-initialer="${teacher.initialer}">Edit</button>
              <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-id="${teacher.id}">Delete</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No teachers found.</td></tr>';
      }
    } catch (error) {
      console.error('Error loading laerere data:', error);
      tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">Error loading data.</td></tr>';
    }
  };

  document.addEventListener('userLoaded', (e) => {
    if (user.rolle === 'admin') {
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
    addFeedback.textContent = 'Adding lærer...';

    const payload = Object.fromEntries(new FormData(addForm).entries());

    try {
      const res = await fetch('/api/addLaerer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        addFeedback.textContent = `Error: ${data.error}`;
      } else {
        addFeedback.textContent = 'Lærer created successfully!';
        addForm.reset();
        setTimeout(() => {
          addModal.classList.add('hidden');
          addModal.classList.remove('flex');
          addFeedback.textContent = '';
        }, 2000)
        loadLaerere();
      }
    } catch (err) {
      addFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });

  tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      const { id, navn, initialer } = e.target.dataset;
      editForm.elements.id.value = id;
      editForm.elements.navn.value = navn;
      editForm.elements.initialer.value = initialer;
      editModal.classList.remove('hidden');
      editModal.classList.add('flex');
    }

    if (e.target.classList.contains('delete-btn')) {
      const { id } = e.target.dataset;
      if (confirm('Are you sure you want to delete this teacher?')) {
        fetch(`/api/laerere/${id}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Failed to delete teacher');
            loadLaerere();
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
    editFeedback.textContent = 'Updating lærer...';

    const payload = {
        navn: editForm.elements.navn.value,
        initialer: editForm.elements.initialer.value
    };
    const id = editForm.elements.id.value;

    try {
      const res = await fetch(`/api/laerere/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        editFeedback.textContent = `Error: ${data.error}`;
      } else {
        editFeedback.textContent = 'Lærer updated successfully!';
        editForm.reset();
        setTimeout(() => {
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
            editFeedback.textContent = '';
        }, 2000);
        loadLaerere();
      }
    } catch (err) {
      editFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });


  loadLaerere();
});
