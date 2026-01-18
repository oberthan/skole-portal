document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/lokaler');
    if (!response.ok) throw new Error('Failed to fetch lokaler');
    const lokaler = await response.json();

    const list = document.getElementById('lokaler-list');
    list.innerHTML = '';

    if (lokaler.length > 0) {
      lokaler.forEach(lokale => {
        const listItem = document.createElement('li');
        listItem.className = 'p-2 border-b';
        listItem.textContent = lokale.id;
        list.appendChild(listItem);
      });
    } else {
      list.innerHTML = '<li>No locations found.</li>';
    }
  } catch (error) {
    console.error('Error loading lokaler data:', error);
    const list = document.getElementById('lokaler-list');
    list.innerHTML = '<li>Error loading data.</li>';
  }
});
