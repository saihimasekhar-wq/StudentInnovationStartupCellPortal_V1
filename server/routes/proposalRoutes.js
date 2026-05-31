const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadConfig');
const {
  createProposal,
  getMyProposals,
  getProposalById,
  getPublicProposalById,
  updateProposal,
  deleteProposal,
} = require('../controllers/proposalController');

// Upload fields for proposal
const proposalUploads = upload.fields([
  { name: 'proposalDocument', maxCount: 1 },
  { name: 'supportingFiles', maxCount: 1 },
]);

// Public route for approved proposal details
router.get('/public/:id', getPublicProposalById);

// Protected routes
router.use(protect);
router.post('/', proposalUploads, createProposal);
router.get('/', getMyProposals);
router.get('/:id', getProposalById);
router.put('/:id', proposalUploads, updateProposal);
router.delete('/:id', deleteProposal);

module.exports = router;
