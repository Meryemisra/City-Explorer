require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');

const app = express();

// CORS ayarları
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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

// Frontend klasörünü statik olarak sun
const frontendPath = path.join(__dirname, '../frontend');
console.log('Frontend klasör yolu:', frontendPath);

// API Routes - Statik dosya sunumundan önce
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/comments', require('./routes/commentRoutes'));

// Statik dosyaları sun
app.use(express.static(path.join(__dirname, '../frontend')));

// HTML sayfaları için özel rotalar
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'pages/index.html'));
});

app.get('/pages/login', (req, res) => {
    res.sendFile(path.join(frontendPath, 'pages/login.html'));
});

app.get('/pages/register', (req, res) => {
    res.sendFile(path.join(frontendPath, 'pages/register.html'));
});

// 404 handler
app.use((req, res) => {
    console.log('404 - İstenen URL:', req.url);
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API endpoint bulunamadı' });
    } else {
        res.status(404).sendFile(path.join(frontendPath, 'pages/404.html'));
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Hata:', err.stack);
    if (req.path.startsWith('/api/')) {
        res.status(500).json({ error: 'Bir hata oluştu!' });
    } else {
        res.status(500).sendFile(path.join(frontendPath, 'pages/500.html'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log('Frontend klasörü:', frontendPath);
}); 