document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('elever-table-body');
  const addBtn = document.getElementById('add-elev-btn');
  const addModal = document.getElementById('add-elev-modal');
  const closeAddBtn = document.getElementById('close-add-modal');
  const addForm = document.getElementById('add-elev-form');
  const addFeedback = document.getElementById('add-elev-feedback');

  const editModal = document.getElementById('edit-elev-modal');
  const closeEditBtn = document.getElementById('close-edit-modal');
  const editForm = document.getElementById('edit-elev-form');
  const editFeedback = document.getElementById('edit-elev-feedback');

  let userRole = '';

  const loadElever = async () => {
    try {
      const response = await fetch('/api/elever');
      if (!response.ok) throw new Error('Failed to fetch elever');
      const elever = await response.json();

      tableBody.innerHTML = '';

      if (elever.length > 0) {
        elever.forEach(student => {
          const row = document.createElement('tr');
          row.className = 'border-b cursor-pointer hover:bg-gray-100';
          row.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'svg' && e.target.tagName !== 'path') {
                window.location.href = `/elev.html?id=${student.id}`;
            }
          });

          let actionsHtml = '';
            if (userRole === 'admin' || userRole === 'staff') {
                actionsHtml = `
                    <div class="relative">
                        <button class="menu-btn p-2 rounded-full hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                        </button>
                        <div class="menu-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                            <button class="edit-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-id="${student.id}" data-navn="${student.navn}" data-aargang="${student.årgang}">Edit</button>
                            <button class="delete-btn block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" data-id="${student.id}">Delete</button>
                        </div>
                    </div>
                `;
            }

          row.innerHTML = `
            <td class="p-4">${student.navn}</td>
            <td class="p-4">${student.årgang}</td>
            <td class="p-4">${actionsHtml}</td>
          `;
          tableBody.appendChild(row);
        });
      } else {
        tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No students found.</td></tr>';
      }
    } catch (error) {
      console.error('Error loading elever data:', error);
      tableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">Error loading data.</td></tr>';
    }
  };

  document.addEventListener('userLoaded', (e) => {
    userRole = e.detail.rolle;
    if (userRole === 'admin' || userRole === 'staff') {
      addBtn.classList.remove("hidden");
    }
    loadElever();
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
    addFeedback.textContent = 'Adding elev...';

    const payload = Object.fromEntries(new FormData(addForm).entries());

    try {
      const res = await fetch('/api/elever/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        addFeedback.textContent = `Error: ${data.error}`;
      } else {
        addFeedback.innerHTML = `Elev "${data.elev.navn}" created!<br>They can log in with the username: "${data.email.split("@")[0]}"<br>and the password: "${data.password}"`;
        addForm.reset();
        setTimeout(() => {
          addModal.classList.add('hidden');
          addModal.classList.remove('flex');
          addFeedback.textContent = '';
        }, 2000)
        loadElever();
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
      const { id, navn, aargang } = e.target.dataset;
      editForm.elements.id.value = id;
      editForm.elements.navn.value = navn;
      editForm.elements.aargang.value = aargang;
      editModal.classList.remove('hidden');
      editModal.classList.add('flex');
    }

    if (e.target.classList.contains('delete-btn')) {
      const { id } = e.target.dataset;
      if (confirm('Are you sure you want to delete this student?')) {
        fetch(`/api/elever/${id}`, { method: 'DELETE' })
          .then(res => {
            if (!res.ok) throw new Error('Failed to delete student');
            loadElever();
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
    editFeedback.textContent = 'Updating elev...';

    const payload = {
        navn: editForm.elements.navn.value,
        årgang: editForm.elements.aargang.value
    };
    const id = editForm.elements.id.value;

    try {
      const res = await fetch(`/api/elever/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        editFeedback.textContent = `Error: ${data.error}`;
      } else {
        editFeedback.textContent = 'Elev updated successfully!';
        editForm.reset();
        setTimeout(() => {
            editModal.classList.add('hidden');
            editModal.classList.remove('flex');
            editFeedback.textContent = '';
        }, 2000);
        loadElever();
      }
    } catch (err) {
      editFeedback.textContent = `Unexpected error: ${err.message}`;
    }
  });
});
