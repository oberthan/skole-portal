document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const elevId = urlParams.get('id');

    if (!elevId) {
        window.location.href = '/elever.html';
        return;
    }

    const elevNavn = document.getElementById('elev-navn');
    const elevAargang = document.getElementById('elev-aargang');
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const gradesTableBody = document.getElementById('grades-table-body');
    const attendanceTableBody = document.getElementById('attendance-table-body');

    try {
        const response = await fetch(`/api/elever/${elevId}/details`);
        if (!response.ok) throw new Error('Failed to fetch elev details');
        const data = await response.json();

        elevNavn.textContent = data.elev.navn;
        elevAargang.textContent = data.elev.årgang;

        // Populate schedule
        scheduleTableBody.innerHTML = '';
        if (data.schedule.length > 0) {
            data.schedule.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${item.klasser.fag}</td>
                    <td class="p-4">${item.klasser.lærere.navn}</td>
                    <td class="p-4">${new Date(item.start).toLocaleString()}</td>
                    <td class="p-4">${new Date(item.slut).toLocaleString()}</td>
                `;
                scheduleTableBody.appendChild(row);
            });
        } else {
            scheduleTableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No schedule found.</td></tr>';
        }

        // Populate grades
        gradesTableBody.innerHTML = '';
        if (data.grades.length > 0) {
            data.grades.forEach(grade => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${grade.fag.navn}</td>
                    <td class="p-4">${grade.karakter}</td>
                `;
                gradesTableBody.appendChild(row);
            });
        } else {
            gradesTableBody.innerHTML = '<tr><td colspan="2" class="p-4 text-center">No grades found.</td></tr>';
        }

        // Populate attendance
        attendanceTableBody.innerHTML = '';
        if (data.attendance.length > 0) {
            data.attendance.forEach(att => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${att.fag.navn}</td>
                    <td class="p-4">${new Date(att.dato).toLocaleDateString()}</td>
                    <td class="p-4">${att.til_stede ? 'Ja' : 'Nej'}</td>
                `;
                attendanceTableBody.appendChild(row);
            });
        } else {
            attendanceTableBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center">No attendance records found.</td></tr>';
        }

    } catch (error) {
        console.error('Error loading elev details:', error);
    }
});
