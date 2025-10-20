import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all listings
router.get('/', (req, res) => {
  res.json({ message: 'Get listings - TODO' });
});

// Create listing
router.post('/', authenticateToken, requireRole(['business']), (req, res) => {
  res.json({ message: 'Create listing - TODO' });
});

// Get listing by ID
router.get('/:id', (req, res) => {
  res.json({ message: 'Get listing - TODO' });
});

// Update listing
router.put('/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Update listing - TODO' });
});

// Delete listing
router.delete('/:id', authenticateToken, (req, res) => {
  res.json({ message: 'Delete listing - TODO' });
});

// Submit proposal to listing
router.post('/:id/proposals', authenticateToken, requireRole(['designer']), (req, res) => {
  res.json({ message: 'Submit proposal - TODO' });
});

export default router;