import { validationResult } from 'express-validator';
import db from '../config/database.js';

// @desc    Get profile by user ID
// @route   GET /api/profiles/:id
// @access  Public
export const getProfileById = (req, res, next) => {
  try {
    const { id } = req.params;
    // We add a subquery to fetch review statistics
    const profile = db.prepare(`
      SELECT 
        p.*, 
        u.name, 
        u.role, 
        u.created_at as user_created_at,
        (SELECT AVG(rating) FROM reviews WHERE reviewee_id = p.user_id) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE reviewee_id = p.user_id) as review_count
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND u.is_active = 1
    `).get(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Parse JSON fields safely
    profile.skills = JSON.parse(profile.skills || '[]');
    profile.portfolio_urls = JSON.parse(profile.portfolio_urls || '[]');
    profile.social_links = JSON.parse(profile.social_links || '{}');

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's profile
// @route   PUT /api/profiles/:id
// @access  Private
export const updateProfile = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const { bio, skills, location, hourly_rate, portfolio_urls, social_links } = req.body;

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (skills !== undefined) updates.skills = JSON.stringify(skills);
    if (location !== undefined) updates.location = location;
    if (hourly_rate !== undefined) updates.hourly_rate = hourly_rate;
    if (portfolio_urls !== undefined) updates.portfolio_urls = JSON.stringify(portfolio_urls);
    if (social_links !== undefined) updates.social_links = JSON.stringify(social_links);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.updated_at = new Date().toISOString();
    const setPart = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    db.prepare(`UPDATE profiles SET ${setPart} WHERE user_id = ?`).run(...values);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search for designer profiles
// @route   GET /api/profiles
// @access  Public
export const searchProfiles = (req, res, next) => {
  try {
    const { search = '', skill = '', location = '', min_rate = 0, max_rate = 10000, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.user_id, p.bio, p.skills, p.location, p.hourly_rate, p.avatar_url,
        u.name, u.role, AVG(r.rating) as avg_rating, COUNT(DISTINCT o.id) as completed_orders
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN reviews r ON r.reviewee_id = p.user_id
      LEFT JOIN orders o ON o.seller_id = p.user_id AND o.status = 'completed'
      WHERE u.is_active = 1 AND u.role = 'designer'`;

    const params = [];

    if (search) {
      query += ` AND (u.name LIKE ? OR p.bio LIKE ? OR p.skills LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (skill) {
      query += ` AND p.skills LIKE ?`;
      params.push(`%${skill}%`);
    }
    if (location) {
      query += ` AND p.location LIKE ?`;
      params.push(`%${location}%`);
    }

    query += ` AND (p.hourly_rate >= ? AND p.hourly_rate <= ?)`;
    params.push(min_rate, max_rate);

    query += ` GROUP BY p.user_id ORDER BY avg_rating DESC, completed_orders DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const profiles = db.prepare(query).all(...params).map(p => ({
      ...p,
      skills: JSON.parse(p.skills || '[]'),
      avg_rating: p.avg_rating ? parseFloat(p.avg_rating).toFixed(1) : null
    }));

    res.json({
      profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: profiles.length === parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};