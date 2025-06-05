// Debug için konsol mesajı
console.log('index.js yüklendi');

// Türkiye'nin tüm şehirleri
const cities = [
    { id: 1, name: "Adana" },
    { id: 2, name: "Adıyaman" },
    { id: 3, name: "Afyonkarahisar" },
    { id: 4, name: "Ağrı" },
    { id: 5, name: "Amasya" },
    { id: 6, name: "Ankara" },
    { id: 7, name: "Antalya" },
    { id: 8, name: "Artvin" },
    { id: 9, name: "Aydın" },
    { id: 10, name: "Balıkesir" },
    { id: 11, name: "Bilecik" },
    { id: 12, name: "Bingöl" },
    { id: 13, name: "Bitlis" },
    { id: 14, name: "Bolu" },
    { id: 15, name: "Burdur" },
    { id: 16, name: "Bursa" },
    { id: 17, name: "Çanakkale" },
    { id: 18, name: "Çankırı" },
    { id: 19, name: "Çorum" },
    { id: 20, name: "Denizli" },
    { id: 21, name: "Diyarbakır" },
    { id: 22, name: "Edirne" },
    { id: 23, name: "Elazığ" },
    { id: 24, name: "Erzincan" },
    { id: 25, name: "Erzurum" },
    { id: 26, name: "Eskişehir" },
    { id: 27, name: "Gaziantep" },
    { id: 28, name: "Giresun" },
    { id: 29, name: "Gümüşhane" },
    { id: 30, name: "Hakkari" },
    { id: 31, name: "Hatay" },
    { id: 32, name: "Isparta" },
    { id: 33, name: "Mersin" },
    { id: 34, name: "İstanbul" },
    { id: 35, name: "İzmir" },
    { id: 36, name: "Kars" },
    { id: 37, name: "Kastamonu" },
    { id: 38, name: "Kayseri" },
    { id: 39, name: "Kırklareli" },
    { id: 40, name: "Kırşehir" },
    { id: 41, name: "Kocaeli" },
    { id: 42, name: "Konya" },
    { id: 43, name: "Kütahya" },
    { id: 44, name: "Malatya" },
    { id: 45, name: "Manisa" },
    { id: 46, name: "Kahramanmaraş" },
    { id: 47, name: "Mardin" },
    { id: 48, name: "Muğla" },
    { id: 49, name: "Muş" },
    { id: 50, name: "Nevşehir" },
    { id: 51, name: "Niğde" },
    { id: 52, name: "Ordu" },
    { id: 53, name: "Rize" },
    { id: 54, name: "Sakarya" },
    { id: 55, name: "Samsun" },
    { id: 56, name: "Siirt" },
    { id: 57, name: "Sinop" },
    { id: 58, name: "Sivas" },
    { id: 59, name: "Tekirdağ" },
    { id: 60, name: "Tokat" },
    { id: 61, name: "Trabzon" },
    { id: 62, name: "Tunceli" },
    { id: 63, name: "Şanlıurfa" },
    { id: 64, name: "Uşak" },
    { id: 65, name: "Van" },
    { id: 66, name: "Yozgat" },
    { id: 67, name: "Zonguldak" },
    { id: 68, name: "Aksaray" },
    { id: 69, name: "Bayburt" },
    { id: 70, name: "Karaman" },
    { id: 71, name: "Kırıkkale" },
    { id: 72, name: "Batman" },
    { id: 73, name: "Şırnak" },
    { id: 74, name: "Bartın" },
    { id: 75, name: "Ardahan" },
    { id: 76, name: "Iğdır" },
    { id: 77, name: "Yalova" },
    { id: 78, name: "Karabük" },
    { id: 79, name: "Kilis" },
    { id: 80, name: "Osmaniye" },
    { id: 81, name: "Düzce" }
];

// Şehir listesini oluştur
function createCityList(cities) {
    const cityList = document.getElementById('cityList');
    if (!cityList) return;
    
    cityList.innerHTML = '';
    cities.forEach(city => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        const a = document.createElement('a');
        a.href = `city.html?name=${encodeURIComponent(city.name)}`;
        a.textContent = city.name;
        a.className = 'text-decoration-none text-dark';
        
        li.appendChild(a);
        cityList.appendChild(li);
    });
}

// Arama fonksiyonu
function searchCities(query) {
    console.log('Arama yapılıyor:', query);
    query = query.toLowerCase();
    const filteredCities = cities.filter(city => 
        city.name.toLowerCase().includes(query)
    );
    createCityList(filteredCities);
}

// Kullanıcı durumunu kontrol et
function checkAuthStatus() {
    console.log('checkAuthStatus çağrıldı');
    
    const authStr = localStorage.getItem('auth');
    console.log('localStorage auth:', authStr);
    
    let auth = {};
    try {
        auth = JSON.parse(authStr || '{}');
    } catch (error) {
        console.error('Auth parse error:', error);
        auth = {};
    }
    
    console.log('Parsed auth:', auth);

    const usernameDisplayContainer = document.getElementById('usernameDisplayContainer');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const authNav = document.getElementById('authNav');

    if (auth.loggedIn && auth.user) {
        console.log('Kullanıcı giriş yapmış:', auth.user);
        
        if (usernameDisplayContainer && usernameDisplay) {
            usernameDisplayContainer.style.display = 'block';
            usernameDisplay.textContent = auth.user.username;
        }

        if (authNav) {
            const loginLinks = authNav.querySelectorAll('a[href*="login"], a[href*="register"]');
            loginLinks.forEach(link => {
                link.parentElement.style.display = 'none';
            });
        }
    } else {
        console.log('Kullanıcı giriş yapmamış');
        
        if (usernameDisplayContainer) {
            usernameDisplayContainer.style.display = 'none';
        }

        if (authNav) {
            const loginLinks = authNav.querySelectorAll('a[href*="login"], a[href*="register"]');
            loginLinks.forEach(link => {
                link.parentElement.style.display = 'block';
            });
        }
    }
}

// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sayfa başlatılıyor...');
    
    // Kullanıcı durumunu kontrol et
    checkAuthStatus();

    // Şehir listesini oluştur
    createCityList(cities);
    
    // Arama input event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        console.log('searchInput elementi bulundu');
        searchInput.addEventListener('input', (e) => {
            searchCities(e.target.value);
        });
    } else {
        console.error('searchInput elementi bulunamadı!');
    }
}); 