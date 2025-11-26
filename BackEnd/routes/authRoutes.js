import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('role').isIn(['designer', 'business', 'admin']).withMessage('Invalid role selected')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
];

const resetPasswordValidation = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Routes with rate limiting
router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logoutUser);
router.get('/me', authenticateToken, getMe);

// Email Verification and Password Reset
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', authLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password/:token', authLimiter, resetPasswordValidation, resetPassword);


export default router;