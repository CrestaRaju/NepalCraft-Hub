module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    buyerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    totalAmountNPR: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    totalAmountGBP: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    vatAmountGBP: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    shippingFeeGBP: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    status: {
      type: Sequelize.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending'
    },
    shippingAddress: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    trackingNumber: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return Order;
};
