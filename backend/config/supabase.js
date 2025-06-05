require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const dns = require('dns');

// DNS ayarlarını kontrol et
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Bağlantı bilgilerini kontrol et
if (!supabaseUrl || !supabaseKey) {
    console.error('Hata: SUPABASE_URL veya SUPABASE_ANON_KEY çevre değişkenleri bulunamadı!');
    console.error('Mevcut değerler:');
    console.error('SUPABASE_URL:', supabaseUrl);
    console.error('SUPABASE_ANON_KEY:', supabaseKey ? '***' : 'yok');
    process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);

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
        fetch: fetch,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
});

// Bağlantıyı test et
async function testConnection() {
    try {
        console.log('Supabase bağlantısı test ediliyor...');
        console.log('URL:', supabaseUrl);
        
        // DNS çözümleme testi
        try {
            const hostname = new URL(supabaseUrl).hostname;
            console.log('DNS çözümleme testi yapılıyor:', hostname);
            const addresses = await dns.promises.resolve4(hostname);
            console.log('DNS çözümleme sonucu:', addresses);
        } catch (dnsError) {
            console.error('DNS çözümleme hatası:', dnsError.message);
        }

        // Önce basit bir HTTP isteği ile bağlantıyı test et
        try {
            const response = await fetch(supabaseUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log('HTTP Bağlantı Durumu:', response.status);
        } catch (httpError) {
            console.error('HTTP Bağlantı Hatası:', httpError.message);
        }

        // Supabase sorgusu ile test et
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