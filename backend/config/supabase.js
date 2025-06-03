const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Supabase bağlantı bilgilerini kontrol et
if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase bağlantı bilgileri eksik!');
    console.error('SUPABASE_URL:', supabaseUrl ? 'Mevcut' : 'Eksik');
    console.error('SUPABASE_KEY:', supabaseKey ? 'Mevcut' : 'Eksik');
    throw new Error('Supabase URL ve Key gerekli! Lütfen .env dosyasını kontrol edin.');
}

// Supabase istemcisini oluştur
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Bağlantıyı test et
async function testConnection() {
    try {
        await supabase.auth.getSession();
        console.log('Supabase bağlantısı başarılı!');
    } catch (error) {
        console.error('Supabase bağlantı testi başarısız:', error.message);
        throw error;
    }
}

// Uygulama başlatıldığında bağlantıyı test et
testConnection().catch(console.error);

module.exports = { supabase }; 