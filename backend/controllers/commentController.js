const supabase = require('../config/supabase');

// Tüm yorumları getir
exports.getAllComments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                user:user_id (
                    email,
                    raw_user_meta_data
                ),
                cities:city_id (name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Kullanıcı adlarını ekle
        const commentsWithUsernames = data.map(comment => ({
            ...comment,
            username: comment.user?.raw_user_meta_data?.username || 'Anonim'
        }));

        res.json(commentsWithUsernames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Belirli bir şehrin yorumlarını getir
exports.getComments = async (req, res) => {
    try {
        const { cityId } = req.params;

        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                user:user_id (
                    email,
                    raw_user_meta_data
                )
            `)
            .eq('city_id', cityId)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // Kullanıcı adlarını ekle
        const commentsWithUsernames = data.map(comment => ({
            ...comment,
            username: comment.user?.raw_user_meta_data?.username || 'Anonim'
        }));

        res.json(commentsWithUsernames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { content, city_id } = req.body;

        const { data, error } = await supabase
            .from('comments')
            .insert([{
                content,
                city_id,
                user_id: req.session.user.id
            }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.redirect(`/cities/${city_id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 