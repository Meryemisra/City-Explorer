const { supabase } = require('../config/supabase');

// Kullanıcının giriş yapmış olup olmadığını kontrol eden middleware
exports.isAuthenticated = async (req, res, next) => {
    try {
        // Session token'ı cookie'den al
        const token = req.cookies['sb-access-token'];

        if (!token) {
            return res.redirect('/login');
        }

        // Supabase ile session'ı doğrula
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            // Token geçersiz veya süresi dolmuş
            res.clearCookie('sb-access-token');
            return res.redirect('/login');
        }

        // Kullanıcı bilgilerini request nesnesine ekle
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.redirect('/login');
    }
};

// Kullanıcının giriş yapmamış olması gereken sayfalar için middleware
// (örn: login, register sayfaları)
exports.isNotAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies['sb-access-token'];

        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (!error && user) {
                // Kullanıcı zaten giriş yapmış
                return res.redirect('/');
            }
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        next();
    }
}; 