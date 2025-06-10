const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase bağlantısı
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

// Oturum kontrolü
router.get('/session', async (req, res) => {
    try {
        // Cookie'den session token'ı al
        const sessionToken = req.cookies?.sb_session || null;
        
        if (!sessionToken) {
            return res.json({ user: null });
        }

        // Session'ı kontrol et
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            return res.json({ user: null });
        }

        // Kullanıcı bilgilerini getir
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (userError) {
            console.error('Kullanıcı bilgileri alınamadı:', userError);
            return res.json({ user: null });
        }

        res.json({ user });
    } catch (error) {
        console.error('Oturum kontrolü hatası:', error);
        res.json({ user: null });
    }
});

// Giriş yapma
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email ve şifre gerekli' });
        }

        console.log('Giriş denemesi:', { email });

        // Supabase ile giriş yap
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Giriş hatası:', error.message);
            return res.status(401).json({ error: 'Geçersiz email veya şifre' });
        }

        if (!data.user) {
            console.error('Kullanıcı bulunamadı');
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        console.log('Auth giriş başarılı, kullanıcı ID:', data.user.id);

        // Kullanıcı bilgilerini getir
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id);

        if (userError) {
            console.error('Kullanıcı bilgileri hatası:', userError.message);
            return res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı' });
        }

        if (!users || users.length === 0) {
            // Kullanıcı yoksa oluştur
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([
                    {
                        id: data.user.id,
                        email: data.user.email,
                        username: data.user.user_metadata.username || email.split('@')[0],
                        created_at: new Date().toISOString()
                    }
                ])
                .select()
                .single();

            if (createError) {
                console.error('Kullanıcı oluşturma hatası:', createError.message);
                return res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
            }

            // Session token'ı cookie'ye kaydet
            res.cookie('sb_session', data.session?.access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
            });

            return res.json({ user: newUser });
        }

        // Session token'ı cookie'ye kaydet
        res.cookie('sb_session', data.session?.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
        });

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Beklenmeyen hata:', error.message);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

// Kayıt olma
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            console.log('Eksik bilgi:', { username: !!username, email: !!email, password: !!password });
            return res.status(400).json({ error: 'Tüm alanlar gerekli' });
        }

        console.log('Kayıt denemesi başladı:', { username, email });

        // Önce kullanıcıyı oluştur
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        if (authError) {
            console.error('Auth kayıt hatası:', authError.message);
            return res.status(400).json({ error: 'Kayıt işlemi başarısız: ' + authError.message });
        }

        if (!authData.user) {
            console.error('Kullanıcı oluşturulamadı');
            return res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
        }

        console.log('Auth kayıt başarılı, kullanıcı ID:', authData.user.id);

        // Kullanıcı bilgilerini users tablosuna ekle
        const { data: user, error: profileError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    username,
                    email,
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (profileError) {
            console.error('Profil oluşturma hatası:', profileError.message);
            // Auth kaydını geri al
            await supabase.auth.admin.deleteUser(authData.user.id);
            return res.status(500).json({ error: 'Profil oluşturulamadı: ' + profileError.message });
        }

        if (!user) {
            console.error('Kullanıcı profili oluşturulamadı');
            // Auth kaydını geri al
            await supabase.auth.admin.deleteUser(authData.user.id);
            return res.status(500).json({ error: 'Kullanıcı profili oluşturulamadı' });
        }

        console.log('Profil oluşturuldu:', user);

        // Session token'ı cookie'ye kaydet
        res.cookie('sb_session', authData.session?.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
        });

        res.json({ user });
    } catch (error) {
        console.error('Kayıt işlemi sırasında beklenmeyen hata:', error.message);
        res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
    }
});

// Çıkış yapma
router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Çıkış hatası:', error);
            return res.status(500).json({ error: 'Çıkış yapılamadı' });
        }

        // Cookie'yi temizle
        res.clearCookie('sb_session');

        res.json({ message: 'Başarıyla çıkış yapıldı' });
    } catch (error) {
        console.error('Çıkış hatası:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router; 