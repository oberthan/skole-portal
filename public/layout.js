let user;
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
                loadUserProfile();
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
    async function loadUserProfile() {
        try {
            const res = await fetch('/api/getProfile');
            if (!res.ok) return;

            user = await res.json();
            const nameEl = document.getElementById('user-name');
            const roleEl = document.getElementById('user-role');
            const avatarEl = document.getElementById('user-avatar');

            let colors = {
                'elev': '#00d800',
                'laerer': '#0000ff',
                'admin': '#ff0000',
            }

            if (nameEl) nameEl.textContent = user.navn;
            if (roleEl){
                roleEl.textContent = user.rolle.toUpperCase();
                roleEl.style.color = colors[user.rolle];
                roleEl.style.border = `1px solid ${colors[user.rolle]}`;
            }
            if (avatarEl) {
                avatarEl.src = user.avatar;
                avatarEl.alt = user.navn;
            }

            const event = new CustomEvent('userLoaded');
            document.dispatchEvent(event);

            if (user.rolle === 'admin') {
                //document.getElementById('add-elev-btn').classList.remove("hidden");
                //document.getElementById('add-laerere-btn').style.display = 'inline-block';
                //document.getElementById('add-lokaler-btn').style.display = 'inline-block';
                //document.getElementById('add-fag-btn').style.display = 'inline-block';
            }

            if (['admin', 'laerer'].includes(user.rolle)) {
                //document.getElementById('add-klasser-btn').style.display = 'inline-block';
                //document.getElementById('add-skema-btn').style.display = 'inline-block';
                //document.getElementById('add-karakter-btn').style.display = 'inline-block';
                //document.getElementById('add-klasse-elever-btn').style.display = 'inline-block';
            }
        } catch (err) {
            console.error('Error loading profile:', err);
        }
    }
});
