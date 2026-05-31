const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  loginAdmin,
  getAdminStats,
  getUsersList,
  getUserDetails,
  deleteUser,
  getLoginHistory,
  getAllStartups,
  updateStartupStatus,
  getAllProposals,
  updateProposalStatus,
  getAllIncubations,
  updateIncubationStatus,
  getAllProgressLogs,
  createMentor,
  getMentorsList,
  updateMentor,
  deleteMentor,
  assignMentorToStartup,
  sendBroadNotification,
  exportDataReport,
} = require('../controllers/adminController');
const { adminSearch } = require('../controllers/searchController');

// Role check middleware
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Administrative privileges required.' });
  }
};

// Admin authentication (public)
router.post('/login', loginAdmin);

// Protected admin routes
router.use(protect);
router.use(adminProtect);

router.get('/stats', getAdminStats);
router.get('/users', getUsersList);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.get('/login-history', getLoginHistory);

router.get('/startups', getAllStartups);
router.put('/startups/:id/status', updateStartupStatus);

router.get('/proposals', getAllProposals);
router.put('/proposals/:id/status', updateProposalStatus);

router.get('/incubations', getAllIncubations);
router.put('/incubations/:id/status', updateIncubationStatus);

router.get('/progress', getAllProgressLogs);

router.post('/mentors', createMentor);
router.get('/mentors', getMentorsList);
router.put('/mentors/:id', updateMentor);
router.delete('/mentors/:id', deleteMentor);
router.post('/assign-mentor', assignMentorToStartup);

router.post('/notifications', sendBroadNotification);
router.get('/export/:type', exportDataReport);
router.get('/search', adminSearch);

module.exports = router;
