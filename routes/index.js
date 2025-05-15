const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const cityController = require('../controllers/cityController');
const placeController = require('../controllers/placeController');
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middlewares/auth');

// Ana sayfa
router.get('/', cityController.getCities);

// Auth routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);
router.get('/logout', authController.logout);

// City routes
router.post('/cities', isAuthenticated, cityController.createCity);
router.get('/cities/:id', cityController.getCityDetails);

// Place routes
router.post('/places', isAuthenticated, placeController.createPlace);

// Comment routes
router.post('/comments', isAuthenticated, commentController.createComment);

module.exports = router; 