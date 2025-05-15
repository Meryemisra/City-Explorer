// Auth state management
let currentUser = null;

// Check authentication status on page load
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        if (data.user) {
            currentUser = data.user;
            updateAuthUI(true);
        } else {
            updateAuthUI(false);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateAuthUI(false);
    }
}

// Update UI based on auth status
function updateAuthUI(isAuthenticated) {
    const authNav = document.getElementById('authNav');
    const addCityForm = document.getElementById('addCityForm');

    if (isAuthenticated) {
        authNav.innerHTML = `
            <li class="nav-item">
                <span class="nav-link">Hoş geldin, ${currentUser.email}</span>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="logout()">Çıkış Yap</a>
            </li>
        `;
        if (addCityForm) addCityForm.style.display = 'block';
    } else {
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="/login.html">Giriş Yap</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/register.html">Kayıt Ol</a>
            </li>
        `;
        if (addCityForm) addCityForm.style.display = 'none';
    }
}

// Logout function
async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        currentUser = null;
        updateAuthUI(false);
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 