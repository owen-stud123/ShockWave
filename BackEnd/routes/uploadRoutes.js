import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { uploadAvatar } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/avatar', authenticateToken, uploadAvatar);

// TODO: Add a route for uploading portfolio images
// router.post('/portfolio', authenticateToken, uploadPortfolioImages);

export default router;