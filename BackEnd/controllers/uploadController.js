import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../config/database.js';

// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    // Allow only images
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
}).single('avatar'); // Expects a single file with the field name 'avatar'

// @desc    Upload user avatar
// @route   POST /api/uploads/avatar
// @access  Private
export const uploadAvatar = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // Multer error (e.g., file size, file type)
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a file to upload.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    try {
      // Update the user's profile in the database with the new avatar URL
      db.prepare('UPDATE profiles SET avatar_url = ? WHERE user_id = ?')
        .run(avatarUrl, req.user.id);

      res.json({
        message: 'Avatar uploaded successfully',
        avatarUrl: avatarUrl
      });
    } catch (dbError) {
      next(dbError);
    }
  });
};