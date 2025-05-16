// Load cities on page load
document.addEventListener('DOMContentLoaded', loadCities);

// Load cities from API
async function loadCities() {
    try {
        const response = await fetch('/api/cities');
        const cities = await response.json();
        displayCities(cities);
    } catch (error) {
        console.error('Failed to load cities:', error);
        document.getElementById('citiesList').innerHTML = '<div class="alert alert-danger">Şehirler yüklenirken bir hata oluştu.</div>';
    }
}

// Display cities in the UI
function displayCities(cities) {
    const citiesList = document.getElementById('citiesList');
    if (cities.length === 0) {
        citiesList.innerHTML = '<div class="alert alert-info">Henüz hiç şehir eklenmemiş.</div>';
        return;
    }

    const citiesHTML = cities.map(city => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${city.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${city.country}</h6>
                <p class="card-text">${city.description}</p>
                <a href="/city.html?id=${city.id}" class="btn btn-primary">Detayları Gör</a>
            </div>
        </div>
    `).join('');

    citiesList.innerHTML = citiesHTML;
}

// Handle new city form submission
const newCityForm = document.getElementById('newCityForm');
if (newCityForm) {
    newCityForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(newCityForm);
        const cityData = {
            name: formData.get('name'),
            country: formData.get('country'),
            description: formData.get('description')
        };

        try {
            const response = await fetch('/api/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cityData)
            });

            if (response.ok) {
                newCityForm.reset();
                loadCities(); // Reload the cities list
            } else {
                throw new Error('Failed to add city');
            }
        } catch (error) {
            console.error('Failed to add city:', error);
            alert('Şehir eklenirken bir hata oluştu.');
        }
    });
} 