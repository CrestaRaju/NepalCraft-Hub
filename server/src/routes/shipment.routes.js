const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipment.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

router.post('/', [verifyToken, isAdmin], shipmentController.createShipment);
router.get('/:orderId', verifyToken, shipmentController.getShipmentByOrder);

module.exports = router;
