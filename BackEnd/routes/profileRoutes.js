import express from 'express';
import { body } from 'express-validator';
import { getProfileById, updateProfile, searchProfiles } from '../controllers/profileController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const updateProfileValidation = [
  body('bio').optional().isLength({ max: 1000 }),
  body('skills').optional().isArray(),
  body('location').optional().isLength({ max: 100 }),
  body('hourly_rate').optional().isFloat({ min: 0 }),
  body('portfolio_urls').optional().isArray(),
  body('social_links').optional().isObject()
];

router.get('/', searchProfiles);
router.get('/:id', optionalAuth, getProfileById);
router.put('/:id', authenticateToken, updateProfileValidation, updateProfile);

export default router;