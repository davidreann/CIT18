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

    // Hide modal on load
    if (modal) modal.style.display = 'none';

    // --- 2. THEME LOGIC ---
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            themeToggle.innerHTML = (theme === 'dark') ? 
                '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        }
    }

    setTheme(localStorage.getItem('theme') || 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- 3. MOBILE MENU TOGGLE FIX ---
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navList.classList.toggle('active');
            // Optional: Toggle a class on the hamburger itself for animation
            menuToggle.classList.toggle('is-active'); 
        });

        // NEW: Close menu when a link is clicked (Crucial for UX)
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.classList.remove('is-active');
            });
        });

        // Close menu if clicking anywhere else on the document
        document.addEventListener('click', (e) => {
            const isClickInsideMenu = navList.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('is-active');
            }
        });
    }

    // --- 4. FORM SUBMISSION ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const originalText = btnSend.innerHTML;
            btnSend.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btnSend.style.pointerEvents = 'none';

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                mode: 'no-cors' 
            })
            .then(() => {
                if (modal) modal.style.setProperty('display', 'flex', 'important');
                contactForm.reset(); 
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Oops! Something went wrong.");
            })
            .finally(() => {
                btnSend.innerHTML = originalText;
                btnSend.style.pointerEvents = 'auto';
            });
        });
    }

    // --- 5. MODAL CLOSING ---
    if (closeModal) {
        closeModal.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) modal.style.display = 'none';
    });
});