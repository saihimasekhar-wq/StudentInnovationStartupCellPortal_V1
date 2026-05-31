const Proposal = require('../models/Proposal');

// Mock data store for simulation mode
global.mockProposals = global.mockProposals || [];

/**
 * @desc    Create a new innovation proposal
 * @route   POST /api/proposals
 * @access  Private
 */
const createProposal = async (req, res) => {
  try {
    const {
      title,
      category,
      abstract,
      problemStatement,
      innovation,
      impact,
      technologies,
      teamMembers,
      department,
    } = req.body;

    if (!title || !category || !abstract || !problemStatement || !innovation || !impact || !technologies || !teamMembers || !department) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Retrieve file paths from multer
    let documentPath = '';
    let supportingPath = '';

    if (req.files) {
      if (req.files['proposalDocument'] && req.files['proposalDocument'][0]) {
        documentPath = `uploads/${req.files['proposalDocument'][0].filename}`;
      }
      if (req.files['supportingFiles'] && req.files['supportingFiles'][0]) {
        supportingPath = `uploads/${req.files['supportingFiles'][0].filename}`;
      }
    }

    if (global.isMockDB) {
      const mockId = 'proposal_' + Math.random().toString(36).substring(2, 9);
      const proposal = {
        _id: mockId,
        title,
        category,
        abstract,
        problemStatement,
        innovation,
        impact,
        technologies,
        teamMembers,
        department,
        proposalDocument: documentPath,
        supportingFiles: supportingPath,
        status: 'Pending',
        adminComment: '',
        submittedBy: req.user._id || req.user.id,
        createdAt: new Date(),
      };
      global.mockProposals.push(proposal);
      return res.status(201).json(proposal);
    }

    const proposal = await Proposal.create({
      title,
      category,
      abstract,
      problemStatement,
      innovation,
      impact,
      technologies,
      teamMembers,
      department,
      proposalDocument: documentPath,
      supportingFiles: supportingPath,
      submittedBy: req.user.id || req.user._id,
    });

    return res.status(201).json(proposal);
  } catch (error) {
    console.error('Create Proposal Error:', error);
    return res.status(500).json({ message: 'Server error creating proposal' });
  }
};

/**
 * @desc    Get logged in user's proposals
 * @route   GET /api/proposals
 * @access  Private
 */
const getMyProposals = async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      const list = global.mockProposals.filter(p => p.submittedBy.toString() === userId);
      return res.status(200).json(list);
    }

    const proposals = await Proposal.find({ submittedBy: userId });
    return res.status(200).json(proposals);
  } catch (error) {
    console.error('Get Proposals Error:', error);
    return res.status(500).json({ message: 'Server error retrieving proposals' });
  }
};

/**
 * @desc    Get proposal details by ID
 * @route   GET /api/proposals/:id
 * @access  Private
 */
const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      const proposal = global.mockProposals.find(p => p._id === id);
      if (!proposal) {
        return res.status(404).json({ message: 'Proposal not found' });
      }
      if (proposal.submittedBy.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this proposal' });
      }
      return res.status(200).json(proposal);
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.submittedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this proposal' });
    }

    return res.status(200).json(proposal);
  } catch (error) {
    console.error('Get Proposal Detail Error:', error);
    return res.status(500).json({ message: 'Server error fetching proposal details' });
  }
};

/**
 * @desc    Get public approved proposal details
 * @route   GET /api/proposals/public/:id
 * @access  Public
 */
const getPublicProposalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const proposal = global.mockProposals.find(p => p._id === id);
      if (!proposal || proposal.status !== 'Approved') {
        return res.status(404).json({ message: 'Proposal not found or not approved' });
      }
      return res.status(200).json(proposal);
    }

    const proposal = await Proposal.findById(id);
    if (!proposal || proposal.status !== 'Approved') {
      return res.status(404).json({ message: 'Approved proposal profile not found' });
    }

    return res.status(200).json(proposal);
  } catch (error) {
    console.error('Get Public Proposal Error:', error);
    return res.status(500).json({ message: 'Server error fetching public proposal' });
  }
};

/**
 * @desc    Update proposal by ID
 * @route   PUT /api/proposals/:id
 * @access  Private
 */
const updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();
    const updateData = { ...req.body };

    // File updates
    if (req.files) {
      if (req.files['proposalDocument'] && req.files['proposalDocument'][0]) {
        updateData.proposalDocument = `uploads/${req.files['proposalDocument'][0].filename}`;
      }
      if (req.files['supportingFiles'] && req.files['supportingFiles'][0]) {
        updateData.supportingFiles = `uploads/${req.files['supportingFiles'][0].filename}`;
      }
    }

    // Force status reset back to Pending upon update
    updateData.status = 'Pending';
    updateData.adminComment = '';

    if (global.isMockDB) {
      const index = global.mockProposals.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Proposal not found' });
      }
      if (global.mockProposals[index].submittedBy.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to modify this proposal' });
      }

      const updatedProposal = {
        ...global.mockProposals[index],
        ...updateData,
        updatedAt: new Date(),
      };

      global.mockProposals[index] = updatedProposal;
      return res.status(200).json(updatedProposal);
    }

    let proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.submittedBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to modify this proposal' });
    }

    proposal = await Proposal.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json(proposal);
  } catch (error) {
    console.error('Update Proposal Error:', error);
    return res.status(500).json({ message: 'Server error updating proposal' });
  }
};

/**
 * @desc    Delete proposal
 * @route   DELETE /api/proposals/:id
 * @access  Private
 */
const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      const index = global.mockProposals.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Proposal not found' });
      }
      if (global.mockProposals[index].submittedBy.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to remove this proposal' });
      }
      global.mockProposals.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Proposal deleted successfully' });
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.submittedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to remove this proposal' });
    }

    await Proposal.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Delete Proposal Error:', error);
    return res.status(500).json({ message: 'Server error deleting proposal' });
  }
};

module.exports = {
  createProposal,
  getMyProposals,
  getProposalById,
  getPublicProposalById,
  updateProposal,
  deleteProposal,
};
