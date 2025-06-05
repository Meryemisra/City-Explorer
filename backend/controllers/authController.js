const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

// Supabase bağlantısı
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Sabit kullanıcı listesi
const users = [
    {
        email: 'test@example.com',
        password: '123456',
        username: 'testuser'
    },
    {
        email: 'admin@example.com',
        password: 'admin123',
        username: 'admin'
    }
];

// Login sayfasını göster
exports.getLogin = (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/login.html');
    res.sendFile(filePath);
};

// Register sayfasını göster
exports.getRegister = (req, res) => {
    const filePath = path.join(__dirname, '../../frontend/pages/register.html');
    res.sendFile(filePath);
};

// Login işlemi
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email ve şifre gereklidir'
            });
        }

        // Kullanıcıyı bul
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz kullanıcı'
            });
        }

        // Oturum oluştur (basit bir token)
        const sessionToken = Math.random().toString(36).substring(7);
        req.app.locals.activeSessions[sessionToken] = {
            email: user.email,
            username: user.username
        };

        // Cookie'ye token'ı kaydet
        res.cookie('sessionToken', sessionToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 saat
        });

        // Başarılı yanıt
        return res.status(200).json({
            success: true,
            user: {
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Giriş işlemi sırasında bir hata oluştu'
        });
    }
};

// Register işlemi
exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Email kontrolü
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanılıyor'
            });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcıyı kaydet
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([
                {
                    email,
                    username,
                    password: hashedPassword
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Register error:', error);
            return res.status(500).json({
                success: false,
                message: 'Kayıt işlemi sırasında bir hata oluştu'
            });
        }

        // Session oluştur
        req.session.user = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username
        };

        return res.status(201).json({
            success: true,
            user: {
                email: newUser.email,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({
            success: false,
            message: 'Kayıt işlemi sırasında bir hata oluştu'
        });
    }
};

// Kullanıcı durumunu kontrol et
exports.checkAuth = (req, res) => {
    // Sabit kullanıcı nesnesi
    const mockUser = {
        loggedIn: true,
        user: {
            email: 'test@example.com',
            username: 'testuser'
        }
    };

    // JSON yanıtı döndür
    return res.status(200).json(mockUser);
};

// Logout işlemi
exports.logout = (req, res) => {
    const sessionToken = req.cookies.sessionToken;

    if (sessionToken) {
        delete req.app.locals.activeSessions[sessionToken];
    }

    res.clearCookie('sessionToken');
    return res.status(200).json({
        success: true,
        message: 'Başarıyla çıkış yapıldı'
    });
}; 