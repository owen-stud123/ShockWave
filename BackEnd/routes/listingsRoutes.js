import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  getAllListings, 
  getListingById, 
  createListing,
  createProposal,
  getProposalsForListing
} from '../controllers/listingsController.js';

const router = express.Router();

// Validation Middleware
const createListingValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('budget_min').isFloat({ gt: 0 }).withMessage('Minimum budget must be a positive number'),
  body('budget_max').isFloat().custom((value, { req }) => {
    if (parseFloat(value) < parseFloat(req.body.budget_min)) {
      throw new Error('Maximum budget must be greater than or equal to the minimum budget.');
    }
    return true;
  }),
  body('deadline').optional().isISO8601().toDate(),
  body('tags').optional().isArray()
];

const createProposalValidation = [
  body('message').notEmpty().withMessage('A message is required for your proposal'),
  body('price_offered').isFloat({ gt: 0 }).withMessage('Offered price must be a positive number'),
  body('delivery_time').isInt({ gt: 0 }).withMessage('Delivery time must be a positive number of days')
];

// --- Listing Routes ---
router.get('/', getAllListings);
router.get('/:id', getListingById);
router.post(
  '/', 
  authenticateToken, 
  requireRole(['business']), 
  createListingValidation,
  createListing
);

// --- Proposal Routes ---
// GET proposals for a listing (for the business owner)
router.get(
  '/:id/proposals',
  authenticateToken,
  requireRole(['business']),
  getProposalsForListing
);

// POST a proposal to a listing (for designers)
router.post(
  '/:id/proposals', 
  authenticateToken, 
  requireRole(['designer']), 
  createProposalValidation,
  createProposal
);

export default router;