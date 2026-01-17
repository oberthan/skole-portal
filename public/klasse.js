document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const klasseId = urlParams.get('id');

    if (!klasseId) {
        window.location.href = '/klasser.html';
        return;
    }

    const klasseFag = document.getElementById('klasse-fag');
    const klasseLaerer = document.getElementById('klasse-laerer');
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const studentsTableBody = document.getElementById('students-table-body');

    try {
        const response = await fetch(`/api/klasser/${klasseId}/details`);
        if (!response.ok) throw new Error('Failed to fetch klasse details');
        const data = await response.json();

        klasseFag.textContent = data.klasse.fag;
        klasseLaerer.textContent = data.klasse.lærere.navn;

        // Populate schedule
        scheduleTableBody.innerHTML = '';
        if (data.schedule.length > 0) {
            data.schedule.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${new Date(item.start).toLocaleString()}</td>
                    <td class="p-4">${new Date(item.slut).toLocaleString()}</td>
                    <td class="p-4">${item.lokale.id}</td>
                `;
                scheduleTableBody.appendChild(row);
            });
        } else {
            scheduleTableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No schedule found.</td></tr>';
        }

        // Populate students
        studentsTableBody.innerHTML = '';
        if (data.students.length > 0) {
            data.students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${student.elever.navn}</td>
                    <td class="p-4">${student.elever.årgang}</td>
                `;
                studentsTableBody.appendChild(row);
            });
        } else {
            studentsTableBody.innerHTML = '<tr><td colspan="2" class="p-4 text-center">No students found.</td></tr>';
        }

    } catch (error) {
        console.error('Error loading klasse details:', error);
    }
});
