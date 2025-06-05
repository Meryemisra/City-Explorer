const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const supabase = require('../config/supabase');

// Örnek şehir verileri (gerçek uygulamada veritabanından gelecek)
const cities = {
    'Adana': {
        name: 'Adana',
        description: 'Türkiye\'nin güneyinde, Akdeniz Bölgesi\'nde yer alan bir şehirdir. Türkiye\'nin en kalabalık altıncı şehridir.',
        location: 'Akdeniz Bölgesi',
        population: '2.2 milyon',
        attractions: [
            'Taşköprü',
            'Seyhan Barajı',
            'Kapıkaya Kanyonu',
            'Anavarza Antik Kenti',
            'Yılankale'
        ]
    },
    'Ankara': {
        name: 'Ankara',
        description: 'Türkiye\'nin başkenti ve en kalabalık ikinci şehridir. İç Anadolu Bölgesi\'nde yer alır.',
        location: 'İç Anadolu Bölgesi',
        population: '5.6 milyon',
        attractions: [
            'Anıtkabir',
            'Kızılay Meydanı',
            'Ankara Kalesi',
            'Atakule',
            'Gençlik Parkı'
        ]
    },
    'Elazığ': {
        name: 'Elazığ',
        description: 'Doğu Anadolu Bölgesi\'nde yer alan, tarihi ve doğal güzellikleriyle ünlü bir şehirdir.',
        location: 'Doğu Anadolu Bölgesi',
        population: '600 bin',
        attractions: [
            'Hazar Gölü',
            'Harput Kalesi',
            'Keban Barajı',
            'Müzik Müzesi',
            'Buzluk Mağarası'
        ]
    }
    // Diğer şehirler buraya eklenebilir
};

// Tüm şehirleri getir
router.get('/', (req, res) => {
    res.json(cities);
});

// Şehirleri listele
router.get('/all', cityController.getCities);

// Şehrin yorumlarını getir (bu route'u önce tanımlıyoruz)
router.get('/:cityName/comments', async (req, res) => {
    try {
        const { cityName } = req.params;
        console.log('Şehir yorumları isteniyor:', cityName);
        
        // Önce şehir ID'sini bul
        console.log('Şehir ID\'si aranıyor...');
        const { data: city, error: cityError } = await supabase
            .from('cities')
            .select('id')
            .eq('name', cityName)
            .single();

        if (cityError) {
            console.error('Şehir bulunamadı:', cityError);
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        console.log('Şehir bulundu:', city);

        // Şehrin yorumlarını getir
        console.log('Yorumlar getiriliyor...');
        const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:user_id (
                    username
                )
            `)
            .eq('city_id', city.id)
            .order('created_at', { ascending: false });

        if (commentsError) {
            console.error('Yorumlar getirilirken hata:', commentsError);
            return res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
        }

        console.log('Yorumlar bulundu:', comments);

        // Kullanıcı adlarını ekle
        const commentsWithUsernames = comments.map(comment => ({
            ...comment,
            username: comment.profiles?.username || 'Anonim'
        }));

        console.log('Şehir yorumları gönderiliyor:', commentsWithUsernames);
        res.json(commentsWithUsernames);
    } catch (error) {
        console.error('Yorumlar getirilirken beklenmeyen hata:', error);
        console.error('Hata detayı:', error.message);
        console.error('Hata stack:', error.stack);
        res.status(500).json({ 
            error: 'Yorumlar getirilirken bir hata oluştu',
            details: error.message 
        });
    }
});

// Şehir detaylarını getir (bu route'u en sona koyuyoruz)
router.get('/:name', (req, res) => {
    const cityName = decodeURIComponent(req.params.name);
    console.log('Şehir detayları isteniyor:', cityName);
    
    // Şehir adını normalize et (büyük harf ve Türkçe karakter düzeltmesi)
    const normalizedCityName = cityName
        .toUpperCase()
        .replace('İ', 'I')
        .replace('Ğ', 'G')
        .replace('Ü', 'U')
        .replace('Ş', 'S')
        .replace('Ö', 'O')
        .replace('Ç', 'C');
    
    // Şehir verilerini normalize et
    const normalizedCities = {};
    Object.keys(cities).forEach(key => {
        const normalizedKey = key
            .toUpperCase()
            .replace('İ', 'I')
            .replace('Ğ', 'G')
            .replace('Ü', 'U')
            .replace('Ş', 'S')
            .replace('Ö', 'O')
            .replace('Ç', 'C');
        normalizedCities[normalizedKey] = cities[key];
    });
    
    // Normalize edilmiş şehir adıyla eşleştir
    const city = normalizedCities[normalizedCityName];
    if (!city) {
        console.log('Şehir bulunamadı:', cityName);
        return res.status(404).json({ error: 'Şehir bulunamadı' });
    }
    
    console.log('Şehir detayları gönderiliyor:', city);
    res.json(city);
});

// Yeni şehir ekle (sadece giriş yapmış kullanıcılar)
router.post('/', cityController.createCity);

module.exports = router; 