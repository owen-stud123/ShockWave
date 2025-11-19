import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  getPlatformAnalytics,
  getAllMessageThreads,
  getMessagesForModeration,
  toggleFlagMessageThread,
} from '../controllers/adminController.js';

const router = express.Router();

// User management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

// Analytics
router.get('/analytics', getPlatformAnalytics);

// Content Moderation
router.get('/messages', getAllMessageThreads); // Get all threads
router.get('/messages/:threadId', getMessagesForModeration); // Get messages within a thread
router.patch('/messages/:threadId/flag', toggleFlagMessageThread); // Flag/unflag a thread

export default router;