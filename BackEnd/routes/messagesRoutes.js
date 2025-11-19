import express from 'express';
import { body } from 'express-validator';
import {
  sendMessage,
  getUserThreads,
  getMessagesInThread,
} from '../controllers/messagesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation chain for sending a message
const sendMessageValidation = [
  body('recipient_id').isMongoId().withMessage('Valid recipient ID is required'),
  body('body').trim().isLength({ min: 1 }).withMessage('Message cannot be empty'),
  body('attachments').optional().isArray(),
];

// Send a new message (creates thread automatically)
router.post('/', authenticateToken, sendMessageValidation, sendMessage);

// Get all conversation threads for the user
router.get('/threads', authenticateToken, getUserThreads);

// Get all messages in a specific thread
router.get('/:threadId', authenticateToken, getMessagesInThread);

export default router;