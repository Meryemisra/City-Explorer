console.log("Register JS yüklendi");

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
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
            window.location.href = '/pages/login.html';
        } else {
            // Sunucudan gelen hata mesajını göster
            alert(data.message || 'Kayıt işlemi başarısız oldu.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
}); 