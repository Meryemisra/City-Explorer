const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// API Routes
router.post('/login', authController.login);
router.get('/check', authController.checkAuth);
router.post('/logout', authController.logout);

// Page Routes
router.get('/login', authController.getLogin);
router.get('/register', authController.getRegister);

// Debug middleware - API rotalarını logla
router.use((req, res, next) => {
    console.log('Auth Route:', {
        method: req.method,
        path: req.path,
        body: req.body
    });
    next();
});

module.exports = router; 