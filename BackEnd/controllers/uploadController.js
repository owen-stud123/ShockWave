import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel.js';
import PortfolioItem from '../models/portfolioItemModel.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define allowed file types
const fileTypes = {
  avatar: /jpeg|jpg|png|gif|webp/,
  document: /jpeg|jpg|png|pdf|doc|docx/
};

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

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

    try {
      // Get user's current avatar URL to delete old one
      const user = await User.findById(req.user.id);
      const oldAvatarUrl = user?.profile?.avatar_url;
      
      // Upload to Cloudinary using upload_stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shockwave/avatars',
          public_id: `avatar_${req.user.id}_${Date.now()}`,
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Failed to upload image to cloud storage' });
          }

          const avatarUrl = result.secure_url;

          try {
            await User.findByIdAndUpdate(
              req.user.id,
              { $set: { 'profile.avatar_url': avatarUrl } }
            );
            
            // Delete old avatar from Cloudinary if it exists
            if (oldAvatarUrl && oldAvatarUrl.includes('cloudinary.com')) {
              try {
                const urlParts = oldAvatarUrl.split('/');
                const filename = urlParts[urlParts.length - 1].split('.')[0];
                const folder = urlParts.slice(-2, -1)[0];
                const publicId = `shockwave/${folder}/${filename}`;
                await cloudinary.uploader.destroy(publicId);
              } catch (cloudinaryError) {
                console.error('Failed to delete old avatar from Cloudinary:', cloudinaryError);
                // Don't fail the request if old image deletion fails
              }
            }
            
            res.json({ message: 'Avatar uploaded successfully', avatarUrl });
          } catch (dbError) {
            next(dbError);
          }
        }
      );

      // Pipe the buffer to Cloudinary
      uploadStream.end(req.file.buffer);
    } catch (uploadError) {
      next(uploadError);
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

    const file_type = path.extname(req.file.originalname).substring(1);

    try {
      // Upload to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shockwave/portfolio',
          public_id: `portfolio_${req.user.id}_${Date.now()}`,
          resource_type: 'auto', // Handles images, videos, and PDFs
          transformation: file_type !== 'pdf' ? [
            { width: 1200, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ] : undefined
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ error: 'Failed to upload file to cloud storage' });
          }

          const file_url = result.secure_url;

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
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (uploadError) {
      next(uploadError);
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
        
        // Delete from Cloudinary if URL is from Cloudinary
        if (item.file_url && item.file_url.includes('cloudinary.com')) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = item.file_url.split('/');
                const filename = urlParts[urlParts.length - 1].split('.')[0];
                const folder = urlParts.slice(-2, -1)[0];
                const publicId = `shockwave/${folder}/${filename}`;
                
                // Use appropriate method based on file type
                if (item.file_type === 'pdf') {
                    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
                } else {
                    await cloudinary.uploader.destroy(publicId);
                }
            } catch (cloudinaryError) {
                console.error('Failed to delete from Cloudinary:', cloudinaryError);
                // Continue with database deletion even if Cloudinary deletion fails
            }
        }
        
        await item.deleteOne();
        
        res.json({ message: 'Portfolio item deleted successfully' });
        
    } catch (error) {
        next(error);
    }
};