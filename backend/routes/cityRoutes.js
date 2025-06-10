const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');

// Supabase bağlantısı
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// cities nesnesi silindi

// Örnek şehir verileri (gerçek uygulamada veritabanından gelecek)
const cities = {
    "Adana": {
        name: "Adana",
        description: "Türkiye'nin güneyinde, Akdeniz Bölgesi'nde yer alan bir şehirdir.",
        location: "Akdeniz Bölgesi",
        population: "2.2 milyon",
        attractions: ["Taşköprü", "Seyhan Barajı", "Kapıkaya Kanyonu"]
    },
    "Adıyaman": {
        name: "Adıyaman",
        description: "Güneydoğu Anadolu Bölgesi'nde yer alan tarihiyle ünlü bir şehirdir.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "632 bin",
        attractions: ["Nemrut Dağı", "Cendere Köprüsü", "Arsemia Antik Kenti"]
    },
    "Afyonkarahisar": {
        name: "Afyonkarahisar",
        description: "Ege Bölgesi'nde yer alan termal kaynaklarıyla ünlü bir şehirdir.",
        location: "Ege Bölgesi",
        population: "744 bin",
        attractions: ["Afyon Kalesi", "Frig Vadisi", "Zafer Müzesi"]
    },
    "Ağrı": {
        name: "Ağrı",
        description: "Doğu Anadolu Bölgesi'nde, Türkiye'nin en yüksek dağına ev sahipliği yapan şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "536 bin",
        attractions: ["Ağrı Dağı", "İshak Paşa Sarayı", "Meteor Çukuru"]
    },
    "Amasya": {
        name: "Amasya",
        description: "Karadeniz Bölgesi'nde, tarihi ve doğal güzellikleriyle ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "335 bin",
        attractions: ["Kral Kaya Mezarları", "Amasya Kalesi", "Yalıboyu Evleri"]
    },
    "Ankara": {
        name: "Ankara",
        description: "Türkiye'nin başkenti ve en kalabalık ikinci şehridir.",
        location: "İç Anadolu Bölgesi",
        population: "5.6 milyon",
        attractions: ["Anıtkabir", "Kızılay Meydanı", "Atakule"]
    },
    "Antalya": {
        name: "Antalya",
        description: "Türkiye'nin turizm başkenti, Akdeniz'in incisi.",
        location: "Akdeniz Bölgesi",
        population: "2.6 milyon",
        attractions: ["Kaleiçi", "Düden Şelalesi", "Konyaaltı Plajı"]
    },
    "Artvin": {
        name: "Artvin",
        description: "Karadeniz'in doğusunda, doğal güzellikleriyle ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "169 bin",
        attractions: ["Karagöl", "Mençuna Şelalesi", "Artvin Kalesi"]
    },
    "Aydın": {
        name: "Aydın",
        description: "Ege Bölgesi'nde, tarihi ve turistik yerleriyle bilinen bir şehirdir.",
        location: "Ege Bölgesi",
        population: "1.1 milyon",
        attractions: ["Aphrodisias Antik Kenti", "Didim", "Kuşadası"]
    },
    "Balıkesir": {
        name: "Balıkesir",
        description: "Marmara ve Ege'nin kesişiminde, hem deniz hem doğa turizmiyle öne çıkar.",
        location: "Marmara/Ege Bölgesi",
        population: "1.2 milyon",
        attractions: ["Cunda Adası", "Kazdağları", "Manyas Kuş Cenneti"]
    },
    "Bilecik": {
        name: "Bilecik",
        description: "Osmanlı'nın doğduğu topraklar, Marmara Bölgesi'nde küçük bir şehir.",
        location: "Marmara Bölgesi",
        population: "228 bin",
        attractions: ["Şeyh Edebali Türbesi", "Osmanlı Padişahları Tarih Şeridi"]
    },
    "Bingöl": {
        name: "Bingöl",
        description: "Doğu Anadolu'da, dağları ve gölleriyle bilinen bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "281 bin",
        attractions: ["Yüzen Adalar", "Kös Kaplıcaları", "Bingöl Kalesi"]
    },
    "Bitlis": {
        name: "Bitlis",
        description: "Doğu Anadolu'da, tarihi kaleleri ve doğal güzellikleriyle ünlü bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "352 bin",
        attractions: ["Nemrut Krater Gölü", "Bitlis Kalesi", "Ahlat Selçuklu Mezarlığı"]
    },
    "Bolu": {
        name: "Bolu",
        description: "Karadeniz ile İç Anadolu arasında, doğal güzellikleriyle ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "320 bin",
        attractions: ["Abant Gölü", "Yedigöller", "Gölcük Tabiat Parkı"]
    },
    "Burdur": {
        name: "Burdur",
        description: "Akdeniz Bölgesi'nde, gölleriyle ünlü küçük bir şehirdir.",
        location: "Akdeniz Bölgesi",
        population: "273 bin",
        attractions: ["Salda Gölü", "İnsuyu Mağarası", "Sagalassos Antik Kenti"]
    },
    "Bursa": {
        name: "Bursa",
        description: "Osmanlı'nın ilk başkenti, tarihi ve doğal güzellikleriyle ünlü.",
        location: "Marmara Bölgesi",
        population: "3.1 milyon",
        attractions: ["Uludağ", "Cumalıkızık", "Yeşil Türbe"]
    },
    "Çanakkale": {
        name: "Çanakkale",
        description: "Tarihi Gelibolu Yarımadası ve Troya Antik Kenti ile ünlü.",
        location: "Marmara Bölgesi",
        population: "550 bin",
        attractions: ["Troya Antik Kenti", "Gelibolu", "Assos"]
    },
    "Çankırı": {
        name: "Çankırı",
        description: "İç Anadolu'nun kuzeyinde, tuz mağaralarıyla bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "216 bin",
        attractions: ["Tuz Mağarası", "Çankırı Kalesi", "Yapraklı Yaylası"]
    },
    "Çorum": {
        name: "Çorum",
        description: "Karadeniz'in iç kısmında, Hitit uygarlığına ev sahipliği yapmış bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "526 bin",
        attractions: ["Hattuşa", "Alacahöyük", "Çorum Müzesi"]
    },
    "Denizli": {
        name: "Denizli",
        description: "Ege Bölgesi'nde, Pamukkale travertenleriyle ünlü bir şehirdir.",
        location: "Ege Bölgesi",
        population: "1 milyon",
        attractions: ["Pamukkale", "Hierapolis", "Laodikeia"]
    },
    "Diyarbakır": {
        name: "Diyarbakır",
        description: "Güneydoğu Anadolu'nun en büyük şehirlerinden, surlarıyla ünlü.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "1.8 milyon",
        attractions: ["Diyarbakır Surları", "Hevsel Bahçeleri", "Ulu Camii"]
    },
    "Edirne": {
        name: "Edirne",
        description: "Osmanlı'ya başkentlik yapmış, tarihi camileriyle ünlü bir şehirdir.",
        location: "Marmara Bölgesi",
        population: "412 bin",
        attractions: ["Selimiye Camii", "Meriç Köprüsü", "Edirne Sarayı"]
    },
    "Elazığ": {
        name: "Elazığ",
        description: "Doğu Anadolu Bölgesi'nde yer alan, tarihi ve doğal güzellikleriyle ünlü bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "600 bin",
        attractions: ["Hazar Gölü", "Harput Kalesi", "Keban Barajı"]
    },
    "Erzincan": {
        name: "Erzincan",
        description: "Doğu Anadolu'da, doğal güzellikleri ve kaplıcalarıyla bilinen bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "239 bin",
        attractions: ["Girlevik Şelalesi", "Ergan Dağı", "Altıntepe Höyüğü"]
    },
    "Erzurum": {
        name: "Erzurum",
        description: "Doğu Anadolu'nun en büyük şehirlerinden, kış turizmiyle ünlü.",
        location: "Doğu Anadolu Bölgesi",
        population: "762 bin",
        attractions: ["Palandöken", "Çifte Minareli Medrese", "Yakutiye Medresesi"]
    },
    "Eskişehir": {
        name: "Eskişehir",
        description: "İç Anadolu'da, öğrenci nüfusu ve modern yapısıyla bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "898 bin",
        attractions: ["Odunpazarı", "Porsuk Çayı", "Sazova Parkı"]
    },
    "Gaziantep": {
        name: "Gaziantep",
        description: "Güneydoğu'nun en büyük şehirlerinden, mutfağıyla ünlü.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "2.1 milyon",
        attractions: ["Zeugma Müzesi", "Gaziantep Kalesi", "Bakırcılar Çarşısı"]
    },
    "Giresun": {
        name: "Giresun",
        description: "Karadeniz kıyısında, fındığıyla ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "448 bin",
        attractions: ["Giresun Adası", "Zeytinlik Mahallesi", "Kuzalan Şelalesi"]
    },
    "Gümüşhane": {
        name: "Gümüşhane",
        description: "Karadeniz'in iç kısmında, tarihi ve doğal güzellikleriyle bilinir.",
        location: "Karadeniz Bölgesi",
        population: "150 bin",
        attractions: ["Karaca Mağarası", "Santa Harabeleri", "Torul Kalesi"]
    },
    "Hakkari": {
        name: "Hakkari",
        description: "Doğu Anadolu'nun güneydoğusunda, dağlık bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "280 bin",
        attractions: ["Cilo Dağları", "Zap Vadisi", "Mergan Yaylası"]
    },
    "Hatay": {
        name: "Hatay",
        description: "Akdeniz'in güneyinde, kültürel çeşitliliğiyle ünlü bir şehirdir.",
        location: "Akdeniz Bölgesi",
        population: "1.7 milyon",
        attractions: ["Habib-i Neccar Camii", "St. Pierre Kilisesi", "Harbiye Şelaleleri"]
    },
    "Isparta": {
        name: "Isparta",
        description: "Göller Yöresi'nde, gül ve lavanta üretimiyle bilinen bir şehirdir.",
        location: "Akdeniz Bölgesi",
        population: "445 bin",
        attractions: ["Eğirdir Gölü", "Kovada Gölü", "Lavanta Tarlaları"]
    },
    "Mersin": {
        name: "Mersin",
        description: "Akdeniz kıyısında, limanı ve sahilleriyle ünlü bir şehirdir.",
        location: "Akdeniz Bölgesi",
        population: "1.9 milyon",
        attractions: ["Kızkalesi", "Cennet-Cehennem Obrukları", "Tarsus Şelalesi"]
    },
    "İstanbul": {
        name: "İstanbul",
        description: "Türkiye'nin en büyük şehri, tarihi ve kültürel zenginliğiyle dünyaca ünlü.",
        location: "Marmara Bölgesi",
        population: "15.8 milyon",
        attractions: ["Ayasofya", "Topkapı Sarayı", "Boğaziçi"]
    },
    "İzmir": {
        name: "İzmir",
        description: "Ege'nin incisi, modern ve tarihi dokusuyla ünlü bir şehirdir.",
        location: "Ege Bölgesi",
        population: "4.4 milyon",
        attractions: ["Kordon", "Efes Antik Kenti", "Saat Kulesi"]
    },
    "Kars": {
        name: "Kars",
        description: "Doğu Anadolu'da, Ani Harabeleri ve kış turizmiyle bilinen bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "285 bin",
        attractions: ["Ani Harabeleri", "Kars Kalesi", "Çıldır Gölü"]
    },
    "Kastamonu": {
        name: "Kastamonu",
        description: "Karadeniz'in iç kısmında, tarihi ve doğal güzellikleriyle ünlü.",
        location: "Karadeniz Bölgesi",
        population: "383 bin",
        attractions: ["Ilgaz Dağı", "Valla Kanyonu", "Kastamonu Kalesi"]
    },
    "Kayseri": {
        name: "Kayseri",
        description: "İç Anadolu'da, Erciyes Dağı ve pastırmasıyla ünlü bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "1.4 milyon",
        attractions: ["Erciyes Dağı", "Kayseri Kalesi", "Kapuzbaşı Şelaleleri"]
    },
    "Kırklareli": {
        name: "Kırklareli",
        description: "Trakya'da, doğal güzellikleri ve longoz ormanlarıyla bilinen bir şehirdir.",
        location: "Marmara Bölgesi",
        population: "361 bin",
        attractions: ["İğneada Longoz Ormanları", "Dupnisa Mağarası", "Kırklareli Müzesi"]
    },
    "Kırşehir": {
        name: "Kırşehir",
        description: "İç Anadolu'da, termal kaynakları ve tarihiyle bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "243 bin",
        attractions: ["Cacabey Medresesi", "Ahi Evran Külliyesi", "Seyfe Gölü"]
    },
    "Kocaeli": {
        name: "Kocaeli",
        description: "Marmara Bölgesi'nde, sanayisi ve körfeziyle bilinen bir şehirdir.",
        location: "Marmara Bölgesi",
        population: "2 milyon",
        attractions: ["Kartepe", "Maşukiye", "İzmit Saat Kulesi"]
    },
    "Konya": {
        name: "Konya",
        description: "Türkiye'nin yüzölçümü en büyük ili, Mevlana ile ünlü.",
        location: "İç Anadolu Bölgesi",
        population: "2.3 milyon",
        attractions: ["Mevlana Müzesi", "Alaeddin Tepesi", "Çatalhöyük"]
    },
    "Kütahya": {
        name: "Kütahya",
        description: "Ege Bölgesi'nde, çini ve termal kaynaklarıyla bilinen bir şehirdir.",
        location: "Ege Bölgesi",
        population: "578 bin",
        attractions: ["Kütahya Kalesi", "Aizanoi Antik Kenti", "Çini Müzesi"]
    },
    "Malatya": {
        name: "Malatya",
        description: "Doğu Anadolu'da, kayısısıyla ünlü bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "800 bin",
        attractions: ["Nemrut Dağı", "Aslantepe Höyüğü", "Levent Vadisi"]
    },
    "Manisa": {
        name: "Manisa",
        description: "Ege Bölgesi'nde, üzümü ve tarihiyle bilinen bir şehirdir.",
        location: "Ege Bölgesi",
        population: "1.4 milyon",
        attractions: ["Spil Dağı", "Aigai Antik Kenti", "Sardes"]
    },
    "Kahramanmaraş": {
        name: "Kahramanmaraş",
        description: "Akdeniz ile Doğu Anadolu'nun kesişiminde, dondurmasıyla ünlü.",
        location: "Akdeniz Bölgesi",
        population: "1.1 milyon",
        attractions: ["Kahramanmaraş Kalesi", "Eshab-ı Kehf", "Yedikuyular Kayak Merkezi"]
    },
    "Mardin": {
        name: "Mardin",
        description: "Güneydoğu Anadolu'da, taş evleri ve tarihi dokusuyla ünlü.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "862 bin",
        attractions: ["Mardin Taş Evleri", "Deyrulzafaran Manastırı", "Zinciriye Medresesi"]
    },
    "Muğla": {
        name: "Muğla",
        description: "Ege'nin güneyinde, turistik sahilleriyle ünlü bir şehirdir.",
        location: "Ege Bölgesi",
        population: "1 milyon",
        attractions: ["Bodrum", "Fethiye", "Marmaris"]
    },
    "Muş": {
        name: "Muş",
        description: "Doğu Anadolu'da, lalesiyle ve tarihiyle bilinen bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "408 bin",
        attractions: ["Muş Ovası", "Malazgirt Meydanı", "Murat Köprüsü"]
    },
    "Nevşehir": {
        name: "Nevşehir",
        description: "Kapadokya'nın merkezi, peribacalarıyla ünlü bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "304 bin",
        attractions: ["Göreme", "Ürgüp", "Derinkuyu Yeraltı Şehri"]
    },
    "Niğde": {
        name: "Niğde",
        description: "İç Anadolu'nun güneyinde, tarihi ve doğal güzellikleriyle bilinir.",
        location: "İç Anadolu Bölgesi",
        population: "364 bin",
        attractions: ["Niğde Kalesi", "Gümüşler Manastırı", "Aladağlar"]
    },
    "Ordu": {
        name: "Ordu",
        description: "Karadeniz kıyısında, fındığı ve yaylalarıyla ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "761 bin",
        attractions: ["Boztepe", "Yason Burnu", "Perşembe Yaylası"]
    },
    "Rize": {
        name: "Rize",
        description: "Karadeniz'in doğusunda, çayı ve yaylalarıyla ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "344 bin",
        attractions: ["Ayder Yaylası", "Zil Kalesi", "Fırtına Deresi"]
    },
    "Sakarya": {
        name: "Sakarya",
        description: "Marmara Bölgesi'nde, doğal güzellikleri ve sanayisiyle bilinen bir şehirdir.",
        location: "Marmara Bölgesi",
        population: "1 milyon",
        attractions: ["Sapanca Gölü", "Acarlar Longozu", "Taraklı"]
    },
    "Samsun": {
        name: "Samsun",
        description: "Karadeniz'in en büyük şehirlerinden, Atatürk'ün Samsun'a çıkışıyla ünlü.",
        location: "Karadeniz Bölgesi",
        population: "1.3 milyon",
        attractions: ["Bandırma Vapuru", "Amisos Tepesi", "Amazon Köyü"]
    },
    "Siirt": {
        name: "Siirt",
        description: "Güneydoğu Anadolu'da, fıstığı ve tarihiyle bilinen bir şehirdir.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "331 bin",
        attractions: ["Ulu Camii", "Veysel Karani Türbesi", "Botan Vadisi"]
    },
    "Sinop": {
        name: "Sinop",
        description: "Karadeniz'in en kuzeyinde, doğal limanı ve cezaeviyle ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "218 bin",
        attractions: ["Sinop Cezaevi", "Hamsilos Koyu", "İnceburun"]
    },
    "Sivas": {
        name: "Sivas",
        description: "İç Anadolu'nun doğusunda, tarihi ve kültürel zenginliğiyle bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "650 bin",
        attractions: ["Divriği Ulu Camii", "Gök Medrese", "Kangal Balıklı Kaplıca"]
    },
    "Tekirdağ": {
        name: "Tekirdağ",
        description: "Marmara'nın batısında, üzümü ve rakısıyla ünlü bir şehirdir.",
        location: "Marmara Bölgesi",
        population: "1.1 milyon",
        attractions: ["Rakoczi Müzesi", "Uçmakdere", "Şarköy"]
    },
    "Tokat": {
        name: "Tokat",
        description: "Karadeniz'in iç kısmında, tarihi ve doğal güzellikleriyle bilinen bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "602 bin",
        attractions: ["Ballıca Mağarası", "Tokat Kalesi", "Gök Medrese"]
    },
    "Trabzon": {
        name: "Trabzon",
        description: "Karadeniz'in doğusunda, Sümela Manastırı ve yaylalarıyla ünlü.",
        location: "Karadeniz Bölgesi",
        population: "816 bin",
        attractions: ["Sümela Manastırı", "Uzungöl", "Atatürk Köşkü"]
    },
    "Tunceli": {
        name: "Tunceli",
        description: "Doğu Anadolu'da, Munzur Vadisi ve doğal güzellikleriyle bilinen bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "84 bin",
        attractions: ["Munzur Vadisi", "Ovacık", "Pertek Kalesi"]
    },
    "Şanlıurfa": {
        name: "Şanlıurfa",
        description: "Güneydoğu Anadolu'da, peygamberler şehri olarak bilinir.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "2.1 milyon",
        attractions: ["Balıklıgöl", "Göbeklitepe", "Harran"]
    },
    "Uşak": {
        name: "Uşak",
        description: "Ege Bölgesi'nde, halıcılığı ve tarihiyle bilinen bir şehirdir.",
        location: "Ege Bölgesi",
        population: "370 bin",
        attractions: ["Ulubey Kanyonu", "Blaundus Antik Kenti", "Atatürk ve Etnografya Müzesi"]
    },
    "Van": {
        name: "Van",
        description: "Doğu Anadolu'da, Van Gölü ve kedisiyle ünlü bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "1.1 milyon",
        attractions: ["Van Gölü", "Akdamar Adası", "Van Kalesi"]
    },
    "Yozgat": {
        name: "Yozgat",
        description: "İç Anadolu'nun ortasında, termal kaynaklarıyla bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "418 bin",
        attractions: ["Yozgat Çamlığı", "Kerkenes Harabeleri", "Sarıkaya Roma Hamamı"]
    },
    "Zonguldak": {
        name: "Zonguldak",
        description: "Karadeniz kıyısında, kömür madenciliğiyle bilinen bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "591 bin",
        attractions: ["Gökgöl Mağarası", "Filyos Kalesi", "Ereğli"]
    },
    "Aksaray": {
        name: "Aksaray",
        description: "İç Anadolu'da, Ihlara Vadisi ve tarihiyle bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "429 bin",
        attractions: ["Ihlara Vadisi", "Aşıklı Höyük", "Sultanhanı Kervansarayı"]
    },
    "Bayburt": {
        name: "Bayburt",
        description: "Karadeniz'in doğusunda, küçük ve tarihi bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "84 bin",
        attractions: ["Bayburt Kalesi", "Baksı Müzesi", "Dede Korkut Türbesi"]
    },
    "Karaman": {
        name: "Karaman",
        description: "İç Anadolu'nun güneyinde, tarihi ve kültürel zenginliğiyle bilinir.",
        location: "İç Anadolu Bölgesi",
        population: "254 bin",
        attractions: ["Karaman Kalesi", "Taşkale", "Manazan Mağaraları"]
    },
    "Kırıkkale": {
        name: "Kırıkkale",
        description: "İç Anadolu'da, sanayisiyle bilinen bir şehirdir.",
        location: "İç Anadolu Bölgesi",
        population: "278 bin",
        attractions: ["Silah Sanayi Müzesi", "Çeşnigir Köprüsü", "Hasandede Camii"]
    },
    "Batman": {
        name: "Batman",
        description: "Güneydoğu Anadolu'da, petrolü ve Hasankeyf ile bilinen bir şehirdir.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "620 bin",
        attractions: ["Hasankeyf", "Malabadi Köprüsü", "Batman Müzesi"]
    },
    "Şırnak": {
        name: "Şırnak",
        description: "Güneydoğu Anadolu'nun doğusunda, dağlık ve tarihi bir şehirdir.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "546 bin",
        attractions: ["Cudi Dağı", "Kasrik Boğazı", "Finik Kalesi"]
    },
    "Bartın": {
        name: "Bartın",
        description: "Karadeniz kıyısında, doğal plajları ve tarihiyle bilinen bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "202 bin",
        attractions: ["Amasra", "İnkumu", "Bartın Irmağı"]
    },
    "Ardahan": {
        name: "Ardahan",
        description: "Doğu Anadolu'nun kuzeyinde, yaylalarıyla ünlü küçük bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "97 bin",
        attractions: ["Çıldır Gölü", "Şeytan Kalesi", "Yalnızçam Yaylası"]
    },
    "Iğdır": {
        name: "Iğdır",
        description: "Doğu Anadolu'nun en doğusunda, verimli ovasıyla bilinen bir şehirdir.",
        location: "Doğu Anadolu Bölgesi",
        population: "203 bin",
        attractions: ["Ağrı Dağı", "Tuzluca Tuz Mağaraları", "Iğdır Gençlik Parkı"]
    },
    "Yalova": {
        name: "Yalova",
        description: "Marmara Denizi kıyısında, termal kaynaklarıyla ünlü bir şehirdir.",
        location: "Marmara Bölgesi",
        population: "282 bin",
        attractions: ["Termal Kaplıcaları", "Yürüyen Köşk", "Çınarcık"]
    },
    "Karabük": {
        name: "Karabük",
        description: "Karadeniz'in batısında, Safranbolu ile ünlü bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "252 bin",
        attractions: ["Safranbolu", "Yenice Ormanları", "Hadrianapolis"]
    },
    "Kilis": {
        name: "Kilis",
        description: "Güneydoğu Anadolu'da, küçük ve tarihi bir şehirdir.",
        location: "Güneydoğu Anadolu Bölgesi",
        population: "146 bin",
        attractions: ["Ravanda Kalesi", "Oylum Höyük", "Kilis Ulu Camii"]
    },
    "Osmaniye": {
        name: "Osmaniye",
        description: "Akdeniz Bölgesi'nde, doğal güzellikleriyle bilinen bir şehirdir.",
        location: "Akdeniz Bölgesi",
        population: "559 bin",
        attractions: ["Kastabala Antik Kenti", "Karatepe Aslantaş", "Toprakkale"]
    },
    "Düzce": {
        name: "Düzce",
        description: "Karadeniz ile Marmara arasında, doğal güzellikleriyle bilinen bir şehirdir.",
        location: "Karadeniz Bölgesi",
        population: "400 bin",
        attractions: ["Aydınpınar Şelalesi", "Güzeldere Şelalesi", "Akçakoca"]
    }
};

// Tüm şehirleri getir
router.get('/', async (req, res) => {
    try {
        const { data: cities, error } = await supabase
            .from('cities')
            .select('*')
            .order('name');

        if (error) throw error;
        res.json(cities);
    } catch (error) {
        console.error('Şehirler alınırken hata:', error);
        res.status(500).json({ error: 'Şehirler alınamadı' });
    }
});

// Şehirleri listele
router.get('/all', cityController.getCities);

// Şehrin yorumlarını getir
router.get('/:cityName/comments', async (req, res) => {
    try {
        const { cityName } = req.params;
        console.log('Şehir yorumları isteniyor:', cityName);
        
        // Önce şehir ID'sini bul
        console.log('Şehir ID\'si aranıyor...');
        const { data: city, error: cityError } = await supabase
            .from('cities')
            .select('id')
            .eq('name', cityName)
            .single();

        if (cityError) {
            console.error('Şehir bulunamadı:', cityError);
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        console.log('Şehir bulundu:', city);

        // Şehrin yorumlarını getir
        console.log('Yorumlar getiriliyor...');
        const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select(`
                *,
                profiles:user_id (
                    username
                )
            `)
            .eq('city_id', city.id)
            .order('created_at', { ascending: false });

        if (commentsError) {
            console.error('Yorumlar getirilirken hata:', commentsError);
            return res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
        }

        console.log('Yorumlar bulundu:', comments);

        // Kullanıcı adlarını ekle
        const commentsWithUsernames = comments.map(comment => ({
            ...comment,
            username: comment.profiles?.username || 'Anonim'
        }));

        console.log('Şehir yorumları gönderiliyor:', commentsWithUsernames);
        res.json(commentsWithUsernames);
    } catch (error) {
        console.error('Yorumlar getirilirken beklenmeyen hata:', error);
        console.error('Hata detayı:', error.message);
        console.error('Hata stack:', error.stack);
        res.status(500).json({ 
            error: 'Yorumlar getirilirken bir hata oluştu',
            details: error.message 
        });
    }
});

// Yorum ekle
router.post('/:cityName/comments', async (req, res) => {
    try {
        const { cityName } = req.params;
        const { content } = req.body;
        
        // Session token'ı al
        const sessionToken = req.cookies.sb_session;
        if (!sessionToken) {
            console.log('Session token bulunamadı');
            return res.status(401).json({ error: 'Oturum açmanız gerekiyor' });
        }

        console.log('Session token:', sessionToken);

        // Kullanıcı bilgilerini al
        const { data: { user }, error: sessionError } = await supabase.auth.getUser(sessionToken);
        if (sessionError) {
            console.error('Oturum hatası:', sessionError);
            return res.status(401).json({ error: 'Geçersiz oturum' });
        }

        if (!user) {
            console.error('Kullanıcı bulunamadı');
            return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
        }

        console.log('Kullanıcı bilgileri:', user);

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

        console.log('Şehir bulundu:', city);

        // Kullanıcı bilgilerini al
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('username')
            .eq('id', user.id)
            .single();

        if (userError) {
            console.error('Kullanıcı bilgileri alınamadı:', userError);
            return res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı' });
        }

        console.log('Kullanıcı bilgileri alındı:', userData);

        // Yorumu ekle
        const commentData = {
            city_id: city.id,
            user_id: user.id,
            content: content,
            created_at: new Date().toISOString()
        };

        console.log('Eklenecek yorum:', commentData);

        const { data: comment, error: commentError } = await supabase
            .from('comments')
            .insert([commentData])
            .select()
            .single();

        if (commentError) {
            console.error('Yorum eklenirken hata:', commentError);
            console.error('Hata detayı:', commentError.message);
            console.error('Hata kodu:', commentError.code);
            return res.status(500).json({ 
                error: 'Yorum eklenemedi',
                details: commentError.message
            });
        }

        // Yorumu kullanıcı adıyla birlikte döndür
        const commentWithUsername = {
            ...comment,
            username: userData.username || 'Anonim'
        };

        console.log('Yorum eklendi:', commentWithUsername);
        res.status(201).json(commentWithUsername);
    } catch (error) {
        console.error('Yorum eklenirken beklenmeyen hata:', error);
        console.error('Hata detayı:', error.message);
        console.error('Hata stack:', error.stack);
        res.status(500).json({ 
            error: 'Yorum eklenirken bir hata oluştu',
            details: error.message
        });
    }
});

// Şehir detaylarını getir
router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        console.log('Şehir detayları isteniyor:', name);

        const { data: city, error } = await supabase
            .from('cities')
            .select('*')
            .eq('name', name)
            .single();

        if (error) {
            console.error('Şehir bulunamadı:', error);
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        if (!city) {
            return res.status(404).json({ error: 'Şehir bulunamadı' });
        }

        console.log('Şehir detayları gönderiliyor:', city);
        res.json(city);
    } catch (error) {
        console.error('Şehir detayları alınırken hata:', error);
        res.status(500).json({ error: 'Şehir detayları alınamadı' });
    }
});

// Yeni şehir ekle
router.post('/', async (req, res) => {
    try {
        const { name, description, location, population, attractions } = req.body;

        const { data: city, error } = await supabase
            .from('cities')
            .insert([
                {
                    name,
                    description,
                    location,
                    population,
                    attractions
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(city);
    } catch (error) {
        console.error('Şehir eklenirken hata:', error);
        res.status(500).json({ error: 'Şehir eklenemedi' });
    }
});

module.exports = router; 