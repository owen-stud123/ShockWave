import jwt from 'jsonwebtoken';
import db from '../config/database.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user from database
    const user = db.prepare('SELECT id, email, role, name FROM users WHERE id = ? AND is_active = 1').get(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    req.user = user;
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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      const user = db.prepare('SELECT id, email, role, name FROM users WHERE id = ? AND is_active = 1').get(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
    next();
  });
};