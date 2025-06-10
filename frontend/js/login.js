// Auth state management
let currentUser = null;

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login JS yüklendi');
    
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logoutButton');
    const errorMessage = document.getElementById('loginError');
    const successMessage = document.getElementById('successMessage');

    // Sayfa yüklendiğinde oturum durumunu kontrol et
    checkAuth();

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button handler
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Kullanıcı bilgilerini temizle
                    currentUser = null;
                    localStorage.removeItem('username');
                    
                    // UI'ı güncelle
                    updateUIForLoggedInUser(null);
                    
                    // Login sayfasına yönlendir
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});

// UI'ı güncelle
function updateUIForLoggedInUser(user) {
    const loginForm = document.getElementById('login-form');
    const userInfo = document.getElementById('userInfo');
    const logoutButton = document.getElementById('logoutButton');
    const username = document.getElementById('username');
    
    if (!loginForm || !userInfo || !logoutButton || !username) return;
    
    if (user) {
        loginForm.style.display = 'none';
        userInfo.style.display = 'block';
        logoutButton.style.display = 'block';
        username.textContent = user.username;
    } else {
        loginForm.style.display = 'block';
        userInfo.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

// Oturum kontrolü
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
            // Kullanıcı zaten giriş yapmış, ana sayfaya yönlendir
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

// Giriş formunu gönder
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.getElementById('submit-button');
    
    try {
        // Submit butonunu devre dışı bırak
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Giriş yapılıyor...';
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Giriş yapılamadı');
        }

        // Giriş başarılı, ana sayfaya yönlendir
        window.location.href = '/';
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    } finally {
        // Submit butonunu tekrar aktif et
        submitButton.disabled = false;
        submitButton.textContent = 'Giriş Yap';
    }
} 