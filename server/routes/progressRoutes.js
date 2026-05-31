const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadConfig');
const {
  submitProgress,
  getStartupTimeline,
  reviewProgress,
} = require('../controllers/progressController');

// All routes protected
router.use(protect);

router.post('/', upload.single('evidence'), submitProgress);
router.get('/startup/:startupId', getStartupTimeline);
router.put('/:id/review', reviewProgress); // Triggers mentor authorization validation inside controller

module.exports = router;
