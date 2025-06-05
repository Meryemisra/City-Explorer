// Auth state management
let currentUser = null;

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const errorMessage = document.getElementById('loginError');
    const successMessage = document.getElementById('successMessage');

    // Sayfa yüklendiğinde oturum durumunu kontrol et
    checkAuth();

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                console.log('Login attempt with:', { email });
                
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                console.log('Login response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Login response:', data);

                if (data.success) {
                    // Auth bilgisini localStorage'a kaydet
                    const authData = {
                        loggedIn: true,
                        user: {
                            email: data.user.email,
                            username: data.user.username
                        }
                    };
                    localStorage.setItem('auth', JSON.stringify(authData));
                    console.log('Auth data saved to localStorage:', authData);

                    // Başarılı giriş mesajı
                    if (errorMessage) {
                        errorMessage.style.display = 'none';
                    }
                    
                    // Kullanıcı bilgilerini sakla
                    currentUser = data.user;
                    localStorage.setItem('username', data.user.username);
                    
                    // UI'ı güncelle
                    updateUIForLoggedInUser(data.user);
                    
                    // 2 saniye sonra ana sayfaya yönlendir
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    // Hata mesajını göster
                    if (errorMessage) {
                        errorMessage.textContent = data.message || 'Giriş başarısız';
                        errorMessage.style.display = 'block';
                    }
                    if (successMessage) {
                        successMessage.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Login error:', error);
                if (errorMessage) {
                    errorMessage.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
                    errorMessage.style.display = 'block';
                }
                if (successMessage) {
                    successMessage.style.display = 'none';
                }
            }
        });
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
                    window.location.href = '/pages/login.html';
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});

// UI'ı güncelle
function updateUIForLoggedInUser(user) {
    const loginForm = document.getElementById('loginForm');
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

// Oturum durumunu kontrol et
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Auth check response:', data);

        if (data.loggedIn) {
            // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
} 