import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import PortfolioItem from '../models/portfolioItemModel.js'; // Import Portfolio model

// @desc    Get profile by user ID
// @route   GET /api/profiles/:id
// @access  Public
export const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, is_active: true })
      .select('name role profile created_at')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Get review statistics
    const reviewStats = await Review.aggregate([
      { $match: { reviewee: user._id } },
      { $group: {
        _id: null,
        avg_rating: { $avg: '$rating' },
        review_count: { $sum: 1 }
      }}
    ]);
    
    // Get portfolio items if the user is a designer
    let portfolioItems = [];
    if (user.role === 'designer') {
        portfolioItems = await PortfolioItem.find({ designer: user._id }).sort({ createdAt: -1 }).lean();
    }

    const profile = {
      user_id: user._id,
      ...user.profile,
      name: user.name,
      role: user.role,
      user_created_at: user.created_at,
      avg_rating: reviewStats[0]?.avg_rating || null,
      review_count: reviewStats[0]?.review_count || 0,
      portfolio_items: portfolioItems // Add portfolio items to the response
    };

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

//  Update a user's profile
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }
    const { bio, skills, location, hourly_rate, portfolio_urls, social_links } = req.body;
    const updates = {};
    if (bio !== undefined) updates['profile.bio'] = bio;
    if (skills !== undefined) updates['profile.skills'] = skills;
    if (location !== undefined) updates['profile.location'] = location;
    if (hourly_rate !== undefined) updates['profile.hourly_rate'] = hourly_rate;
    if (portfolio_urls !== undefined) updates['profile.portfolio_urls'] = portfolio_urls;
    if (social_links !== undefined) updates['profile.social_links'] = social_links;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Search for designer profiles
export const searchProfiles = async (req, res, next) => {
  try {
    // ... (existing code remains the same)
  } catch (error) {
    console.error('Error in searchProfiles:', error);
    next(error);
  }
};