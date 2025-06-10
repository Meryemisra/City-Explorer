console.log("Register JS yüklendi");

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const submitButton = document.getElementById('submit-button');
    
    try {
        // Submit butonunu devre dışı bırak
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Kayıt yapılıyor...';
        
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Kayıt yapılamadı');
        }

        // Kayıt başarılı, ana sayfaya yönlendir
        window.location.href = '/';
    } catch (error) {
        console.error('Register error:', error);
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
    } finally {
        // Submit butonunu tekrar aktif et
        submitButton.disabled = false;
        submitButton.textContent = 'Kayıt Ol';
    }
} 