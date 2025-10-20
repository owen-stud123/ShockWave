import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get profile by ID
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;

    const profile = db.prepare(`
      SELECT 
        p.*,
        u.name,
        u.email,
        u.role,
        u.created_at as user_created_at
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? AND u.is_active = 1
    `).get(id);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Parse JSON fields
    profile.skills = JSON.parse(profile.skills || '[]');
    profile.portfolio_urls = JSON.parse(profile.portfolio_urls || '[]');
    profile.social_links = JSON.parse(profile.social_links || '{}');

    // If not the profile owner, hide sensitive info
    if (!req.user || req.user.id !== parseInt(id)) {
      delete profile.email;
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/:id', authenticateToken, [
  body('bio').optional().isLength({ max: 1000 }),
  body('skills').optional().isArray(),
  body('location').optional().isLength({ max: 100 }),
  body('hourly_rate').optional().isFloat({ min: 0 }),
  body('portfolio_urls').optional().isArray(),
  body('social_links').optional().isObject()
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    
    // Check if user owns this profile
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const {
      bio,
      skills,
      location,
      hourly_rate,
      portfolio_urls,
      social_links
    } = req.body;

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
    const values = Object.values(updates);
    values.push(id);

    db.prepare(`UPDATE profiles SET ${setPart} WHERE user_id = ?`).run(...values);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Search profiles
router.get('/', (req, res) => {
  try {
    const {
      search = '',
      skill = '',
      location = '',
      min_rate = 0,
      max_rate = 10000,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        p.user_id,
        p.bio,
        p.skills,
        p.location,
        p.hourly_rate,
        p.avatar_url,
        u.name,
        u.role,
        AVG(r.rating) as avg_rating,
        COUNT(DISTINCT o.id) as completed_orders
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN reviews r ON r.reviewee_id = p.user_id
      LEFT JOIN orders o ON o.seller_id = p.user_id AND o.status = 'completed'
      WHERE u.is_active = 1
    `;

    const params = [];

    if (search) {
      query += ` AND (u.name LIKE ? OR p.bio LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (skill) {
      query += ` AND p.skills LIKE ?`;
      params.push(`%${skill}%`);
    }

    if (location) {
      query += ` AND p.location LIKE ?`;
      params.push(`%${location}%`);
    }

    query += ` AND p.hourly_rate BETWEEN ? AND ?`;
    params.push(min_rate, max_rate);

    query += ` GROUP BY p.user_id ORDER BY avg_rating DESC, completed_orders DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const profiles = db.prepare(query).all(...params);

    // Parse JSON fields
    profiles.forEach(profile => {
      profile.skills = JSON.parse(profile.skills || '[]');
      profile.avg_rating = profile.avg_rating ? parseFloat(profile.avg_rating).toFixed(1) : null;
    });

    res.json({
      profiles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: profiles.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search profiles error:', error);
    res.status(500).json({ error: 'Failed to search profiles' });
  }
});

export default router;