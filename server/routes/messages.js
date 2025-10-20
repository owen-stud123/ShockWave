import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get message threads
router.get('/threads', authenticateToken, (req, res) => {
  res.json({ message: 'Get threads - TODO' });
});

// Get messages in thread
router.get('/threads/:id/messages', authenticateToken, (req, res) => {
  res.json({ message: 'Get messages - TODO' });
});

// Send message
router.post('/threads/:id/messages', authenticateToken, (req, res) => {
  res.json({ message: 'Send message - TODO' });
});

export default router;