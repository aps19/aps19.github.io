const toggleDarkMode = document.getElementById('toggle-dark-mode');
const body = document.body;

// Toggle sidebar visibility on mobile
document.getElementById('sidebar-toggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
});

// Set default mode to dark mode on page load
body.classList.add('dark-mode');

// Dark Mode Toggle Functionality
toggleDarkMode.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggleDarkMode.textContent = 'Dark Mode';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggleDarkMode.textContent = 'Light Mode';
    }
});

// Smooth Scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
