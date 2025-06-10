// Debug için konsol mesajı
console.log('index.js yüklendi');

// Oturum kontrolü
async function checkSession() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        const authNav = document.getElementById('authNav');
        if (!authNav) return;

        if (data.user) {
            // Kullanıcı giriş yapmış
            authNav.innerHTML = `
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <span class="nav-link text-light">Hoş geldin, ${data.user.username}</span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" onclick="logout()">Çıkış Yap</a>
                    </li>
                </ul>
            `;
        } else {
            // Kullanıcı giriş yapmamış
            authNav.innerHTML = `
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/login">Giriş Yap</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/register">Kayıt Ol</a>
                    </li>
                </ul>
            `;
        }
    } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
        // Hata durumunda giriş/kayıt butonlarını göster
        const authNav = document.getElementById('authNav');
        if (authNav) {
            authNav.innerHTML = `
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/login">Giriş Yap</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/register">Kayıt Ol</a>
                    </li>
                </ul>
            `;
        }
    }
}

// Çıkış yapma fonksiyonu
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });

        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Çıkış yapılırken hata oluştu');
        }
    } catch (error) {
        console.error('Çıkış yapılırken hata:', error);
    }
}

let allCities = [];

// Şehirleri yükle
async function loadCities() {
    try {
        const response = await fetch('/api/cities');
        if (!response.ok) {
            throw new Error('Şehirler yüklenemedi');
        }

        const cities = await response.json();
        console.log('Yüklenen şehirler:', cities);
        renderCities(cities);
    } catch (error) {
        console.error('Şehirler yüklenirken hata:', error);
        showError('Şehirler yüklenemedi');
    }
}

// Şehirleri görüntüle
function renderCities(cities) {
    const citiesList = document.getElementById('citiesList');
    if (!citiesList) {
        console.error('citiesList elementi bulunamadı');
        return;
    }

    citiesList.innerHTML = '';
    
    if (cities.length === 0) {
        citiesList.innerHTML = '<div class="alert alert-info">Şehir bulunamadı</div>';
        return;
    }

    cities.forEach(city => {
        const cityCard = document.createElement('div');
        cityCard.className = 'col-md-3 mb-3';
        cityCard.innerHTML = `
            <a href="/city?name=${encodeURIComponent(city.name)}" class="text-decoration-none">
                <div class="city-card">
                    <h5 class="city-name">${city.name}</h5>
                    <p class="city-region">${city.region || 'Bölge bilgisi yok'}</p>
                </div>
            </a>
        `;
        citiesList.appendChild(cityCard);
    });
}

// Arama fonksiyonu
function searchCities(query) {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('searchInput elementi bulunamadı');
        return;
    }

    query = query.toLowerCase().trim();
    console.log('Arama sorgusu:', query);

    const cityCards = document.querySelectorAll('#citiesList .col-md-3');
    let foundAny = false;

    cityCards.forEach(card => {
        const cityName = card.querySelector('.city-name').textContent.toLowerCase();
        const cityRegion = card.querySelector('.city-region').textContent.toLowerCase();
        
        if (cityName.includes(query) || cityRegion.includes(query)) {
            card.style.display = '';
            foundAny = true;
        } else {
            card.style.display = 'none';
        }
    });

    const citiesList = document.getElementById('citiesList');
    if (!foundAny) {
        if (!citiesList.querySelector('.alert-info')) {
            const noResults = document.createElement('div');
            noResults.className = 'alert alert-info';
            noResults.textContent = 'Arama kriterlerine uygun şehir bulunamadı';
            citiesList.appendChild(noResults);
        }
    } else {
        const noResults = citiesList.querySelector('.alert-info');
        if (noResults) {
            noResults.remove();
        }
    }
}

// Hata mesajı göster
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    console.log('index.js yüklendi');
    
    // Oturum kontrolü yap
    checkSession();
    
    // Arama kutusunu dinle
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            searchCities(searchInput.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCities(searchInput.value);
            }
        });

        searchInput.addEventListener('input', () => {
            searchCities(searchInput.value);
        });
    }

    // Şehirleri yükle
    loadCities();
}); 