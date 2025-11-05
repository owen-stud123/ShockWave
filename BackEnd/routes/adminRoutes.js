import express from 'express';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', requireRole(['admin']), (req, res) => {
  res.json({ message: 'Get all users - TODO' });
});

// Suspend/activate user
router.patch('/users/:id/suspend', requireRole(['admin']), (req, res) => {
  res.json({ message: 'Suspend user - TODO' });
});

// Get platform analytics
router.get('/analytics', requireRole(['admin']), (req, res) => {
  res.json({ message: 'Get analytics - TODO' });
});

export default router;