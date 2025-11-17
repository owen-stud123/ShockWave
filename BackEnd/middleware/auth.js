import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user from database
    const user = await User.findOne({ _id: decoded.userId, is_active: true })
      .select('id username role name')
      .lean();
    
    if (!user) {
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    req.user = { id: user._id.toString(), username: user.username, role: user.role, name: user.name };
    next();
  });
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      const user = await User.findOne({ _id: decoded.userId, is_active: true })
        .select('id username role name')
        .lean();
      if (user) {
        req.user = { id: user._id.toString(), username: user.username, role: user.role, name: user.name };
      }
    }
    next();
  });
};