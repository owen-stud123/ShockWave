import { validationResult } from 'express-validator';
import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';

// @desc    Create a new review for an order
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const reviewerId = req.user.id;
    const { order_id, reviewee_id, rating, comment } = req.body;

    const order = await Order.findById(order_id);

    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.status !== 'completed') return res.status(400).json({ error: 'You can only review completed orders.' });

    const isParticipant = order.buyer.toString() === reviewerId || order.seller.toString() === reviewerId;
    const isValidReviewee = reviewee_id === order.buyer.toString() || reviewee_id === order.seller.toString();
    if (!isParticipant || !isValidReviewee || reviewerId === reviewee_id) {
        return res.status(403).json({ error: 'You are not authorized to submit this review.' });
    }
   
    const existingReview = await Review.findOne({ order: order_id, reviewer: reviewerId });
    if (existingReview) {
      return res.status(409).json({ error: 'You have already submitted a review for this order.' });
    }

    const review = new Review({
      order: order_id,
      reviewer: reviewerId,
      reviewee: reviewee_id,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: 'Review submitted successfully.', review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
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
    next(error);
  }
};    