import { validationResult } from 'express-validator';
import Listing from '../models/listingModel.js';
import Proposal from '../models/proposalModel.js';
import User from '../models/userModel.js';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ status: 'open' })
      .populate('owner', 'name')
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform to match expected format
    const formattedListings = listings.map(listing => ({
      ...listing,
      owner_name: listing.owner?.name,
      created_at: listing.createdAt,
      updated_at: listing.updatedAt
    }));
    
    res.json(formattedListings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'name')
      .lean();

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    // Transform to match expected format
    const formattedListing = {
      ...listing,
      owner_name: listing.owner?.name,
      created_at: listing.createdAt,
      updated_at: listing.updatedAt
    };
    
    res.json(formattedListing);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Business only)
export const createListing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, budget_min, budget_max, deadline, tags } = req.body;
    const owner = req.user.id;

    const listing = new Listing({
      owner,
      title,
      description,
      budget_min,
      budget_max,
      deadline,
      tags: tags || []
    });

    await listing.save();
    
    res.status(201).json({ id: listing.id, message: 'Listing created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a proposal to a listing
// @route   POST /api/listings/:id/proposals
// @access  Private (Designer only)
export const createProposal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const listing = req.params.id;
    const designer = req.user.id;
    const { message, price_offered, delivery_time } = req.body;

    const existingProposal = await Proposal.findOne({ listing, designer });

    if (existingProposal) {
      return res.status(409).json({ error: 'You have already submitted a proposal for this listing.' });
    }

    const proposal = new Proposal({
      listing,
      designer,
      message,
      price_offered,
      delivery_time
    });

    await proposal.save();

    res.status(201).json({ message: 'Proposal submitted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposals for a specific listing
// @route   GET /api/listings/:id/proposals
// @access  Private (Listing Owner only)
export const getProposalsForListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const userId = req.user.id;

    // First, verify that the current user owns this listing
    const listing = await Listing.findById(listingId).select('owner');
    if (!listing || listing.owner.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to view proposals for this listing.' });
    }

    // If authorized, fetch all proposals with populated designer data
    const proposals = await Proposal.find({ listing: listingId })
      .populate('designer', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Transform to match expected format
    const formattedProposals = proposals.map(prop => ({
      id: prop._id,
      designer_id: prop.designer._id,
      designer_name: prop.designer.name,
      message: prop.message,
      price_offered: prop.price_offered,
      delivery_time: prop.delivery_time,
      created_at: prop.createdAt
    }));

    res.json(formattedProposals);
  } catch (error) {
    console.error("Error fetching proposals:", error);
    next(error);
  }
};