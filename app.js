require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { isAuthenticated } = require('./middlewares/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'frontend')));

// Global middleware - kullanıcı bilgisini tüm view'lara gönder
app.use(async (req, res, next) => {
    try {
        const token = req.cookies['sb-access-token'];
        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (!error && user) {
                res.locals.user = user;
            }
        }
        next();
    } catch (error) {
        next();
    }
});

// Routes
const authRouter = require('./routes/auth');
const citiesRouter = require('./routes/cityRoutes');
const placesRouter = require('./routes/places');
const commentsRouter = require('./routes/commentRoutes');

app.use('/api/auth', authRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/places', placesRouter);
app.use('/api/comments', commentsRouter);

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
}); 