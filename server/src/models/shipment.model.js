module.exports = (sequelize, Sequelize) => {
  const Shipment = sequelize.define('Shipment', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    orderId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    carrier: {
      type: Sequelize.STRING, // e.g., 'DHL', 'Shippo'
      allowNull: false
    },
    trackingNumber: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('in_transit', 'out_for_delivery', 'delivered', 'failed'),
      defaultValue: 'in_transit'
    },
    estimatedDelivery: {
      type: Sequelize.DATE
    }
  }, {
    timestamps: true
  });

  return Shipment;
};
