const { Shipment, Order } = require('../models');

exports.createShipment = async (req, res) => {
  try {
    const { orderId, carrier, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const shipment = await Shipment.create({
      orderId,
      carrier: carrier || 'DHL',
      trackingNumber: trackingNumber || 'TRK' + Math.random().toString(10).substr(2, 8),
      status: 'in_transit',
      estimatedDelivery: estimatedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.update({ status: 'shipped', trackingNumber: shipment.trackingNumber });

    res.status(201).json({ success: true, shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShipmentByOrder = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ where: { orderId: req.params.orderId } });
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.status(200).json({ success: true, shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
