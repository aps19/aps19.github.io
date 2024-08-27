const toggleDarkMode = document.getElementById('toggle-dark-mode');
const body = document.body;

// Set default to dark mode
body.classList.add('dark-mode');

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

// Smooth Scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
