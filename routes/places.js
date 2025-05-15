const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const { isAuthenticated } = require('../middlewares/auth');

// Gezilecek yerleri listele
router.get('/cities/:cityId/places', placeController.getPlaces);

// Yeni gezilecek yer ekle (sadece giriş yapmış kullanıcılar)
router.post('/cities/:cityId/places', isAuthenticated, placeController.createPlace);

module.exports = router; 