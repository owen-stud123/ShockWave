import { validationResult } from 'express-validator';
import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

//  Create a new review for an order

export const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const reviewer = req.user.id;
    const { order_id, reviewee_id, rating, comment } = req.body;

    const order = await Order.findById(order_id).select('buyer seller status');

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const isParticipant = order.buyer.toString() === reviewer || order.seller.toString() === reviewer;
    const isCorrectReviewee = (order.buyer.toString() === reviewee_id || order.seller.toString() === reviewee_id) && reviewee_id !== reviewer;

    if (!isParticipant || !isCorrectReviewee) {
      return res.status(403).json({ error: 'You are not authorized to review this order.' });
    }

    if (order.status !== 'completed') {
        return res.status(403).json({ error: 'You can only review completed orders.' });
    }
   
    // Check if review already exists
    const existingReview = await Review.findOne({ order: order_id, reviewer });
    if (existingReview) {
      return res.status(409).json({ error: 'A review for this order has already been submitted by you.' });
    }

    const review = new Review({
      order: order_id,
      reviewer,
      reviewee: reviewee_id,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ id: review.id, message: 'Review submitted successfully.' });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(409).json({ error: 'A review for this order has already been submitted by you.' });
    }
    next(error);
  }
};

export const getReviewsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name profile.avatar_url')
      .sort({ createdAt: -1 })
      .lean();

    const formattedReviews = reviews.map(r => ({
      id: r._id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.createdAt,
      reviewer_name: r.reviewer.name,
      reviewer_avatar: r.reviewer.profile?.avatar_url || ''
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error("Error in getReviewsForUser:", error);
    next(error);
  }
};