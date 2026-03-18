const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.get('/', verifyToken, orderController.getOrders);
router.get('/:id', verifyToken, orderController.getOrderById);
router.post('/', verifyToken, orderController.createOrder);
router.put('/:id/status', [verifyToken, isAdmin], orderController.updateOrderStatus);

module.exports = router;
