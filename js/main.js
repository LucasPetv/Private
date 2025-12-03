// Main Application

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Render game links
    renderGameLinks();

    // Admin button click
    document.getElementById('admin-btn').addEventListener('click', function(e) {
        e.preventDefault();
        openAdminModal();
    });

    // Admin login form
    document.getElementById('admin-login-form').addEventListener('submit', handleLogin);

    // Add link form
    document.getElementById('add-link-form').addEventListener('submit', handleAddLink);

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                // Cleanup snake game if running
                if (typeof cleanupSnake === 'function') cleanupSnake();
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
