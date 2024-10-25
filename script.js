// Get references to DOM elements
const body = document.body;
// Sidebar Toggle Functionality
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const toggleDarkMode = document.getElementById('toggle-dark-mode');
const navLinks = document.querySelectorAll('.sidebar nav ul li a');

// Set default mode to dark mode on page load
body.classList.add('dark-mode');

// Update the dark mode toggle button text/icon
toggleDarkMode.textContent = 'Light Mode';



// Toggle sidebar visibility
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


// Close sidebar when a navigation link is clicked (on mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Dark Mode Toggle Functionality
toggleDarkMode.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        toggleDarkMode.textContent = 'Dark Mode';
    } else {
        body.classList.add('dark-mode');
        toggleDarkMode.textContent = 'Light Mode';
    }
});

// Smooth Scrolling for navigation links
navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
