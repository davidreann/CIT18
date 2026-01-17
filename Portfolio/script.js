document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECTIONS ---
    const menuToggle = document.querySelector('#mobile-menu');
    const navList = document.querySelector('.nav-links');
    const themeToggle = document.querySelector('#theme-toggle');
    const htmlElement = document.documentElement;
    
    const contactForm = document.querySelector('.contact-form');
    const modal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');
    const btnSend = document.querySelector('.btn-send');

    // --- 2. THEME / NIGHT MODE LOGIC ---
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update the icon inside the button
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        }
    }

    // Initial check for saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Toggle Click Event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // --- 3. MOBILE MENU LOGIC ---
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList) navList.classList.remove('active');
        });
    });

    // --- 4. FORM SUBMISSION (GOOGLE SHEETS) ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevents the white "Success" page redirect
            
            // Visual feedback: Loading state
            const originalText = btnSend.innerHTML;
            btnSend.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btnSend.style.pointerEvents = 'none';

            const data = new FormData(contactForm);
            
            fetch(contactForm.action, {
                method: 'POST',
                body: data,
                mode: 'no-cors' // Added to handle Google Apps Script redirect behavior
            })
            .then(() => {
                // Show our custom success modal
                if (modal) modal.style.display = 'flex';
                contactForm.reset(); // Clear the form
            })
            .catch(error => {
                console.error('Submission Error:', error);
                alert("Oops! Something went wrong. Please try again.");
            })
            .finally(() => {
                // Restore button state
                btnSend.innerHTML = originalText;
                btnSend.style.pointerEvents = 'auto';
            });
        });
    }

    // --- 5. MODAL CLOSING LOGIC ---
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal if user clicks outside the box
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
});