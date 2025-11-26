import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { 
    uploadAvatar, 
    uploadPortfolioItem,
    deletePortfolioItem
} from '../controllers/uploadController.js';

const router = express.Router();

// Avatar upload (all users)
router.post('/avatar', authenticateToken, uploadLimiter, uploadAvatar);

// Portfolio item upload (designers only)
router.post('/portfolio', authenticateToken, uploadLimiter, requireRole(['designer']), uploadPortfolioItem);

// Portfolio item deletion (designers only)
router.delete('/portfolio/:id', authenticateToken, requireRole(['designer']), deletePortfolioItem);

export default router;