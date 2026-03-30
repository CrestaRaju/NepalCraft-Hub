const { User, Product, Order, Review } = require('../models');

// Get logged-in user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update logged-in user's profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address, provenanceStory, profilePhoto } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await user.update({ firstName, lastName, phoneNumber, address, provenanceStory, profilePhoto });

    const updated = await User.findByPk(req.userId, { attributes: { exclude: ['password'] } });
    res.status(200).json({ success: true, user: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a seller's public profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findOne({
      where: { id: req.params.id, role: 'seller' },
      attributes: { exclude: ['password', 'isActive'] },
      include: [
        {
          model: Product,
          as: 'products',
          include: [{ model: Review, as: 'reviews' }]
        }
      ]
    });
    if (!seller) return res.status(404).json({ success: false, message: 'Seller not found' });
    res.status(200).json({ success: true, seller });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
