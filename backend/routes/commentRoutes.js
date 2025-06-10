const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantısı
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Şehrin yorumlarını getir
router.get('/:cityName/comments', async (req, res) => {
    try {
        const { cityName } = req.params;
        console.log('Yorumlar getiriliyor:', cityName);

        // Önce şehri bul
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
                users:user_id (
                    username
                )
            `)
            .eq('city_id', city.id)
            .order('created_at', { ascending: false });

        if (commentsError) {
            console.error('Yorumlar getirilirken hata:', commentsError);
            return res.status(500).json({ error: 'Yorumlar getirilemedi' });
        }

        console.log('Yorumlar başarıyla getirildi:', comments);
        res.json(comments);
    } catch (error) {
        console.error('Yorumlar getirilirken hata:', error);
        res.status(500).json({ error: 'Yorumlar getirilemedi' });
    }
});

// Yorum ekle
router.post('/:cityName/comments', async (req, res) => {
    try {
        const { cityName } = req.params;
        const { content, userId } = req.body;
        console.log('Yorum ekleniyor:', { cityName, content, userId });

        if (!content || !userId) {
            return res.status(400).json({ error: 'Yorum içeriği ve kullanıcı ID gerekli' });
        }

        // Önce şehri bul
        const { data: city, error: cityError } = await supabase
            .from('cities')
            .select('id')
            .eq('name', cityName)
            .single();

        if (cityError) {
            console.error('Şehir bulunamadı:', cityError);
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        // Yorumu ekle
        const { data: comment, error: commentError } = await supabase
            .from('comments')
            .insert([
                {
                    city_id: city.id,
                    user_id: userId,
                    content: content
                }
            ])
            .select(`
                *,
                users:user_id (
                    username
                )
            `)
            .single();

        if (commentError) {
            console.error('Yorum eklenirken hata:', commentError);
            return res.status(500).json({ error: 'Yorum eklenemedi' });
        }

        console.log('Yorum başarıyla eklendi:', comment);
        res.status(201).json(comment);
    } catch (error) {
        console.error('Yorum eklenirken hata:', error);
        res.status(500).json({ error: 'Yorum eklenemedi' });
    }
});

module.exports = router; 