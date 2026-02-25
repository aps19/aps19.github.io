// Get references to DOM elements
const body = document.body;
// Sidebar Toggle Functionality
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const toggleDarkMode = document.getElementById('toggle-dark-mode');
const navLinks = document.querySelectorAll('.sidebar nav ul li a');

// Update copyright year dynamically
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// Back to Top Button functionality
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    // Show button when user scrolls down 300px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
        
        // Active nav link highlighting
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Set default mode to dark mode on page load (if toggle exists)
if (toggleDarkMode) {
    body.classList.add('dark-mode');
    // Update the dark mode toggle button text/icon
    toggleDarkMode.textContent = 'Light Mode';
}



// Toggle sidebar visibility
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when a navigation link is clicked (on mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

// Dark Mode Toggle Functionality
if (toggleDarkMode) {
    toggleDarkMode.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            toggleDarkMode.textContent = 'Dark Mode';
        } else {
            body.classList.add('dark-mode');
            toggleDarkMode.textContent = 'Light Mode';
        }
    });
}

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

// Parse BibTeX entry and extract fields
function parseBibtex(bibtex) {
    const result = {};
    
    // Extract entry type and key
    const headerMatch = bibtex.match(/@(\w+)\s*\{\s*([^,]+),/);
    if (headerMatch) {
        result.type = headerMatch[1];
        result.key = headerMatch[2].trim();
    }
    
    // Extract fields - handles multi-line values with "and" separators
    const fieldRegex = /(\w+)\s*=\s*["\{]([\s\S]*?)(?:["\}]\s*(?:,|\}))/g;
    let match;
    
    // Normalize the bibtex for easier parsing
    const normalized = bibtex.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    while ((match = fieldRegex.exec(normalized)) !== null) {
        const key = match[1].toLowerCase();
        let value = match[2].trim();
        result[key] = value;
    }
    
    // Parse authors - handle "and" separated format
    if (result.author) {
        const authors = result.author.split(/\s+and\s+/).map(a => {
            // Convert "Last, First" to "F. Last" format
            const parts = a.trim().split(',').map(p => p.trim());
            if (parts.length === 2) {
                const initials = parts[1].split(' ').map(n => n[0] + '.').join('');
                return initials + ' ' + parts[0];
            }
            return a.trim();
        });
        result.authorsFormatted = authors.join(', ');
    }
    
    // Generate DOI URL from key if it looks like a DOI
    if (result.key && result.key.includes('/')) {
        result.doi = result.key;
        result.url = 'https://doi.org/' + result.key;
    } else if (result.doi) {
        result.url = 'https://doi.org/' + result.doi;
    }
    
    // Format venue
    const venue = [];
    if (result.booktitle) venue.push(result.booktitle);
    else if (result.journal) venue.push(result.journal);
    if (result.year) venue.push('(' + result.year + ')');
    if (result.publisher) venue.push(result.publisher);
    if (result.pages) venue.push('pp. ' + result.pages.replace('--', '-'));
    result.venueFormatted = venue.join(', ');
    
    // Format BibTeX for display (clean formatting)
    result.bibtexFormatted = formatBibtexDisplay(bibtex, result);
    
    return result;
}

// Format BibTeX for clean display
function formatBibtexDisplay(original, parsed) {
    const lines = ['@' + (parsed.type || 'Article') + '{' + (parsed.key || 'citation') + ','];
    const fields = ['author', 'title', 'booktitle', 'journal', 'year', 'publisher', 'address', 'pages', 'doi', 'isbn'];
    
    fields.forEach(field => {
        if (parsed[field]) {
            let value = parsed[field];
            // Clean up author field for display
            if (field === 'author') {
                value = value.replace(/\s+and\s+/g, ' and ');
            }
            lines.push('  ' + field.padEnd(10) + ' = {' + value + '},');
        }
    });
    
    // Remove trailing comma from last line and close
    if (lines.length > 1) {
        lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
    }
    lines.push('}');
    
    return lines.join('\n');
}

// Split .bib file content into individual entries
function splitBibEntries(bibContent) {
    const entries = [];
    const regex = /@\w+\s*\{[^@]+\}/g;
    let match;
    while ((match = regex.exec(bibContent)) !== null) {
        entries.push(match[0].trim());
    }
    return entries;
}

// Load publications from .bib file
function loadPublications() {
    fetch('publications.bib')
        .then(response => response.text())
        .then(bibContent => {
            const container = document.getElementById('publication-list');
            if (!container) return;
            
            container.innerHTML = '';
            
            // Split into individual BibTeX entries and parse
            const entries = splitBibEntries(bibContent);
            const publications = entries.map(bibtex => parseBibtex(bibtex));
            
            // Sort by year (newest first)
            publications.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
            
            publications.forEach(pub => {
                const pubElement = document.createElement('div');
                pubElement.className = 'publication-item';
                pubElement.dataset.key = pub.key || '';
                
                pubElement.innerHTML = `
                    <div class="publication-content">
                        <p class="publication-authors">${pub.authorsFormatted || pub.author || ''}</p>
                        <p class="publication-title">"${pub.title || ''}"</p>
                        <p class="publication-venue">${pub.venueFormatted || ''}</p>
                        <div class="publication-links">
                            ${pub.url ? `<a href="${pub.url}" target="_blank" class="pub-link"><i class="fas fa-external-link-alt"></i> Paper</a>` : ''}
                            <button class="bibtex-toggle" onclick="toggleBibtex(this)"><i class="fas fa-quote-right"></i> BibTeX</button>
                        </div>
                    </div>
                    <div class="bibtex-container" style="display: none;">
                        <div class="bibtex-header">
                            <span>BibTeX Citation</span>
                            <button class="copy-btn" onclick="copyBibtex(this)"><i class="fas fa-copy"></i> Copy</button>
                        </div>
                        <pre class="bibtex-code">${pub.bibtexFormatted}</pre>
                    </div>
                `;
                
                container.appendChild(pubElement);
            });
        })
        .catch(err => console.error('Error loading publications:', err));
}

// BibTeX Toggle Function
function toggleBibtex(button) {
    const publicationItem = button.closest('.publication-item');
    const bibtexContainer = publicationItem.querySelector('.bibtex-container');
    
    if (bibtexContainer.style.display === 'none') {
        bibtexContainer.style.display = 'block';
        button.classList.add('active');
    } else {
        bibtexContainer.style.display = 'none';
        button.classList.remove('active');
    }
}

// Copy BibTeX Function
function copyBibtex(button) {
    const bibtexContainer = button.closest('.bibtex-container');
    const bibtexCode = bibtexContainer.querySelector('.bibtex-code').textContent;
    
    navigator.clipboard.writeText(bibtexCode).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Load publications when DOM is ready
document.addEventListener('DOMContentLoaded', loadPublications);
