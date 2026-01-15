document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch dashboard stats
    const statsResponse = await fetch('/api/dashboard-stats');
    if (!statsResponse.ok) throw new Error('Failed to fetch stats');
    const stats = await statsResponse.json();

    document.getElementById('elever-count').textContent = stats.elever ?? '0';
    document.getElementById('laerere-count').textContent = stats.laerere ?? '0';
    document.getElementById('klasser-count').textContent = stats.klasser ?? '0';
    document.getElementById('fag-count').textContent = stats.fag ?? '0';

    // Fetch today's schedule
    const scheduleResponse = await fetch('/api/todays-schedule');
    if (!scheduleResponse.ok) throw new Error('Failed to fetch schedule');
    const schedule = await scheduleResponse.json();
    const scheduleContainer = document.getElementById('schedule-container');
    scheduleContainer.innerHTML = '';
    if (schedule.length > 0) {
      schedule.forEach(item => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'flex items-center justify-between';
        scheduleItem.innerHTML = `
          <div>
            <p class="font-semibold">${item.fag.navn}</p>
            <p class="text-sm text-muted-foreground">${item.lærer.navn} • ${item.klasser.fag.navn}</p>
          </div>
          <p class="text-sm text-muted-foreground">${item.start} - ${item.slut}</p>
        `;
        scheduleContainer.appendChild(scheduleItem);
      });
    } else {
      scheduleContainer.innerHTML = '<p>No classes scheduled for today.</p>';
    }

    // Fetch recent students
    const recentStudentsResponse = await fetch('/api/recent-students');
    if (!recentStudentsResponse.ok) throw new Error('Failed to fetch recent students');
    const recentStudents = await recentStudentsResponse.json();
    const recentStudentsContainer = document.getElementById('recent-students-container');
    recentStudentsContainer.innerHTML = '';
    if (recentStudents.length > 0) {
      recentStudents.forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.className = 'flex items-center justify-between';
        studentItem.innerHTML = `
          <div class="flex items-center gap-4">
            <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <span class="flex h-full w-full items-center justify-center rounded-full bg-muted">${student.navn.charAt(0)}</span>
            </span>
            <div>
              <p class="font-semibold">${student.navn}</p>
              <p class="text-sm text-muted-foreground">${student.årgang}</p>
            </div>
          </div>
        `;
        //<p class="text-sm text-muted-foreground">${student.klasser.fag.navn}</p>
        recentStudentsContainer.appendChild(studentItem);
      });
    } else {
        recentStudentsContainer.innerHTML = '<p>No recent students found.</p>';
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // Optionally, display an error message to the user in the UI
  }
});
