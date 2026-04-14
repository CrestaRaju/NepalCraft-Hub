const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const dialectOptions = {};
if (process.env.DB_SOCKET) {
  dialectOptions.socketPath = process.env.DB_SOCKET;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    dialectOptions,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models will be imported and defined here
db.User = require('./user.model')(sequelize, Sequelize);
db.Product = require('./product.model')(sequelize, Sequelize);
db.Order = require('./order.model')(sequelize, Sequelize);
db.OrderItem = require('./orderItem.model')(sequelize, Sequelize);
db.Payment = require('./payment.model')(sequelize, Sequelize);
db.Review = require('./review.model')(sequelize, Sequelize);
db.Shipment = require('./shipment.model')(sequelize, Sequelize);

// Relationships
// User - Product (Sellers)
db.User.hasMany(db.Product, { as: 'products', foreignKey: 'sellerId' });
db.Product.belongsTo(db.User, { as: 'seller', foreignKey: 'sellerId' });

// User - Order (Buyers)
db.User.hasMany(db.Order, { as: 'orders', foreignKey: 'buyerId' });
db.Order.belongsTo(db.User, { as: 'buyer', foreignKey: 'buyerId' });

// Order - OrderItem
db.Order.hasMany(db.OrderItem, { as: 'items', foreignKey: 'orderId' });
db.OrderItem.belongsTo(db.Order, { as: 'order', foreignKey: 'orderId' });

// Product - OrderItem
db.Product.hasMany(db.OrderItem, { as: 'orderItems', foreignKey: 'productId' });
db.OrderItem.belongsTo(db.Product, { as: 'product', foreignKey: 'productId' });

// Order - Payment
db.Order.hasOne(db.Payment, { as: 'payment', foreignKey: 'orderId' });
db.Payment.belongsTo(db.Order, { as: 'order', foreignKey: 'orderId' });

// Order - Shipment
db.Order.hasOne(db.Shipment, { as: 'shipment', foreignKey: 'orderId' });
db.Shipment.belongsTo(db.Order, { as: 'order', foreignKey: 'orderId' });

// Product - Review
db.Product.hasMany(db.Review, { as: 'reviews', foreignKey: 'productId' });
db.Review.belongsTo(db.Product, { as: 'product', foreignKey: 'productId' });

// User - Review
db.User.hasMany(db.Review, { as: 'reviews', foreignKey: 'userId' });
db.Review.belongsTo(db.User, { as: 'user', foreignKey: 'userId' });

module.exports = db;
