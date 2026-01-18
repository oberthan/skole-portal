document.addEventListener('DOMContentLoaded', async () => {
  try {
    const profileResponse = await fetch('/api/getProfile');
    if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
    const profile = await profileResponse.json();

    document.getElementById('user-avatar').src = profile.avatar;
    document.getElementById('user-name').textContent = profile.navn;
    document.getElementById('user-role').textContent = profile.rolle;

    const classesResponse = await fetch('/api/user-classes');
    if (!classesResponse.ok) throw new Error('Failed to fetch user classes');
    const classes = await classesResponse.json();
    const classesContainer = document.getElementById('classes-container');
    classesContainer.innerHTML = '';

    if (classes.length > 0) {
      classes.forEach(cls => {
        const classElement = document.createElement('div');
        classElement.className = 'flex items-center justify-between';
        classElement.innerHTML = `
          <div>
            <p class="font-semibold">${cls.klasser.fag}</p>
            <p class="text-sm text-muted-foreground">Teacher: ${cls.klasser.lærer.navn}</p>
          </div>
        `;
        classesContainer.appendChild(classElement);
      });
    } else {
      classesContainer.innerHTML = '<p>No classes found.</p>';
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
  }
});
