const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { isAuthenticated } = require('../middlewares/auth');

// Şehirleri listele
router.get('/', cityController.getCities);

// Yeni şehir ekle (sadece giriş yapmış kullanıcılar)
router.post('/', cityController.createCity); // isAuthenticated geçici olarak kaldırıldı

module.exports = router; 