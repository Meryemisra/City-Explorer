const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middlewares/auth');

// Yorumları listele
router.get('/cities/:cityId/comments', commentController.getComments);

// Yeni yorum ekle (sadece giriş yapmış kullanıcılar)
router.post('/cities/:cityId/comments', isAuthenticated, commentController.createComment);

module.exports = router; 