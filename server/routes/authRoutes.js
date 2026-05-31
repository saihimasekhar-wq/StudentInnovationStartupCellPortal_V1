const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserNotifications } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/notifications', protect, getUserNotifications);

module.exports = router;
