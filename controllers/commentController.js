const supabase = require('../config/supabase');

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