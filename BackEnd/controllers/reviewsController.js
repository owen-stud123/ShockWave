import { validationResult } from 'express-validator';
import db from '../config/database.js';

// @desc    Create a new review for an order
// @route   POST /api/reviews
// @access  Private
export const createReview = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const reviewer_id = req.user.id;
    const { order_id, reviewee_id, rating, comment } = req.body;
    // TODO: Verify that the reviewer is authorized to review this order.
    const result = db.prepare(`
      INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(order_id, reviewer_id, reviewee_id, rating, comment);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Review submitted successfully.' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'A review for this order has already been submitted.' });
    }
    next(error);
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getReviewsForUser = (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // --- THIS IS THE DEFINITIVE FIX ---
    // The query now explicitly selects `r.id` to avoid ambiguity.
    const reviews = db.prepare(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name as reviewer_name,
        p.avatar_url as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
    `).all(userId);

    res.json(reviews);
  } catch (error) {
    console.error("Error in getReviewsForUser:", error);
    next(error);
  }
};