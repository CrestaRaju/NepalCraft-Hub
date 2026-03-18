module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define('Payment', {
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
    paymentId: {
      type: Sequelize.STRING, // e.g., Stripe PaymentIntent ID
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING,
      defaultValue: 'GBP'
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'succeeded'
    }
  }, {
    timestamps: true
  });

  return Payment;
};
