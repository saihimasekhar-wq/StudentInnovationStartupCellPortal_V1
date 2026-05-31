const Incubation = require('../models/Incubation');
const Startup = require('../models/Startup');

// Mock data store for simulation mode
global.mockIncubations = global.mockIncubations || [];

/**
 * @desc    Submit a new incubation application
 * @route   POST /api/incubations
 * @access  Private
 */
const createIncubation = async (req, res) => {
  try {
    const {
      startupId,
      progress,
      fundingRequirement,
      whyIncubation,
      expectedSupport,
      futureGoals,
    } = req.body;

    if (!startupId || !progress || !fundingRequirement || !whyIncubation || !expectedSupport || !futureGoals) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const userId = (req.user.id || req.user._id).toString();

    // Verify startup exists, belongs to the student, and is APPROVED!
    if (global.isMockDB) {
      const startup = global.mockStartups.find(s => s._id === startupId);
      if (!startup) {
        return res.status(404).json({ message: 'Selected startup not found' });
      }
      if (startup.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'You do not own this startup' });
      }
      if (startup.status !== 'Approved') {
        return res.status(400).json({ message: 'Only Approved startups can apply for incubation space' });
      }

      // Check if already applied
      const alreadyApplied = global.mockIncubations.some(i => i.startupId === startupId && i.status === 'Pending');
      if (alreadyApplied) {
        return res.status(400).json({ message: 'An active incubation application for this startup is already pending review' });
      }

      const mockId = 'incubation_' + Math.random().toString(36).substring(2, 9);
      const incubation = {
        _id: mockId,
        startupId,
        startupName: startup.startupName, // Denormalized for easy display
        progress,
        fundingRequirement,
        whyIncubation,
        expectedSupport,
        futureGoals,
        status: 'Pending',
        adminComment: '',
        submittedBy: userId,
        createdAt: new Date(),
      };
      global.mockIncubations.push(incubation);
      return res.status(201).json(incubation);
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Selected startup not found' });
    }
    if (startup.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'You do not own this startup' });
    }
    if (startup.status !== 'Approved') {
      return res.status(400).json({ message: 'Only Approved startups can apply for incubation space' });
    }

    const alreadyApplied = await Incubation.findOne({ startupId, status: { $in: ['Pending', 'Under Review'] } });
    if (alreadyApplied) {
      return res.status(400).json({ message: 'An active incubation application for this startup is already pending review' });
    }

    const incubation = await Incubation.create({
      startupId,
      progress,
      fundingRequirement,
      whyIncubation,
      expectedSupport,
      futureGoals,
      submittedBy: userId,
    });

    return res.status(201).json(incubation);
  } catch (error) {
    console.error('Create Incubation Application Error:', error);
    return res.status(500).json({ message: 'Server error filing incubation application' });
  }
};

/**
 * @desc    Get logged in user's incubation applications
 * @route   GET /api/incubations
 * @access  Private
 */
const getMyIncubations = async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      // Hydrate startupName from global list
      const list = global.mockIncubations
        .filter(i => i.submittedBy === userId)
        .map(i => {
          const startup = global.mockStartups.find(s => s._id === i.startupId);
          return {
            ...i,
            startupName: startup ? startup.startupName : 'Unknown Startup',
          };
        });
      return res.status(200).json(list);
    }

    const incubations = await Incubation.find({ submittedBy: userId }).populate('startupId', 'startupName category stage');
    return res.status(200).json(incubations);
  } catch (error) {
    console.error('Get Incubations Error:', error);
    return res.status(500).json({ message: 'Server error retrieving applications' });
  }
};

/**
 * @desc    Get incubation application details
 * @route   GET /api/incubations/:id
 * @access  Private
 */
const getIncubationById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      const incubation = global.mockIncubations.find(i => i._id === id);
      if (!incubation) {
        return res.status(404).json({ message: 'Application not found' });
      }
      if (incubation.submittedBy !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this application' });
      }
      const startup = global.mockStartups.find(s => s._id === incubation.startupId);
      return res.status(200).json({
        ...incubation,
        startupName: startup ? startup.startupName : 'Unknown Startup',
        startupDetails: startup || null,
      });
    }

    const incubation = await Incubation.findById(id)
      .populate('startupId', 'startupName category description founderName stage fundingRequired email phone')
      .populate('submittedBy', 'fullName email department studentId');

    if (!incubation) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (incubation.submittedBy._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this application' });
    }

    return res.status(200).json(incubation);
  } catch (error) {
    console.error('Get Incubation details error:', error);
    return res.status(500).json({ message: 'Server error fetching incubation details' });
  }
};

module.exports = {
  createIncubation,
  getMyIncubations,
  getIncubationById,
};
