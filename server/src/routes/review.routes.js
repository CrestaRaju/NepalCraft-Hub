const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Get reviews for a product (public)
router.get('/product/:productId', reviewController.getProductReviews);

// Create a review (authenticated buyers only)
router.post('/', [
  verifyToken,
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('comment').optional().isString()
], reviewController.createReview);

// Delete a review
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;
