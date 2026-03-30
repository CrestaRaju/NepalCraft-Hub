const { Product, User, Review } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: User, as: 'seller', attributes: ['firstName', 'lastName', 'isVerified'] },
        { model: Review, as: 'reviews' }
      ]
    });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: User, as: 'seller', attributes: ['firstName', 'lastName', 'isVerified', 'provenanceStory'] },
        { model: Review, as: 'reviews', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }
      ]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, priceNPR, stock, category, provenanceStory, images } = req.body;
    const product = await Product.create({
      name,
      description,
      priceNPR,
      stock,
      category,
      provenanceStory,
      images: Array.isArray(images) ? images.join(',') : images,
      sellerId: req.userId
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if the user is the seller or admin
    if (product.sellerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await product.update(req.body);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await product.destroy();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
