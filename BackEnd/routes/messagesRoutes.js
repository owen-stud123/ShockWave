import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getMessageThreads, getMessagesInThread } from '../controllers/messagesController.js';

const router = express.Router();

// Get all message threads for the logged-in user
router.get('/threads', authenticateToken, getMessageThreads);

// Get messages in a thread with a specific user
router.get('/threads/:participantId', authenticateToken, getMessagesInThread);

// The POST for sending a message will be handled by Socket.IO,
// but you could add a RESTful endpoint here as a fallback.

export default router;