import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { createReview, getReviewsForUser } from '../controllers/reviewsController.js';

const router = express.Router();

const createReviewValidation = [
  body('order_id').isMongoId().withMessage('A valid Order ID is required.'),
  body('reviewee_id').isMongoId().withMessage('A valid Reviewee ID is required.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('comment').optional().isString().trim().isLength({ max: 1000 })
];

router.post('/', authenticateToken, createReviewValidation, createReview);
router.get('/user/:userId', getReviewsForUser);

export default router;