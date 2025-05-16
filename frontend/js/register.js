document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch('/post/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Başarılı kayıt
            window.location.href = '/login';
        } else {
            // Hata durumu
            alert(data.message || 'Kayıt işlemi sırasında bir hata oluştu.');
        }
    } catch (error) {
        console.error('Hata:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
}); 