import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { 
  getAllListings, 
  getListingById, 
  createListing,
  createProposal,
  getProposalsForListing,
  updateProposalStatus,
  toggleBookmark,
  getBookmarkedListings
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
];

const createProposalValidation = [
  body('message').notEmpty().withMessage('A message is required for your proposal'),
  body('price_offered').isFloat({ gt: 0 }).withMessage('Offered price must be a positive number'),
  body('delivery_time').isInt({ gt: 0 }).withMessage('Delivery time must be a positive number of days')
];

// --- Listing Routes ---
router.get('/', getAllListings);
router.get('/bookmarked', authenticateToken, requireRole(['designer']), getBookmarkedListings);
router.get('/:id', getListingById);
router.post(
  '/', 
  authenticateToken, 
  requireRole(['business']), 
  createListingValidation,
  createListing
);

// --- Bookmark Routes ---
router.post('/:id/bookmark', authenticateToken, requireRole(['designer']), toggleBookmark);

// --- Proposal Routes ---
router.get(
  '/:id/proposals',
  authenticateToken,
  requireRole(['business']),
  getProposalsForListing
);

router.post(
  '/:id/proposals', 
  authenticateToken, 
  requireRole(['designer']), 
  createProposalValidation,
  createProposal
);

router.patch(
  '/:listingId/proposals/:proposalId',
  authenticateToken,
  requireRole(['business']),
  updateProposalStatus
);

export default router;