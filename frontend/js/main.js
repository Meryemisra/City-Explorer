document.addEventListener('DOMContentLoaded', () => {
    const citySelect = document.getElementById('citySelect');
    const exploreBtn = document.getElementById('exploreBtn');
    const cityCards = document.querySelectorAll('.city-card');

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
}); 