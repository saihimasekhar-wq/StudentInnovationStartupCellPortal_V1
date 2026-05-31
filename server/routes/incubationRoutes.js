const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createIncubation,
  getMyIncubations,
  getIncubationById,
} = require('../controllers/incubationController');

// Protected student routes
router.use(protect);
router.post('/', createIncubation);
router.get('/', getMyIncubations);
router.get('/:id', getIncubationById);

module.exports = router;
