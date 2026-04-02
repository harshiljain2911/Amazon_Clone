import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'amazon_clone_products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// @desc    Upload image to Cloudinary and return URL
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, isAdmin, (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: `Upload Error: ${err.message}` });
    }
    
    // Everything is fine, check if file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: req.file.path,
    });
  });
});

export default router;
