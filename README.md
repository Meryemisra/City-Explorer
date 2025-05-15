# Şehir Keşif Forumu

Bu proje, kullanıcıların şehirler hakkında bilgi paylaşabileceği, gezilecek yerler ekleyebileceği ve yorum yapabileceği bir forum uygulamasıdır.

## Özellikler

- Kullanıcı kaydı ve girişi
- Şehir ekleme ve görüntüleme
- Gezilecek yerler ekleme
- Yorum yapma
- Responsive tasarım

## Teknolojiler

- Node.js
- Express.js
- Supabase (Veritabanı)
- EJS (Template Engine)
- Bootstrap 5

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/city-explorer.git
cd city-explorer
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun ve gerekli değişkenleri ayarlayın:
```
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SESSION_SECRET=your_session_secret
```

4. Supabase'de aşağıdaki tabloları oluşturun:

```sql
-- cities tablosu
create table cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- places tablosu
create table places (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  description text,
  city_id uuid references cities(id),
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- comments tablosu
create table comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  city_id uuid references cities(id),
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışmaya başlayacaktır.

## Lisans

MIT 