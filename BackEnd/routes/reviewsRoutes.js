import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { createReview, getReviewsForUser } from '../controllers/reviewsController.js';

const router = express.Router();

const createReviewValidation = [
  body('order_id').isInt().withMessage('Order ID must be an integer.'),
  body('reviewee_id').isInt().withMessage('Reviewee ID must be an integer.'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  body('comment').optional().isString().isLength({ max: 1000 })
];

router.post('/', authenticateToken, createReviewValidation, createReview);
router.get('/user/:userId', getReviewsForUser);

export default router;