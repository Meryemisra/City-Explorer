const supabase = require('../config/supabase');

// Tüm şehirleri listele
exports.getCities = async (req, res) => {
    try {
        const { data: cities, error } = await supabase
            .from('cities')
            .select(`
                *,
                user:user_id (
                    email,
                    raw_user_meta_data
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Kullanıcı adlarını ekle
        const citiesWithUsernames = cities.map(city => ({
            ...city,
            username: city.user?.raw_user_meta_data?.username || 'Anonim'
        }));

        res.render('index', {
            cities: citiesWithUsernames,
            user: req.session.user || null,
            error: null
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.render('index', {
            cities: [],
            user: req.session.user || null,
            error: 'Şehirler yüklenirken bir hata oluştu.'
        });
    }
};

exports.getCityDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Şehir bilgilerini al
        const { data: city, error: cityError } = await supabase
            .from('cities')
            .select('*')
            .eq('id', id)
            .single();

        if (cityError) throw cityError;

        // Şehirdeki yerleri al
        const { data: places, error: placesError } = await supabase
            .from('places')
            .select('*')
            .eq('city_id', id);

        if (placesError) throw placesError;

        // Şehirdeki yorumları al
        const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select(`
                *,
                user:user_id (
                    user_metadata->username
                )
            `)
            .eq('city_id', id)
            .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;

        res.render('city', {
            city,
            places,
            comments: comments.map(comment => ({
                ...comment,
                username: comment.user.user_metadata.username
            })),
            user: req.session.user || null
        });
    } catch (error) {
        res.status(500).send('Error fetching city details');
    }
};

exports.createCity = async (req, res) => {
    try {
        const { name, description, country } = req.body;

        const { data, error } = await supabase
            .from('cities')
            .insert([{
                name,
                description,
                country,
                user_id: req.session.user.id
            }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 