const { supabase } = require('../config/supabase');

// Şehirdeki gezilecek yerleri listele
exports.getPlaces = async (req, res) => {
    try {
        const cityId = req.params.cityId;

        const { data: places, error } = await supabase
            .from('places')
            .select(`
                *,
                users:user_id (username)
            `)
            .eq('city_id', cityId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.render('places/index', {
            title: 'Gezilecek Yerler',
            places,
            cityId,
            user: req.user
        });
    } catch (error) {
        console.error('Gezilecek yerler listelenirken hata:', error);
        req.flash('error', 'Gezilecek yerler listelenirken bir hata oluştu.');
        res.redirect('/');
    }
};

// Yeni gezilecek yer ekle
exports.createPlace = async (req, res) => {
    try {
        const { name, description } = req.body;
        const cityId = req.params.cityId;

        if (!name) {
            req.flash('error', 'Yer adı zorunludur.');
            return res.redirect(`/cities/${cityId}/places`);
        }

        const { data, error } = await supabase
            .from('places')
            .insert([
                {
                    name,
                    description,
                    city_id: cityId,
                    user_id: req.user.id
                }
            ])
            .select();

        if (error) throw error;

        req.flash('success', 'Gezilecek yer başarıyla eklendi.');
        res.redirect(`/cities/${cityId}/places`);
    } catch (error) {
        console.error('Gezilecek yer eklenirken hata:', error);
        req.flash('error', 'Gezilecek yer eklenirken bir hata oluştu.');
        res.redirect(`/cities/${cityId}/places`);
    }
}; 