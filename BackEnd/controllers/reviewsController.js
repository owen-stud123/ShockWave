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

    // TODO: Add logic to verify that the reviewer is authorized to review this order
    // For example, check if they are the buyer or seller of the completed order.

    const result = db.prepare(`
      INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `).run(order_id, reviewer_id, reviewee_id, rating, comment);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Review submitted successfully.' });
  } catch (error) {
    // Handle unique constraint error if a review for this order already exists
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
    const reviews = db.prepare(`
      SELECT r.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
    `).all(userId);

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};