document.addEventListener('DOMContentLoaded', () => {
    const sidebarContainer = document.getElementById('sidebar-container');
    const headerContainer = document.getElementById('header-container');
    const pageTitle = document.getElementById('page-title');

    if (sidebarContainer) {
        fetch('/_sidebar.html')
            .then(response => response.text())
            .then(data => {
                sidebarContainer.innerHTML = data;
                updateActiveLink();
            });
    }

    if (headerContainer) {
        fetch('/_header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                updatePageTitle();
            });
    }

    function updateActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = sidebarContainer.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('bg-muted', 'text-primary');
                link.classList.remove('text-muted-foreground');
            } else {
                link.classList.remove('bg-muted', 'text-primary');
                link.classList.add('text-muted-foreground');
            }
        });
    }

    function updatePageTitle() {
        const titleElement = document.getElementById('page-title');
        if (titleElement) {
            const pageTitle = document.title.split(' - ')[0];
            titleElement.textContent = pageTitle;
        }
    }
});
