const { Review, Product, User } = require('../models');

// Create a review for a product
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existing = await Review.findOne({ where: { productId, userId: req.userId } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      productId,
      userId: req.userId,
      rating,
      comment
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'profilePhoto'] }]
    });

    res.status(201).json({ success: true, review: fullReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews for a specific product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { productId: req.params.productId },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'profilePhoto'] }],
      order: [['createdAt', 'DESC']]
    });

    const averageRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.status(200).json({ success: true, reviews, averageRating, totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a review (by owner or admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.userId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await review.destroy();
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
