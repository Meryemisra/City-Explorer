// Debug için konsol mesajı
console.log('city.js yüklendi');

// Şehir verileri
const cityData = {
    'istanbul': {
        info: 'İstanbul, Türkiye\'nin en kalabalık, ekonomik, tarihi ve sosyo-kültürel açıdan en önemli şehridir. Şehir, iktisadi büyüklük açısından dünyada 34. sırada yer alır. Nüfuslarına göre şehirler listesinde belediye sınırları göz önüne alınarak yapılan sıralamaya göre Avrupa\'da birinci, dünyada ise altıncı sırada yer almaktadır.',
        places: [
            'Ayasofya',
            'Topkapı Sarayı',
            'Sultanahmet Camii',
            'Galata Kulesi',
            'Kapalıçarşı',
            'Dolmabahçe Sarayı',
            'Boğaz Köprüsü',
            'Taksim Meydanı'
        ]
    },
    'ankara': {
        info: 'Ankara, Türkiye\'nin başkenti ve en kalabalık ikinci şehridir. Nüfusu 2023 yılı itibarıyla 5.7 milyondur. Bu nüfus; 25 ilçe ve bu ilçelere bağlı 1425 mahallede yaşamaktadır.',
        places: [
            'Anıtkabir',
            'Kızılay Meydanı',
            'Ankara Kalesi',
            'Etnografya Müzesi',
            'Atatürk Orman Çiftliği',
            'Kuğulu Park',
            'Anadolu Medeniyetleri Müzesi',
            'Gençlik Parkı'
        ]
    },
    'izmir': {
        info: 'İzmir, Türkiye\'nin üçüncü büyük şehri ve en önemli liman kentlerinden biridir. Tarihi boyunca birçok medeniyete ev sahipliği yapmış, önemli bir ticaret ve kültür merkezi olmuştur.',
        places: [
            'Kemeraltı Çarşısı',
            'Saat Kulesi',
            'Kordon',
            'Efes Antik Kenti',
            'Bergama Antik Kenti',
            'Çeşme',
            'Alaçatı',
            'Foça'
        ]
    }
};

// Oturum kontrolü
async function checkSession() {
    try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
            // Kullanıcı giriş yapmış
            document.getElementById('commentForm').style.display = 'block';
            document.getElementById('loginMessage').style.display = 'none';
            return data.user;
        } else {
            // Kullanıcı giriş yapmamış
            document.getElementById('commentForm').style.display = 'none';
            document.getElementById('loginMessage').style.display = 'block';
            return null;
        }
    } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
        return null;
    }
}

// Şehir detaylarını yükle
async function loadCityDetails() {
    try {
        // URL'den şehir adını al
        const urlParams = new URLSearchParams(window.location.search);
        const cityName = urlParams.get('name');
        
        if (!cityName) {
            throw new Error('Şehir adı bulunamadı');
        }

        console.log('Şehir detayları yükleniyor:', cityName);

        const response = await fetch(`/api/cities/${cityName}`);
        if (!response.ok) {
            throw new Error('Şehir bulunamadı');
        }

        const city = await response.json();
        console.log('Şehir detayları:', city);

        // Şehir bilgilerini göster
        document.getElementById('cityName').textContent = city.name;
        document.getElementById('cityRegion').textContent = city.region || 'Bölge bilgisi yok';
        document.getElementById('cityPopulation').textContent = city.population ? `${city.population.toLocaleString()} kişi` : 'Nüfus bilgisi yok';
        document.getElementById('cityPlate').textContent = city.plate_code || 'Plaka kodu yok';
        document.getElementById('cityArea').textContent = city.area ? `${city.area.toLocaleString()} km²` : 'Alan bilgisi yok';
        document.getElementById('cityElevation').textContent = city.elevation ? `${city.elevation} m` : 'Rakım bilgisi yok';
        document.getElementById('cityAttractions').textContent = city.attractions || 'Gezilecek yer bilgisi yok';

        // Yorumları yükle
        await loadComments(cityName);
    } catch (error) {
        console.error('Şehir detayları yüklenirken hata:', error);
        showError('Şehir detayları yüklenemedi');
    }
}

// Yorumları yükle
async function loadComments(cityName) {
    try {
        console.log('Yorumlar yükleniyor:', cityName);
        const response = await fetch(`/api/cities/${cityName}/comments`);
        if (!response.ok) {
            throw new Error('Yorumlar yüklenemedi');
        }

        const comments = await response.json();
        console.log('Yorumlar alındı:', comments);

        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = '';

        if (!comments || comments.length === 0) {
            commentsList.innerHTML = '<div class="alert alert-info">Henüz yorum yapılmamış. İlk yorumu siz yapın!</div>';
            return;
        }

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.username || 'Anonim'}</span>
                    <span class="comment-date">${new Date(comment.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            `;
            commentsList.appendChild(commentElement);
        });
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
        showError('Yorumlar yüklenemedi');
    }
}

// Yorum ekle
async function addComment(event) {
    event.preventDefault();
    
    try {
        const content = document.getElementById('commentContent').value.trim();
        if (!content) {
            showError('Lütfen bir yorum yazın');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const cityName = urlParams.get('name');
        
        if (!cityName) {
            throw new Error('Şehir adı bulunamadı');
        }

        console.log('Yorum gönderiliyor:', { cityName, content });

        const response = await fetch(`/api/cities/${encodeURIComponent(cityName)}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content }),
            credentials: 'include'
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                showError('Yorum yapabilmek için giriş yapmalısınız');
                return;
            }
            throw new Error(responseData.error || responseData.details || 'Yorum eklenemedi');
        }

        console.log('Yorum eklendi:', responseData);

        // Yorum formunu temizle
        document.getElementById('commentContent').value = '';
        
        // Başarı mesajı göster
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'Yorumunuz başarıyla eklendi!';
        document.getElementById('commentForm').insertBefore(successMessage, document.getElementById('commentForm').firstChild);
        
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
        
        // Yorumları yeniden yükle
        await loadComments(cityName);
    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        showError(error.message || 'Yorum eklenemedi');
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
    console.log('city.js yüklendi');
    
    // Oturum kontrolü yap
    checkSession();
    
    // Şehir detaylarını yükle
    loadCityDetails();
    
    // Yorum formunu dinle
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', addComment);
    }
}); 