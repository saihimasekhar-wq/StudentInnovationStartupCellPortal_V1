const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadConfig');
const {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');

// Role protector inline
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
  }
};

// Public routes
router.get('/', getStories);
router.get('/:id', getStoryById);

// Admin-only routes
router.use(protect);
router.use(adminProtect);
router.post('/', upload.single('coverImage'), createStory);
router.put('/:id', upload.single('coverImage'), updateStory);
router.delete('/:id', deleteStory);

module.exports = router;
