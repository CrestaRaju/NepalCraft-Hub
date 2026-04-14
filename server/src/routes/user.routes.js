const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Get logged-in user's profile
router.get('/profile', verifyToken, userController.getProfile);

// Update logged-in user's profile
router.put('/profile', verifyToken, userController.updateProfile);

// Get a seller's public profile (public)
router.get('/seller/:id', userController.getSellerProfile);

module.exports = router;
