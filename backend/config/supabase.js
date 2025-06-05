const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Supabase bağlantı bilgileri
const supabaseUrl = 'https://kuhvigmrbnqtkaloctbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1aHZpZ21yYm50cWthbG9jdGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUwNDMsImV4cCI6MjA2NDY0MTA0M30.O34vyer7I14Drb695L3RdNXB9fVnP5cQR0uhOVATbgI';

// Supabase istemcisini oluştur
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public'
    },
    global: {
        fetch: fetch
    }
});

// Bağlantıyı test et
async function testConnection() {
    try {
        console.log('Supabase bağlantısı test ediliyor...');
        const { data, error } = await supabase
            .from('cities')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Supabase bağlantı hatası:', error);
            console.error('Hata detayı:', error.message);
            console.error('Hata kodu:', error.code);
            throw error;
        }

        console.log('Supabase bağlantısı başarılı!');
        console.log('Test verisi:', data);
    } catch (error) {
        console.error('Supabase bağlantı testi başarısız:', error);
        console.error('Hata detayı:', error.message);
        console.error('Hata stack:', error.stack);
        throw error;
    }
}

// Uygulama başlatıldığında bağlantıyı test et
testConnection().catch(console.error);

module.exports = supabase; 