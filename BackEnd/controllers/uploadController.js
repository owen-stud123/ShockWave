import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/userModel.js';
import PortfolioItem from '../models/portfolioItemModel.js'; // Import the new model

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Define allowed file types
const fileTypes = {
  avatar: /jpeg|jpg|png|gif/,
  document: /jpeg|jpg|png|pdf|doc|docx/
};

// Reusable storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Reusable file filter
const createFileFilter = (type) => (req, file, cb) => {
  const allowed = fileTypes[type];
  if (!allowed) {
    return cb(new Error('Invalid upload type specified.'));
  }
  const mimetype = allowed.test(file.mimetype);
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error(`File upload only supports the following filetypes: ${allowed}`));
};

// Specific upload middleware instances
const uploadAvatarMiddleware = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: createFileFilter('avatar')
}).single('avatar');

const uploadPortfolioMiddleware = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB
  fileFilter: createFileFilter('document')
}).single('file');


// @desc    Upload user avatar
// @route   POST /api/uploads/avatar
// @access  Private
export const uploadAvatar = (req, res, next) => {
  uploadAvatarMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a file to upload.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    try {
      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { 'profile.avatar_url': avatarUrl } }
      );
      res.json({ message: 'Avatar uploaded successfully', avatarUrl });
    } catch (dbError) {
      next(dbError);
    }
  });
};


// @desc    Upload a portfolio item
// @route   POST /api/uploads/portfolio
// @access  Private (Designer only)
export const uploadPortfolioItem = (req, res, next) => {
  uploadPortfolioMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a file to upload.' });
    }
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required for portfolio item.' });
    }

    const file_url = `/uploads/${req.file.filename}`;
    const file_type = path.extname(req.file.originalname).substring(1);

    try {
      const portfolioItem = new PortfolioItem({
        designer: req.user.id,
        title,
        description,
        file_url,
        file_type
      });
      await portfolioItem.save();

      res.status(201).json({ 
        message: 'Portfolio item uploaded successfully', 
        item: portfolioItem 
      });

    } catch (dbError) {
      next(dbError);
    }
  });
};


// @desc    Delete a portfolio item
// @route   DELETE /api/uploads/portfolio/:id
// @access  Private (Designer only)
export const deletePortfolioItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const designerId = req.user.id;
        
        const item = await PortfolioItem.findById(id);
        
        if (!item) {
            return res.status(404).json({ error: 'Portfolio item not found' });
        }
        
        if (item.designer.toString() !== designerId) {
            return res.status(403).json({ error: 'You are not authorized to delete this item' });
        }
        
        // Optional: Delete file from server filesystem
        const filePath = path.join(uploadDir, path.basename(item.file_url));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        await item.deleteOne();
        
        res.json({ message: 'Portfolio item deleted successfully' });
        
    } catch (error) {
        next(error);
    }
};