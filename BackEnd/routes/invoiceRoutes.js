import express from 'express';
import { body } from 'express-validator';
import {
  createInvoice,
  getUserInvoices,
  getInvoiceById,
  markInvoiceAsPaid,
} from '../controllers/invoiceController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

const createInvoiceValidation = [
  body('order_id').isMongoId().withMessage('Valid order ID required'),
  body('due_date').optional().isISO8601().toDate(),
  body('notes').optional().isString().trim(),
];

// Designer creates invoice
router.post(
  '/',
  authenticateToken,
  requireRole(['designer']),
  createInvoiceValidation,
  createInvoice
);

// Get all invoices for user
router.get('/', authenticateToken, getUserInvoices);

// Get single invoice
router.get('/:id', authenticateToken, getInvoiceById);

// Business marks invoice as paid
router.patch('/:id/pay', authenticateToken, markInvoiceAsPaid);

export default router;