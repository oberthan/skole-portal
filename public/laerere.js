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

  let userRole = '';

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
          row.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'svg' && e.target.tagName !== 'path') {
                window.location.href = `/laerer.html?id=${teacher.id}`;
            }
          });

            let actionsHtml = '';
            if (userRole === 'admin') {
                actionsHtml = `
                    <div class="relative">
                        <button class="menu-btn p-2 rounded-full hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        <div class="menu-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                            <button class="edit-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-id="${teacher.id}" data-navn="${teacher.navn}" data-initialer="${teacher.initialer}">Edit</button>
                            <button class="delete-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-id="${teacher.id}">Delete</button>
                        </div>
                    </div>
                `;
            }

          row.innerHTML = `
            <td class="p-4">${teacher.navn}</td>
            <td class="p-4">${teacher.initialer}</td>
            <td class="p-4">${actionsHtml}</td>
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
    userRole = user.rolle;
    if (userRole === 'admin') {
      addBtn.classList.remove("hidden");
    }
    loadLaerere();
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
      const res = await fetch('/api/laerere/add', {
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
    e.stopPropagation();
    if (e.target.classList.contains('menu-btn')) {
        const dropdown = e.target.nextElementSibling;
        dropdown.classList.toggle('hidden');
    }

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
});
