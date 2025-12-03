// Admin Module

// Simple hash function for password (not secure, just for demo purposes)
// In production, use proper server-side authentication
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Default admin password hash (password: "admin123")
const ADMIN_PASSWORD_HASH = simpleHash("admin123");

// Storage keys
const STORAGE_KEYS = {
    LINKS: 'gamePortal_links',
    AUTH: 'gamePortal_auth'
};

// Default links
const DEFAULT_LINKS = [
    {
        id: 1,
        title: 'Cool Math Games',
        url: 'https://www.coolmathgames.com',
        description: 'Viele coole Mathe- und Logikspiele',
        icon: '🧮'
    },
    {
        id: 2,
        title: 'Poki',
        url: 'https://poki.com',
        description: 'Tausende kostenlose Online-Spiele',
        icon: '🎮'
    },
    {
        id: 3,
        title: 'Miniclip',
        url: 'https://www.miniclip.com',
        description: 'Klassische Browser-Spiele',
        icon: '🕹️'
    }
];

// Get links from storage
function getLinks() {
    const stored = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with default links
    saveLinks(DEFAULT_LINKS);
    return DEFAULT_LINKS;
}

// Save links to storage
function saveLinks(links) {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
}

// Check if admin is authenticated
function isAuthenticated() {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
}

// Set authentication status
function setAuthenticated(status) {
    if (status) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    } else {
        sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    }
}

// Render game links on the main page
function renderGameLinks() {
    const container = document.getElementById('game-links');
    const links = getLinks();

    if (links.length === 0) {
        container.innerHTML = '<p class="no-links">Noch keine Links vorhanden.</p>';
        return;
    }

    container.innerHTML = links.map(link => `
        <div class="link-card">
            <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
                <span class="link-icon">${escapeHtml(link.icon)}</span>
                <div class="link-info">
                    <h4>${escapeHtml(link.title)}</h4>
                    <p>${escapeHtml(link.description)}</p>
                </div>
            </a>
        </div>
    `).join('');
}

// Render links in admin panel
function renderAdminLinks() {
    const container = document.getElementById('admin-links-list');
    const links = getLinks();

    if (links.length === 0) {
        container.innerHTML = '<p>Noch keine Links vorhanden.</p>';
        return;
    }

    container.innerHTML = links.map(link => `
        <div class="admin-link-item">
            <span>${escapeHtml(link.icon)} ${escapeHtml(link.title)}</span>
            <button onclick="deleteLink(${link.id})">Löschen</button>
        </div>
    `).join('');
}

// Add new link
function addLink(title, url, description, icon) {
    const links = getLinks();
    const newId = links.length > 0 ? Math.max(...links.map(l => l.id)) + 1 : 1;
    
    links.push({
        id: newId,
        title: title,
        url: url,
        description: description,
        icon: icon
    });
    
    saveLinks(links);
    renderGameLinks();
    renderAdminLinks();
}

// Delete link
function deleteLink(id) {
    if (!confirm('Möchtest du diesen Link wirklich löschen?')) return;
    
    let links = getLinks();
    links = links.filter(link => link.id !== id);
    saveLinks(links);
    renderGameLinks();
    renderAdminLinks();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Validate URL to ensure only safe protocols
function isValidUrl(urlString) {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

// Open admin modal
function openAdminModal() {
    if (isAuthenticated()) {
        openAdminPanel();
    } else {
        document.getElementById('admin-modal').classList.add('active');
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').textContent = '';
    }
}

// Close admin modal
function closeAdminModal() {
    document.getElementById('admin-modal').classList.remove('active');
}

// Open admin panel
function openAdminPanel() {
    closeAdminModal();
    document.getElementById('admin-panel').classList.add('active');
    renderAdminLinks();
}

// Close admin panel
function closeAdminPanel() {
    document.getElementById('admin-panel').classList.remove('active');
}

// Login handler
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    if (simpleHash(password) === ADMIN_PASSWORD_HASH) {
        setAuthenticated(true);
        openAdminPanel();
    } else {
        document.getElementById('login-error').textContent = 'Falsches Passwort!';
    }
}

// Logout
function logout() {
    setAuthenticated(false);
    closeAdminPanel();
}

// Handle add link form
function handleAddLink(e) {
    e.preventDefault();
    
    const title = document.getElementById('link-title').value.trim();
    const url = document.getElementById('link-url').value.trim();
    const description = document.getElementById('link-description').value.trim();
    const icon = document.getElementById('link-icon').value.trim();
    
    // Validate URL to prevent javascript: and other unsafe protocols
    if (!isValidUrl(url)) {
        alert('Bitte gib eine gültige URL ein (http:// oder https://)');
        return;
    }
    
    if (title && url && description && icon) {
        addLink(title, url, description, icon);
        
        // Clear form
        document.getElementById('link-title').value = '';
        document.getElementById('link-url').value = '';
        document.getElementById('link-description').value = '';
        document.getElementById('link-icon').value = '';
    }
}
