console.log("Register JS yüklendi");

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Başarılı kayıt
                    alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
                    window.location.href = 'login.html';
                } else {
                    // Sunucudan gelen hata mesajını göster
                    alert(data.error || 'Kayıt işlemi başarısız oldu.');
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Bir hata oluştu. Lütfen tekrar deneyin.');
            }
        });
    }
}); 