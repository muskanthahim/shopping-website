import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderByNumber
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/number/:orderNumber', getOrderByNumber);

export default router;
