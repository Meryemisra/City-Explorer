document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Successful login
                localStorage.setItem('token', data.token); // If your backend sends a token
                window.location.href = '/dashboard'; // Redirect to dashboard or home page
            } else {
                const error = await response.json();
                errorMessage.textContent = error.message || 'Login failed. Please try again.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorMessage.style.display = 'block';
            console.error('Login error:', error);
        }
    });
}); 