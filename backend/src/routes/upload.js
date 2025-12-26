const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { requireAuth } = require('../shared/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and audio files
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed'), false);
    }
  }
});

// Upload file endpoint
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { type } = req.body; // 'hobby' or 'profile'
    
    // Determine resource type based on file mimetype
    const resourceType = req.file.mimetype.startsWith('image/') ? 'image' : 
                        req.file.mimetype.startsWith('audio/') ? 'video' : 'auto';

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: `nomore/${type}`,
          public_id: `${req.userId}_${Date.now()}`,
          transformation: resourceType === 'image' ? [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto:good' }
          ] : undefined
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(req.file.buffer);
    });

    res.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
      format: uploadResult.format,
      bytes: uploadResult.bytes
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    if (error.message === 'Only image and audio files are allowed') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Delete file endpoint
router.delete('/:publicId', requireAuth, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    // Verify the file belongs to the user (basic security check)
    if (!publicId.includes(req.userId)) {
      return res.status(403).json({ error: 'You can only delete your own files' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'File deletion failed' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  next(error);
});

module.exports = router;