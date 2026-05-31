const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadConfig');
const {
  createStartup,
  getMyStartups,
  getStartupById,
  getPublicStartupById,
  updateStartup,
  deleteStartup,
} = require('../controllers/startupController');

// Upload fields for startup
const startupUploads = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'pitchDeck', maxCount: 1 },
]);

// Public route for approved showcases
router.get('/public/:id', getPublicStartupById);

// Protected student routes
router.use(protect);
router.post('/', startupUploads, createStartup);
router.get('/', getMyStartups);
router.get('/:id', getStartupById);
router.put('/:id', startupUploads, updateStartup);
router.delete('/:id', deleteStartup);

module.exports = router;
