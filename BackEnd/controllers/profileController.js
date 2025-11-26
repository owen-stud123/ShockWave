import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import PortfolioItem from '../models/portfolioItemModel.js';

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

    const reviewStats = await Review.aggregate([
      { $match: { reviewee: user._id } },
      { $group: {
        _id: null,
        avg_rating: { $avg: '$rating' },
        review_count: { $sum: 1 }
      }}
    ]);
    
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
      portfolio_items: portfolioItems
    };

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's profile
// @route   PUT /api/profiles/:id
// @access  Private
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
    
    await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search for designer profiles
// @route   GET /api/profiles
// @access  Public
export const searchProfiles = async (req, res, next) => {
  try {
    const {
      search = '',
      skill = '',
      location = '',
      min_rate = '',
      max_rate = '',
      page = 1,
      limit = 20
    } = req.query;

    const matchConditions = {
      is_active: true,
      role: 'designer'
    };

    // Use MongoDB text search for search query (much faster than regex)
    if (search) {
      matchConditions.$text = { $search: search };
    }
    
    // Use regex only for specific field filters (location, skill)
    if (skill) {
      matchConditions['profile.skills'] = { $regex: `^${skill}$`, $options: 'i' };
    }
    if (location) {
      matchConditions['profile.location'] = { $regex: location, $options: 'i' };
    }
    
    if (min_rate || max_rate) {
        matchConditions['profile.hourly_rate'] = {};
        if (min_rate) matchConditions['profile.hourly_rate'].$gte = parseFloat(min_rate);
        if (max_rate) matchConditions['profile.hourly_rate'].$lte = parseFloat(max_rate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(matchConditions);
    
    // Add text score for sorting when using text search
    const projection = search 
      ? { name: 1, role: 1, profile: 1, score: { $meta: 'textScore' } }
      : { name: 1, role: 1, profile: 1 };
    
    const users = await User.find(matchConditions, projection)
      .sort(search ? { score: { $meta: 'textScore' } } : { created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Enhance profiles with review stats
    const profiles = await Promise.all(users.map(async (user) => {
      const reviewStats = await Review.aggregate([
        { $match: { reviewee: user._id } },
        { $group: {
          _id: null,
          avg_rating: { $avg: '$rating' },
          review_count: { $sum: 1 }
        }}
      ]);

      return {
        user_id: user._id,
        name: user.name,
        avatar_url: user.profile?.avatar_url || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills || [],
        location: user.profile?.location || '',
        hourly_rate: user.profile?.hourly_rate,
        avg_rating: reviewStats[0]?.avg_rating ? parseFloat(reviewStats[0].avg_rating).toFixed(1) : null,
        review_count: reviewStats[0]?.review_count || 0
      };
    }));
    
    res.json({ 
      profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + users.length < total
      }
    });
  } catch (error) {
    next(error);
  }
};