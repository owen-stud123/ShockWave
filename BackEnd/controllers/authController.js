import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/userModel.js';
import { generateVerificationToken, generateResetToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Set refresh token cookie
const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // MUST be true for production (HTTPS)
      sameSite: 'none', // MUST be 'none' for cross-site cookies (Vercel + Render)
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    
    // Generate username from email
    const emailPrefix = email.split('@')[0];
    let username = emailPrefix.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Ensure username is unique
    let usernameExists = await User.findOne({ username });
    let counter = 1;
    while (usernameExists) {
      username = `${emailPrefix.replace(/[^a-zA-Z0-9]/g, '_')}${counter}`;
      usernameExists = await User.findOne({ username });
      counter++;
    }
    
    const verificationToken = generateVerificationToken();
    const newUser = new User({
      email,
      username,
      password_hash: password, // Will be hashed by userModel pre-save hook
      name,
      role,
      email_verification_token: verificationToken,
      email_verification_expires: Date.now() + 3600000, // 1 hour from now
    });

    await newUser.save();
    
    // --- UPDATE STARTS HERE ---
    try {
      console.log("Attempting to send email...");
      // Attempt to send email, but catch the error if it times out
      await sendVerificationEmail(newUser.email, verificationToken);
      console.log("Email sent successfully");
    } catch (emailError) {
      // If email fails, we log it but DO NOT crash the request
      console.error("⚠️ Email failed to send (likely Google blocking Render IP):", emailError.message);
    }
    // --- UPDATE ENDS HERE ---

    res.status(201).json({
      message: 'User created successfully! (Note: Email verification might be delayed due to server restrictions)',
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password_hash');

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials or account disabled' });
    }
    
    // if (!user.is_email_verified) {
    //     return res.status(403).json({ error: 'Please verify your email before logging in.' });
    // }

    const isValidPassword = user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.last_login = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user);

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      const user = await User.findOne({ _id: decoded.userId, is_active: true })
        .select('id email name role');
      
      if (!user) {
        return res.status(403).json({ error: 'User not found' });
      }

      const { accessToken } = generateTokens(user);
      res.json({ accessToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = (req, res) => {
  res.json({ user: req.user });
};


// @desc    Verify user email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            email_verification_token: token,
            email_verification_expires: { $gt: Date.now() },
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired verification token.' });
        }
        
        user.is_email_verified = true;
        user.email_verification_token = undefined;
        user.email_verification_expires = undefined;
        await user.save();
        
        res.json({ message: 'Email verified successfully. You can now log in.' });
        
    } catch (error) {
        next(error);
    }
};


// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User with that email does not exist.' });
        }
        
        const resetToken = generateResetToken();
        user.password_reset_token = resetToken;
        user.password_reset_expires = Date.now() + 3600000; // 1 hour
        await user.save();
        
        // Send password reset email
        await sendPasswordResetEmail(user.email, resetToken);
        
        res.json({ message: 'Password reset email sent. Please check your inbox.' });
        
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        const user = await User.findOne({
            password_reset_token: token,
            password_reset_expires: { $gt: Date.now() },
        });
        
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired password reset token.' });
        }
        
        // The pre-save hook in userModel will hash the password
        user.password_hash = password;
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;
        await user.save();
        
        res.json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        next(error);
    }
};