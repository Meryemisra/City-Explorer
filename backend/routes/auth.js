const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase bağlantısı
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email ve şifre gereklidir'
            });
        }

        // Supabase ile kullanıcı doğrulama
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Cookie'ye token'ı kaydet
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 saat
        });

        // Başarılı yanıt
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.user_metadata?.username || email.split('@')[0]
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Giriş işlemi sırasında bir hata oluştu'
        });
    }
});

// Check auth endpoint
router.get('/check', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(200).json({
                loggedIn: false
            });
        }

        // JWT token'ı doğrula
        const decoded = jwt.verify(token, JWT_SECRET);

        // Supabase'den kullanıcı bilgilerini al
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(200).json({
                loggedIn: false
            });
        }

        // Başarılı yanıt
        return res.status(200).json({
            loggedIn: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.user_metadata?.username || user.email.split('@')[0]
            }
        });

    } catch (error) {
        console.error('Auth check error:', error);
        return res.status(200).json({
            loggedIn: false
        });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (token) {
            // Supabase oturumunu sonlandır
            await supabase.auth.signOut();
        }

        // Cookie'yi temizle
        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            message: 'Başarıyla çıkış yapıldı'
        });

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Çıkış işlemi sırasında bir hata oluştu'
        });
    }
});

module.exports = router; 