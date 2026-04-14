const { Payment, Order } = require('../models');

exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentId, amount, currency } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Mock Stripe payment success
    const payment = await Payment.create({
      orderId,
      paymentId: paymentId || 'pi_mock_' + Math.random().toString(36).substr(2, 9),
      amount,
      currency: currency || 'GBP',
      status: 'succeeded'
    });

    await order.update({ status: 'paid' });

    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
