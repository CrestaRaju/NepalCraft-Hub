const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// All admin routes require token + admin role
router.use(verifyToken, isAdmin);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Product management
router.get('/products', adminController.getAllProducts);
router.put('/products/:id/verify', adminController.verifyProduct);

// Order management
router.get('/orders', adminController.getAllOrders);

module.exports = router;
