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
    
    const formattedListings = listings.map(listing => ({
      ...listing,
      id: listing._id,
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
    
    const formattedListing = {
      ...listing,
      id: listing._id,
      owner_id: listing.owner._id,
      owner_name: listing.owner?.name,
      created_at: listing.createdAt,
      updated_at: listing.updatedAt
    };
    
    res.json(formattedListing);
  } catch (error)
 {
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

    const { message, price_offered, delivery_time } = req.body;

    const proposal = new Proposal({
      listing: req.params.id,
      designer: req.user.id,
      message,
      price_offered,
      delivery_time
    });

    await proposal.save();
    res.status(201).json({ message: 'Proposal submitted successfully', proposal });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposals for a specific listing
// @route   GET /api/listings/:id/proposals
// @access  Private (Listing Owner only)
export const getProposalsForListing = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ listing: req.params.id })
      .populate('designer', 'name profile.avatar_url')
      .sort({ createdAt: -1 })
      .lean();
    res.json(proposals);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a proposal's status
// @route   PATCH /api/listings/:listingId/proposals/:proposalId
// @access  Private (Listing Owner only)
export const updateProposalStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const proposal = await Proposal.findByIdAndUpdate(req.params.proposalId, { status }, { new: true });
        res.json({ message: 'Proposal status updated', proposal });
    } catch (error) {
        next(error);
    }
};

// @desc    Bookmark or unbookmark a listing
// @route   POST /api/listings/:id/bookmark
// @access  Private (Designer only)
export const toggleBookmark = async (req, res, next) => {
    try {
        const listingId = req.params.id;
        const userId = req.user.id;
        
        const user = await User.findById(userId);
        
        if (!user.saved_listings) {
            user.saved_listings = [];
        }
        
        const isBookmarked = user.saved_listings.includes(listingId);
        
        if (isBookmarked) {
            // Remove from bookmarks
            user.saved_listings.pull(listingId);
        } else {
            // Add to bookmarks
            user.saved_listings.push(listingId);
        }
        
        await user.save();
        
        res.json({ 
            message: isBookmarked ? 'Project removed from bookmarks' : 'Project bookmarked successfully',
            isBookmarked: !isBookmarked
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookmarked listings for a user
// @route   GET /api/listings/bookmarked
// @access  Private (Designer only)
export const getBookmarkedListings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'saved_listings',
            model: 'Listing',
            populate: {
                path: 'owner',
                model: 'User',
                select: 'name'
            }
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const formattedListings = (user.saved_listings || []).map(listing => ({
            ...listing.toObject(),
            id: listing._id,
            owner_name: listing.owner?.name || 'Unknown'
        }));

        res.json(formattedListings);
        
    } catch (error) {
        next(error);
    }
};