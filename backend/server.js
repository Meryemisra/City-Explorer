require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

// CORS ayarları
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware - tüm istekleri logla
app.use((req, res, next) => {
    console.log('İstek:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    next();
});

// Supabase bağlantısı
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Frontend klasörünü statik olarak sun
const frontendPath = path.join(__dirname, '../frontend');
console.log('Frontend klasör yolu:', frontendPath);

// API Routes
app.use('/api/cities', cityRoutes);
app.use('/api/cities', commentRoutes);
app.use('/api/auth', authRoutes);

// Şehir detaylarını getir
app.get('/api/cities/:name', async (req, res) => {
    try {
        const { name } = req.params;
        console.log('Şehir detayları isteniyor:', name);

        // Supabase'den şehir bilgilerini al
        const { data: city, error } = await supabase
            .from('cities')
            .select('*')
            .eq('name', name)
            .single();

        if (error) {
            console.error('Şehir bulunamadı:', error);
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        if (!city) {
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        console.log('Şehir detayları gönderiliyor:', city);
        res.json(city);
    } catch (error) {
        console.error('Şehir detayları alınırken hata:', error);
        res.status(500).json({ error: 'Şehir detayları alınamadı' });
    }
});

// Statik dosyaları sun
app.use(express.static(path.join(__dirname, '../frontend')));

// HTML sayfaları için özel rotalar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));
});

app.get('/city', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/city.html'));
});

// Eski URL'leri yeni URL'lere yönlendir
app.get('/pages/index.html', (req, res) => {
    res.redirect('/');
});

app.get('/pages/login.html', (req, res) => {
    res.redirect('/login');
});

app.get('/pages/register.html', (req, res) => {
    res.redirect('/register');
});

// 404 handler
app.use((req, res) => {
    console.log('404 - İstenen URL:', req.url);
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint bulunamadı' });
    } else {
        res.status(404).sendFile(path.join(__dirname, '../frontend/pages/404.html'));
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Sunucu hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası' });
});

// Sunucuyu başlat
app.listen(port, '0.0.0.0', () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
    console.log('Frontend klasörü:', frontendPath);
}); 