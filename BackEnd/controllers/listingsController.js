import { validationResult } from 'express-validator';
import db from '../config/database.js';

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getAllListings = (req, res, next) => {
  try {
    // Basic query, can be expanded with pagination and filters
    const listings = db.prepare(`
      SELECT l.*, u.name as owner_name 
      FROM listings l
      JOIN users u ON l.owner_id = u.id
      WHERE l.status = 'open' 
      ORDER BY l.created_at DESC
    `).all();
    res.json(listings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = (req, res, next) => {
  try {
    const listing = db.prepare(`
      SELECT l.*, u.name as owner_name 
      FROM listings l
      JOIN users u ON l.owner_id = u.id
      WHERE l.id = ?
    `).get(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Business only)
export const createListing = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, budget_min, budget_max, deadline, tags } = req.body;
    const owner_id = req.user.id;

    const result = db.prepare(`
      INSERT INTO listings (owner_id, title, description, budget_min, budget_max, deadline, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(owner_id, title, description, budget_min, budget_max, deadline, JSON.stringify(tags || []));
    
    res.status(201).json({ id: result.lastInsertRowid, message: 'Listing created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a proposal to a listing
// @route   POST /api/listings/:id/proposals
// @access  Private (Designer only)
export const createProposal = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const listing_id = req.params.id;
    const designer_id = req.user.id;
    const { message, price_offered, delivery_time } = req.body;

    // Check if designer has already submitted a proposal
    const existingProposal = db.prepare(
      'SELECT id FROM proposals WHERE listing_id = ? AND designer_id = ?'
    ).get(listing_id, designer_id);

    if (existingProposal) {
      return res.status(409).json({ error: 'You have already submitted a proposal for this listing.' });
    }

    db.prepare(`
      INSERT INTO proposals (listing_id, designer_id, message, price_offered, delivery_time)
      VALUES (?, ?, ?, ?, ?)
    `).run(listing_id, designer_id, message, price_offered, delivery_time);

    res.status(201).json({ message: 'Proposal submitted successfully' });
  } catch (error) {
    next(error);
  }
};