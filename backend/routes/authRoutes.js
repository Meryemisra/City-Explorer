const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../middleware/authMiddleware');

// Login sayfası
router.get('/login', isNotAuthenticated, authController.getLogin);

// Register sayfası
router.get('/register', isNotAuthenticated, authController.getRegister);

// Login işlemi
router.post('/login', isNotAuthenticated, authController.login);

// Register işlemi
router.post('/register', isNotAuthenticated, authController.register);

// Logout işlemi
router.get('/logout', authController.logout);

module.exports = router; 