require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantısını oluştur
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase bağlantı bilgileri eksik!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import route files
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'gizli-anahtar',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/comments', commentRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/pages/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.get('/pages/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/register.html'));
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Supabase bağlantısını test et
async function testSupabaseConnection() {
    try {
        // Basit bir bağlantı testi
        await supabase.auth.getSession();
        console.log("Supabase bağlantısı başarılı.");
    } catch (error) {
        console.error("Supabase bağlantı hatası:", error.message);
        process.exit(1);
    }
}

// Uygulama başlatıldığında bağlantıyı test et
testSupabaseConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 