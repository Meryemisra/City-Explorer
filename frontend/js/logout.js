// Çıkış Yap butonunu ekle
const logoutButton = document.createElement('button');
logoutButton.textContent = 'Çıkış Yap';
logoutButton.id = 'logout-btn';
logoutButton.style.position = 'fixed';
logoutButton.style.top = '20px';
logoutButton.style.right = '20px';
document.body.appendChild(logoutButton);

logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include',
        });
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Çıkış yapılamadı.');
        }
    } catch (error) {
        alert('Bir hata oluştu.');
    }
}); 