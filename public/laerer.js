document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const laererId = urlParams.get('id');

    if (!laererId) {
        window.location.href = '/laerere.html';
        return;
    }

    const laererNavn = document.getElementById('laerer-navn');
    const laererInitialer = document.getElementById('laerer-initialer');
    const scheduleTableBody = document.getElementById('schedule-table-body');
    const classesTableBody = document.getElementById('classes-table-body');

    try {
        const response = await fetch(`/api/laerere/${laererId}/details`);
        if (!response.ok) throw new Error('Failed to fetch laerer details');
        const data = await response.json();

        laererNavn.textContent = data.laerer.navn;
        laererInitialer.textContent = data.laerer.initialer;

        // Populate schedule
        scheduleTableBody.innerHTML = '';
        if (data.schedule.length > 0) {
            data.schedule.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${item.klasser.fag}</td>
                    <td class="p-4">${item.klasser.id}</td>
                    <td class="p-4">${new Date(item.start).toLocaleString()}</td>
                    <td class="p-4">${new Date(item.slut).toLocaleString()}</td>
                `;
                scheduleTableBody.appendChild(row);
            });
        } else {
            scheduleTableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No schedule found.</td></tr>';
        }

        // Populate classes
        classesTableBody.innerHTML = '';
        if (data.classes.length > 0) {
            data.classes.forEach(cls => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${cls.fag}</td>
                `;
                classesTableBody.appendChild(row);
            });
        } else {
            classesTableBody.innerHTML = '<tr><td colspan="1" class="p-4 text-center">No classes found.</td></tr>';
        }

    } catch (error) {
        console.error('Error loading laerer details:', error);
    }
});
