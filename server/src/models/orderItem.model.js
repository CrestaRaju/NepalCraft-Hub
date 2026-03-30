module.exports = (sequelize, Sequelize) => {
  const OrderItem = sequelize.define('OrderItem', {
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
    productId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    priceAtPurchaseNPR: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return OrderItem;
};
