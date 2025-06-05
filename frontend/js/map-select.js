wdocument.addEventListener('DOMContentLoaded', function() {
    const mapObject = document.getElementById('turkey-map');
    const selectedCityInput = document.getElementById('selectedCity');
    const cityForm = document.getElementById('cityForm');

    // SVG yüklendiğinde
    mapObject.addEventListener('load', function() {
        const svgDoc = mapObject.contentDocument;
        const paths = svgDoc.querySelectorAll('path.city-path');

        paths.forEach(path => {
            path.addEventListener('click', function() {
                // Şehir adını al (önce data-city özelliğine bak, yoksa id'yi kullan)
                const cityName = this.getAttribute('data-city') || this.id;
                console.log('Seçilen şehir:', cityName);

                // Form input'unu güncelle
                selectedCityInput.value = cityName;

                // Önceki seçimi temizle
                paths.forEach(p => p.classList.remove('selected'));
                // Yeni seçimi işaretle
                this.classList.add('selected');
            });
        });
    });

    // Form gönderildiğinde
    cityForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cityName = selectedCityInput.value;
        if (!cityName) {
            alert('Lütfen önce bir şehir seçin!');
            return;
        }

        try {
            const response = await fetch('/api/selected-city', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ city: cityName })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Sunucu yanıtı:', result);
                alert('Şehir başarıyla kaydedildi!');
            } else {
                throw new Error('Şehir kaydedilemedi');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Şehir kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        }
    });
}); 