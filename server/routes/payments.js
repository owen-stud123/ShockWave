import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create payment intent
router.post('/checkout', authenticateToken, (req, res) => {
  res.json({ message: 'Payment checkout - TODO' });
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  res.json({ message: 'Payment webhook - TODO' });
});

export default router;