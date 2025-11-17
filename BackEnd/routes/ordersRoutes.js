import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  getUserOrders,
  createOrder,
  getOrderById,
  updateOrderStatus
} from '../controllers/ordersController.js';

const router = express.Router();

// Validation middleware
const createOrderValidation = [
  body('proposal_id').isMongoId().withMessage('Valid proposal ID is required')
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'paid', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed'])
    .withMessage('Invalid status')
];

// Get user orders
router.get('/', authenticateToken, getUserOrders);

// Create order (accept proposal)
router.post('/', authenticateToken, requireRole(['business']), createOrderValidation, createOrder);

// Get order by ID
router.get('/:id', authenticateToken, getOrderById);

// Update order status
router.patch('/:id/status', authenticateToken, updateStatusValidation, updateOrderStatus);

export default router;