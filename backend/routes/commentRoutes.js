const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const supabase = require('../config/supabase');

// Şehir yorumlarını getir
router.get('/cities/:cityName/comments', async (req, res) => {
    try {
        const { cityName } = req.params;
        
        // Önce şehir ID'sini bul
        const { data: city, error: cityError } = await supabase
            .from('cities')
            .select('id')
            .eq('name', cityName)
            .single();

        if (cityError) {
            console.error('Şehir bulunamadı:', cityError);
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        // Şehrin yorumlarını getir
        const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select(`
                *,
                user:user_id (
                    raw_user_meta_data
                )
            `)
            .eq('city_id', city.id)
            .order('created_at', { ascending: false });

        if (commentsError) {
            console.error('Yorumlar getirilirken hata:', commentsError);
            return res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
        }

        // Kullanıcı adlarını ekle
        const commentsWithUsernames = comments.map(comment => ({
            ...comment,
            username: comment.user?.raw_user_meta_data?.username || 'Anonim'
        }));

        res.json(commentsWithUsernames);
    } catch (error) {
        console.error('Yorumlar getirilirken hata:', error);
        res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
    }
});

// Yeni yorum ekle
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { city_id, content } = req.body;
        
        // Auth bilgisini localStorage'dan al
        const authStr = req.headers['x-auth-data'];
        let auth = {};
        try {
            auth = JSON.parse(authStr || '{}');
        } catch (error) {
            console.error('Auth parse error:', error);
            return res.status(401).json({ error: 'Geçersiz oturum bilgisi' });
        }

        if (!auth.loggedIn || !auth.user || !auth.user.id) {
            return res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
        }

        if (!city_id || !content) {
            return res.status(400).json({ error: 'Şehir ID ve yorum içeriği gerekli' });
        }

        // Yorumu ekle
        const { data, error } = await supabase
            .from('comments')
            .insert([{
                city_id,
                content,
                user_id: auth.user.id
            }])
            .select(`
                *,
                user:user_id (
                    raw_user_meta_data
                )
            `)
            .single();

        if (error) {
            console.error('Yorum eklenirken hata:', error);
            return res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
        }

        // Kullanıcı adını ekle
        const commentWithUsername = {
            ...data,
            username: data.user?.raw_user_meta_data?.username || 'Anonim'
        };

        res.status(201).json(commentWithUsername);
    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
    }
});

module.exports = router; 