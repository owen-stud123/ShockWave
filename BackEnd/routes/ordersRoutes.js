import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/ordersController.js';
import { createProgressUpdate } from '../controllers/progressUpdateController.js';

const router = express.Router();

const createOrderValidation = [
  body('proposal_id').isMongoId().withMessage('Valid proposal ID is required')
];

const updateStatusValidation = [
  body('status').isIn(['delivered', 'completed', 'cancelled']).withMessage('Invalid status value')
];

const createUpdateValidation = [
    body('message').notEmpty().trim().withMessage('An update message is required.')
];

// Order Management
router.post('/', authenticateToken, requireRole(['business']), createOrderValidation, createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);
router.patch('/:id/status', authenticateToken, updateStatusValidation, updateOrderStatus);

// Progress Updates (nested under an order)
router.post('/:orderId/updates', authenticateToken, requireRole(['designer']), createUpdateValidation, createProgressUpdate);

export default router;