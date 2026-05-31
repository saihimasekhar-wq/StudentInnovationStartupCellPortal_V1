const Startup = require('../models/Startup');
const Notification = require('../models/Notification');

// Mock data store for simulation mode
global.mockStartups = global.mockStartups || [];

/**
 * @desc    Create a new startup
 * @route   POST /api/startups
 * @access  Private
 */
const createStartup = async (req, res) => {
  try {
    const {
      startupName,
      category,
      description,
      problemStatement,
      solution,
      founderName,
      coFounderName,
      department,
      teamSize,
      stage,
      fundingRequired,
      email,
      phone,
      website,
      videoUrl,
    } = req.body;

    if (!startupName || !category || !description || !problemStatement || !solution || !founderName || !department || !teamSize || !stage || !fundingRequired || !email || !phone) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    // Retrieve file paths from multer
    let logoPath = '';
    let pitchDeckPath = '';

    if (req.files) {
      if (req.files['logo'] && req.files['logo'][0]) {
        logoPath = `uploads/${req.files['logo'][0].filename}`;
      }
      if (req.files['pitchDeck'] && req.files['pitchDeck'][0]) {
        pitchDeckPath = `uploads/${req.files['pitchDeck'][0].filename}`;
      }
    }

    if (global.isMockDB) {
      const mockId = 'startup_' + Math.random().toString(36).substring(2, 9);
      const startup = {
        _id: mockId,
        startupName,
        category,
        description,
        problemStatement,
        solution,
        founderName,
        coFounderName,
        department,
        teamSize: parseInt(teamSize),
        stage,
        fundingRequired,
        email,
        phone,
        logo: logoPath,
        pitchDeck: pitchDeckPath,
        website,
        videoUrl,
        status: 'Pending',
        adminComment: '',
        createdBy: req.user._id || req.user.id,
        createdAt: new Date(),
      };
      global.mockStartups.push(startup);
      return res.status(201).json(startup);
    }

    const startup = await Startup.create({
      startupName,
      category,
      description,
      problemStatement,
      solution,
      founderName,
      coFounderName,
      department,
      teamSize: parseInt(teamSize),
      stage,
      fundingRequired,
      email,
      phone,
      logo: logoPath,
      pitchDeck: pitchDeckPath,
      website,
      videoUrl,
      createdBy: req.user.id || req.user._id,
    });

    return res.status(201).json(startup);
  } catch (error) {
    console.error('Create Startup Error:', error);
    return res.status(500).json({ message: 'Server error creating startup' });
  }
};

/**
 * @desc    Get logged in user's startups
 * @route   GET /api/startups
 * @access  Private
 */
const getMyStartups = async (req, res) => {
  try {
    const userId = (req.user.id || req.user._id).toString();
    const isMentor = req.user.role === 'mentor';

    if (global.isMockDB) {
      const list = isMentor
        ? global.mockStartups.filter(s => s.assignedMentor?.toString() === userId)
        : global.mockStartups.filter(s => s.createdBy.toString() === userId);
      return res.status(200).json(list);
    }

    const query = isMentor ? { assignedMentor: userId } : { createdBy: userId };
    const startups = await Startup.find(query).populate('assignedMentor', 'name expertise designation');
    return res.status(200).json(startups);
  } catch (error) {
    console.error('Get Startups Error:', error);
    return res.status(500).json({ message: 'Server error retrieving startups' });
  }
};

/**
 * @desc    Get startup details by ID
 * @route   GET /api/startups/:id
 * @access  Private
 */
const getStartupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      const startup = global.mockStartups.find(s => s._id === id);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      const isOwner = startup.createdBy.toString() === userId;
      const isMentor = startup.assignedMentor?.toString() === userId;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isMentor && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this startup' });
      }
      return res.status(200).json(startup);
    }

    const startup = await Startup.findById(id).populate('assignedMentor', 'name expertise email phone designation');
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const isOwner = startup.createdBy.toString() === userId;
    const isMentor = startup.assignedMentor?.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isMentor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this startup' });
    }

    return res.status(200).json(startup);
  } catch (error) {
    console.error('Get Startup Detail Error:', error);
    return res.status(500).json({ message: 'Server error fetching startup details' });
  }
};

/**
 * @desc    Get public approved startup details
 * @route   GET /api/startups/public/:id
 * @access  Public
 */
const getPublicStartupById = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const startup = global.mockStartups.find(s => s._id === id);
      if (!startup || startup.status !== 'Approved') {
        return res.status(404).json({ message: 'Startup not found or not approved' });
      }
      return res.status(200).json(startup);
    }

    const startup = await Startup.findById(id).populate('assignedMentor', 'name expertise designation');
    if (!startup || startup.status !== 'Approved') {
      return res.status(404).json({ message: 'Approved startup profile not found' });
    }

    return res.status(200).json(startup);
  } catch (error) {
    console.error('Get Public Startup Error:', error);
    return res.status(500).json({ message: 'Server error fetching public startup' });
  }
};

/**
 * @desc    Update startup by ID
 * @route   PUT /api/startups/:id
 * @access  Private
 */
const updateStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();
    const updateData = { ...req.body };

    // File updates
    if (req.files) {
      if (req.files['logo'] && req.files['logo'][0]) {
        updateData.logo = `uploads/${req.files['logo'][0].filename}`;
      }
      if (req.files['pitchDeck'] && req.files['pitchDeck'][0]) {
        updateData.pitchDeck = `uploads/${req.files['pitchDeck'][0].filename}`;
      }
    }

    // Force status reset back to Pending upon update
    updateData.status = 'Pending';
    updateData.adminComment = '';

    if (global.isMockDB) {
      const index = global.mockStartups.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      if (global.mockStartups[index].createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to modify this startup' });
      }

      const updatedStartup = {
        ...global.mockStartups[index],
        ...updateData,
        teamSize: updateData.teamSize ? parseInt(updateData.teamSize) : global.mockStartups[index].teamSize,
        updatedAt: new Date(),
      };

      global.mockStartups[index] = updatedStartup;
      return res.status(200).json(updatedStartup);
    }

    let startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    if (startup.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to modify this startup' });
    }

    startup = await Startup.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json(startup);
  } catch (error) {
    console.error('Update Startup Error:', error);
    return res.status(500).json({ message: 'Server error updating startup' });
  }
};

/**
 * @desc    Delete startup
 * @route   DELETE /api/startups/:id
 * @access  Private
 */
const deleteStartup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    if (global.isMockDB) {
      const index = global.mockStartups.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      if (global.mockStartups[index].createdBy.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to remove this startup' });
      }
      global.mockStartups.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Startup deleted successfully' });
    }

    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    if (startup.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to remove this startup' });
    }

    await Startup.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Startup deleted successfully' });
  } catch (error) {
    console.error('Delete Startup Error:', error);
    return res.status(500).json({ message: 'Server error deleting startup' });
  }
};

module.exports = {
  createStartup,
  getMyStartups,
  getStartupById,
  getPublicStartupById,
  updateStartup,
  deleteStartup,
};
