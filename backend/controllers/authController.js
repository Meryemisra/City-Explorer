const { supabase } = require('../config/supabase');

// Login sayfasını göster
exports.getLogin = (req, res) => {
    res.render('login', {
        title: 'Giriş Yap',
        error: null
    });
};

// Register sayfasını göster
exports.getRegister = (req, res) => {
    res.render('register', {
        title: 'Kayıt Ol',
        error: null
    });
};

// Login işlemi
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ error: 'Email veya şifre hatalı' });
        }

        // Session token'ı cookie'ye kaydet
        res.cookie('sb-access-token', data.session.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 saat
        });

        // Session'a kullanıcı bilgisini kaydet
        req.session.user = data.user;

        res.json({ message: 'Giriş başarılı' });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Giriş yapılırken bir hata oluştu' });
    }
};

// Register işlemi
exports.register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Kullanıcıyı oluştur
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username
                }
            }
        });

        if (authError) {
            if (authError.message.includes('already registered')) {
                return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
            }
            return res.status(400).json({ error: 'Kayıt işlemi başarısız: ' + authError.message });
        }

        // Profil tablosuna kullanıcı bilgilerini ekle
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: authData.user.id,
                    username,
                    email
                }
            ]);

        if (profileError) {
            return res.status(500).json({ error: 'Profil oluşturulurken bir hata oluştu' });
        }

        res.json({ message: 'Kayıt başarılı' });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({ error: 'Kayıt olurken bir hata oluştu' });
    }
};

// Logout işlemi
exports.logout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Cookie'yi temizle
        res.clearCookie('sb-access-token');
        res.redirect('/login');
    } catch (error) {
        console.error('Logout error:', error.message);
        res.redirect('/');
    }
}; 