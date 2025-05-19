const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const cityRoutes = require('./cityRoutes');
const commentRoutes = require('./commentRoutes');

router.use('/auth', authRoutes);
router.use('/cities', cityRoutes);
router.use('/comments', commentRoutes);

module.exports = router; 