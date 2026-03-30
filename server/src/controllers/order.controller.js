const { Order, OrderItem, Product, User, Payment, Shipment } = require('../models');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: req.userRole === 'buyer' ? { buyerId: req.userId } : {},
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: Payment, as: 'payment' },
        { model: Shipment, as: 'shipment' }
      ]
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
        { model: Payment, as: 'payment' },
        { model: Shipment, as: 'shipment' }
      ]
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Check ownership
    if (order.buyerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  const transaction = await Order.sequelize.transaction();
  try {
    const { items, totalAmountNPR, totalAmountGBP, vatAmountGBP, shippingFeeGBP, shippingAddress } = req.body;

    const order = await Order.create({
      buyerId: req.userId,
      totalAmountNPR,
      totalAmountGBP,
      vatAmountGBP,
      shippingFeeGBP,
      shippingAddress,
      status: 'pending'
    }, { transaction });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product?.name || item.productId}`);
      }

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchaseNPR: product.priceNPR
      }, { transaction });

      // Update stock
      await product.update({ stock: product.stock - item.quantity }, { transaction });
    }

    await transaction.commit();
    res.status(201).json({ success: true, order });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow admin or seller (if it's their product) to update status
    // For simplicity, only allow admin or buyer for now, but in reality, sellers should update their portion
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await order.update({ status });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
