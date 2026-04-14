const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isSeller } = require('../middleware/auth.middleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

router.post('/', [verifyToken, isSeller], productController.createProduct);
router.put('/:id', [verifyToken, isSeller], productController.updateProduct);
router.delete('/:id', [verifyToken, isSeller], productController.deleteProduct);

module.exports = router;
