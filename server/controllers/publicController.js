const User = require('../models/User');
const Startup = require('../models/Startup');
const Proposal = require('../models/Proposal');
const Incubation = require('../models/Incubation');
const Mentor = require('../models/Mentor');
const SuccessStory = require('../models/SuccessStory');

/**
 * @desc    Get public real-time portal statistics
 * @route   GET /api/public/stats
 * @access  Public
 */
const getPublicStats = async (req, res) => {
  try {
    if (global.isMockDB) {
      global.mockUsers = global.mockUsers || [];
      global.mockStartups = global.mockStartups || [];
      global.mockProposals = global.mockProposals || [];
      global.mockIncubations = global.mockIncubations || [];
      global.mockSuccessStories = global.mockSuccessStories || [];
      
      const totalStudents = global.mockUsers.length + 15; // seed some basic values for visuals
      const totalStartups = global.mockStartups.length + 8;
      const approvedStartups = global.mockStartups.filter(s => s.status === 'Approved').length + 5;
      const totalProposals = global.mockProposals.length + 12;
      const approvedProposals = global.mockProposals.filter(p => p.status === 'Approved').length + 8;
      const totalMentors = 14; // Mock mentors count
      const incubationApplications = global.mockIncubations.length + 4;
      const successStories = global.mockSuccessStories.length;

      return res.status(200).json({
        totalStudents,
        totalStartups,
        approvedStartups,
        totalProposals,
        approvedProposals,
        totalMentors,
        incubationApplications,
        successStories,
      });
    }

    // Mongoose count queries
    const totalStudents = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const approvedStartups = await Startup.countDocuments({ status: 'Approved' });
    const totalProposals = await Proposal.countDocuments();
    const approvedProposals = await Proposal.countDocuments({ status: 'Approved' });
    const totalMentors = await Mentor.countDocuments();
    const incubationApplications = await Incubation.countDocuments();
    const successStories = await SuccessStory.countDocuments();

    return res.status(200).json({
      totalStudents: totalStudents || 0,
      totalStartups: totalStartups || 0,
      approvedStartups: approvedStartups || 0,
      totalProposals: totalProposals || 0,
      approvedProposals: approvedProposals || 0,
      totalMentors: totalMentors || 0,
      incubationApplications: incubationApplications || 0,
      successStories: successStories || 0,
    });
  } catch (error) {
    console.error('Fetch Public Stats Error:', error);
    return res.status(500).json({ message: 'Server error retrieving statistics' });
  }
};

module.exports = {
  getPublicStats,
};
