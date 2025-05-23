document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('citySelect');
    const exploreBtn = document.getElementById('exploreBtn');
    const cityCards = document.querySelectorAll('.city-card');
    const form = document.getElementById('addCityForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Check if user is logged in
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    // Handle explore button click
    exploreBtn.addEventListener('click', () => {
        const selectedCity = citySelect.value;
        if (selectedCity) {
            navigateToCity(selectedCity);
        } else {
            alert('Lütfen bir şehir seçiniz');
        }
    });

    // Handle city card clicks
    cityCards.forEach(card => {
        card.addEventListener('click', () => {
            const cityName = card.dataset.city;
            navigateToCity(cityName);
        });
    });

    // Navigation function
    function navigateToCity(cityName) {
        window.location.href = `/city/${cityName}`;
    }

    // Add hover effect to city cards
    cityCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Get form data
        const formData = {
            name: document.getElementById('cityName').value.trim(),
            description: document.getElementById('cityDescription').value.trim(),
            imageUrl: document.getElementById('cityImage').value.trim()
        };

        // Validate form data
        if (!formData.name || !formData.description || !formData.imageUrl) {
            showError('Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Şehir eklenirken bir hata oluştu.');
            }

            // Show success message
            successMessage.textContent = 'Şehir başarıyla eklendi! Yönlendiriliyorsunuz...';
            successMessage.style.display = 'block';

            // Redirect to home page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            showError(error.message);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}); 