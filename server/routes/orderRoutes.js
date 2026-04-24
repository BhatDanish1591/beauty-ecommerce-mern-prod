const express = require('express');
const { 
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    getOrders,
    updateOrderToShipped,
    updateOrderToDelivered 
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/ship').put(protect, admin, updateOrderToShipped);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
