module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    priceNPR: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false
    },
    provenanceStory: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    images: {
      type: Sequelize.TEXT, // Store as JSON string or comma-separated URLs
      allowNull: true
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    sellerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true
  });

  return Product;
};
