import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
  .post(addOrderItems)
  .get(admin, getOrders); // Only admin can get all orders

router.route('/myorders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/pay')
  .put(updateOrderToPaid);

router.route('/:id/status')
  .put(admin, updateOrderStatus); // Only admin can update order status

export default router;
