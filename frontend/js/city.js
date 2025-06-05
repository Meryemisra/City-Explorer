// Debug için konsol mesajı
console.log('city.js yüklendi');

// URL'den şehir adını al
function getCityNameFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('name');
    console.log('URL\'den alınan şehir adı:', cityName);
    return cityName;
}

// Şehir detaylarını yükle
async function loadCityDetails(cityName) {
    console.log('Şehir detayları yükleniyor:', cityName);
    try {
        const response = await fetch(`/api/cities/${encodeURIComponent(cityName)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cityData = await response.json();
        console.log('Şehir detayları yüklendi:', cityData);

        // Şehir ID'sini sakla
        window.cityId = cityData.id;

        // Gerekli elementleri kontrol et
        const requiredElements = {
            cityNameElement: document.getElementById('cityNameElement'),
            descriptionElement: document.getElementById('descriptionElement'),
            locationElement: document.getElementById('locationElement'),
            populationElement: document.getElementById('populationElement'),
            attractionsList: document.getElementById('attractionsList'),
            cityInfoContainer: document.getElementById('cityInfoContainer')
        };

        // Eksik elementleri kontrol et
        const missingElements = Object.entries(requiredElements)
            .filter(([_, element]) => !element)
            .map(([name]) => name);

        if (missingElements.length > 0) {
            console.error('Eksik elementler:', missingElements);
            throw new Error(`Gerekli HTML elementleri bulunamadı: ${missingElements.join(', ')}`);
        }

        // Şehir bilgilerini doldur
        requiredElements.cityNameElement.textContent = cityData.name;
        requiredElements.descriptionElement.textContent = cityData.description;
        requiredElements.locationElement.textContent = cityData.location;
        requiredElements.populationElement.textContent = cityData.population;

        // Gezilecek yerleri listele
        requiredElements.attractionsList.innerHTML = '';
        cityData.attractions.forEach(attraction => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = attraction;
            requiredElements.attractionsList.appendChild(li);
        });

        // Şehir bilgilerini göster
        requiredElements.cityInfoContainer.style.display = 'block';

    } catch (error) {
        console.error('Şehir detayları yüklenirken hata:', error);
        alert('Şehir detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
}

// Yorumları yükle
async function loadComments(cityName) {
    console.log('Yorumlar yükleniyor:', cityName);
    try {
        const response = await fetch(`/api/cities/${encodeURIComponent(cityName)}/comments`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const comments = await response.json();
        console.log('Yorumlar yüklendi:', comments);

        const commentsContainer = document.getElementById('commentsContainer');
        if (!commentsContainer) {
            console.error('commentsContainer elementi bulunamadı');
            return;
        }

        commentsContainer.innerHTML = '';
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="text-muted">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>';
            return;
        }

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'card mb-2';
            commentElement.innerHTML = `
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted">${comment.username}</h6>
                    <p class="card-text">${comment.content}</p>
                    <small class="text-muted">${new Date(comment.created_at).toLocaleString('tr-TR')}</small>
                </div>
            `;
            commentsContainer.appendChild(commentElement);
        });

    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        const commentsContainer = document.getElementById('commentsContainer');
        if (commentsContainer) {
            commentsContainer.innerHTML = '<p class="text-danger">Yorumlar yüklenirken bir hata oluştu.</p>';
        }
    }
}

// Yorum gönderme işlemi
async function handleCommentSubmit(event) {
    event.preventDefault();
    
    const commentInput = document.getElementById('commentInput');
    if (!commentInput) {
        console.error('commentInput elementi bulunamadı');
        return;
    }

    const comment = commentInput.value.trim();
    if (!comment) {
        alert('Lütfen bir yorum yazın.');
        return;
    }

    if (!window.cityId) {
        alert('Şehir bilgisi bulunamadı.');
        return;
    }

    // Auth bilgisini al
    const authStr = localStorage.getItem('auth');
    let auth = {};
    try {
        auth = JSON.parse(authStr || '{}');
    } catch (error) {
        console.error('Auth parse error:', error);
        alert('Oturum bilgisi alınamadı. Lütfen tekrar giriş yapın.');
        return;
    }

    if (!auth.loggedIn || !auth.user) {
        alert('Yorum yapabilmek için giriş yapmanız gerekiyor.');
        return;
    }

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-data': authStr
            },
            body: JSON.stringify({
                city_id: window.cityId,
                content: comment
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Yorum başarıyla gönderildi
        commentInput.value = '';
        alert('Yorumunuz başarıyla eklendi!');
        await loadComments(getCityNameFromUrl()); // Yorumları yeniden yükle

    } catch (error) {
        console.error('Yorum gönderilirken hata:', error);
        alert(error.message || 'Yorum gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
}

// Kullanıcı durumunu kontrol et
function checkAuthStatus() {
    console.log('Kullanıcı durumu kontrol ediliyor');
    const authStr = localStorage.getItem('auth');
    let auth = {};
    
    try {
        auth = JSON.parse(authStr || '{}');
    } catch (error) {
        console.error('Auth parse error:', error);
        auth = {};
    }

    const usernameDisplayContainer = document.getElementById('usernameDisplayContainer');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const commentForm = document.getElementById('commentForm');
    const loginPrompt = document.getElementById('loginPrompt');

    if (auth.loggedIn && auth.user) {
        console.log('Kullanıcı giriş yapmış:', auth.user);
        
        if (usernameDisplayContainer && usernameDisplay) {
            usernameDisplayContainer.style.display = 'block';
            usernameDisplay.textContent = auth.user.username;
        }

        if (commentForm) {
            commentForm.style.display = 'block';
        }
        if (loginPrompt) {
            loginPrompt.style.display = 'none';
        }
    } else {
        console.log('Kullanıcı giriş yapmamış');
        
        if (usernameDisplayContainer) {
            usernameDisplayContainer.style.display = 'none';
        }

        if (commentForm) {
            commentForm.style.display = 'none';
        }
        if (loginPrompt) {
            loginPrompt.style.display = 'block';
        }
    }
}

// Sayfa yüklendiğinde çalışacak kodlar
window.addEventListener('load', async () => {
    console.log('Sayfa başlatılıyor...');
    
    // Kullanıcı durumunu kontrol et
    checkAuthStatus();

    // Şehir adını al ve detayları yükle
    const cityName = getCityNameFromUrl();
    if (cityName) {
        await loadCityDetails(cityName);
        await loadComments(cityName);
    } else {
        alert('Şehir bilgisi bulunamadı.');
        window.location.href = '/';
    }

    // Yorum formunu dinle
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
}); 