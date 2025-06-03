// Kullanıcı adını kontrol et
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('welcomeMessage').textContent = `Hoş Geldiniz, ${username}!`;
}

// Tooltip işlemleri
const tooltip = document.querySelector('.city-tooltip');
const mapWrapper = document.querySelector('.map-wrapper');

mapWrapper.addEventListener('mousemove', (e) => {
    if (tooltip.style.display === 'block') {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    }
});

// Şehir seçimi ve detayları
async function showCityDetails(cityName) {
    const selectedCityInfo = document.getElementById('selectedCityInfo');
    const cityNameElement = document.getElementById('selected-city-name');
    const cityDetails = document.getElementById('city-details');
    
    selectedCityInfo.style.display = 'block';
    cityNameElement.textContent = cityName;
    
    try {
        const response = await fetch(`/api/cities/${cityName}`);
        const cityData = await response.json();
        
        cityDetails.innerHTML = `
            <div class="city-card">
                <p><strong>Açıklama:</strong> ${cityData.description || 'Açıklama bulunmuyor'}</p>
                <p><strong>Konum:</strong> ${cityData.location || 'Konum bilgisi yok'}</p>
                <p><strong>Nüfus:</strong> ${cityData.population || 'Bilgi yok'}</p>
                <p><strong>Öne Çıkan Yerler:</strong> ${cityData.attractions || 'Bilgi yok'}</p>
            </div>
        `;
    } catch (error) {
        console.error('Şehir detayları yüklenirken hata oluştu:', error);
        cityDetails.innerHTML = '<p class="text-danger">Şehir detayları yüklenirken bir hata oluştu.</p>';
    }
}

// Harita etkileşimleri
document.querySelectorAll('svg path').forEach(path => {
    path.addEventListener('mouseover', function(e) {
        const cityName = this.getAttribute('data-city');
        tooltip.textContent = cityName;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    path.addEventListener('mouseout', function() {
        tooltip.style.display = 'none';
    });

    path.addEventListener('click', function() {
        // Önceki seçimi temizle
        document.querySelectorAll('svg path').forEach(p => p.classList.remove('selected'));
        // Yeni seçimi işaretle
        this.classList.add('selected');
        
        const cityName = this.getAttribute('data-city');
        showCityDetails(cityName);
    });
});

// Yorumları yükleme fonksiyonu
async function loadComments() {
    try {
        const response = await fetch('/get/comments');
        const comments = await response.json();
        const commentsContainer = document.getElementById('comments-container');
        
        comments.forEach(comment => {
            const commentCard = document.createElement('div');
            commentCard.className = 'col-md-6';
            commentCard.innerHTML = `
                <div class="comment-card">
                    <h5>${comment.username}</h5>
                    <p>${comment.content}</p>
                    <small class="text-muted">${new Date(comment.date).toLocaleDateString('tr-TR')}</small>
                </div>
            `;
            commentsContainer.appendChild(commentCard);
        });
    } catch (error) {
        console.error('Yorumlar yüklenirken hata oluştu:', error);
        document.getElementById('comments-container').innerHTML = 
            '<div class="col-12 text-center"><p class="text-danger">Yorumlar yüklenirken bir hata oluştu.</p></div>';
    }
}

// Yorum gönderme
document.getElementById('submit-comment').addEventListener('click', async function() {
    const cityName = document.getElementById('selected-city-name').textContent;
    const comment = document.getElementById('comment').value;
    
    if (!comment) {
        alert('Lütfen bir yorum yazın.');
        return;
    }

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cityName,
                content: comment,
                username: username || 'Misafir'
            })
        });

        if (response.ok) {
            document.getElementById('comment').value = '';
            loadComments(); // Yorumları yeniden yükle
            alert('Yorumunuz başarıyla eklendi!');
        } else {
            throw new Error('Yorum eklenirken bir hata oluştu');
        }
    } catch (error) {
        console.error('Yorum gönderilirken hata oluştu:', error);
        alert('Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
});

// Sayfa yüklendiğinde yorumları getir
document.addEventListener('DOMContentLoaded', loadComments); 