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
          row.addEventListener('click', () => {
            window.location.href = `/elev.html?id=${student.id}`;
          });
          row.innerHTML = `
            <td class="p-4">${student.navn}</td>
            <td class="p-4">${student.årgang}</td>
            <td class="p-4">
              <button class="edit-btn bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" data-id="${student.id}" data-navn="${student.navn}" data-aargang="${student.årgang}">Edit</button>
              <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" data-id="${student.id}">Delete</button>
            </td>
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
    addFeedback.textContent = 'Adding elev...';

    const payload = Object.fromEntries(new FormData(addForm).entries());

    try {
      const res = await fetch('/api/addElev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        addFeedback.textContent = `Error: ${data.error}`;
      } else {
        addFeedback.innerHTML = `Elev "${data.elev.navn}" created!`;
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


  loadElever();
});
