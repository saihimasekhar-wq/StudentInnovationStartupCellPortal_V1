const Startup = require('../models/Startup');
const Proposal = require('../models/Proposal');
const Mentor = require('../models/Mentor');
const SuccessStory = require('../models/SuccessStory');
const User = require('../models/User');

/**
 * @desc    Global public search
 * @route   GET /api/search
 * @access  Public
 */
const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ startups: [], proposals: [], mentors: [], successStories: [] });
    }

    const regex = new RegExp(q, 'i');

    if (global.isMockDB) {
      global.mockStartups = global.mockStartups || [];
      global.mockProposals = global.mockProposals || [];
      global.mockSuccessStories = global.mockSuccessStories || [];
      
      const startups = global.mockStartups.filter(
        s => s.status === 'Approved' && (regex.test(s.startupName) || regex.test(s.founderName) || regex.test(s.category) || regex.test(s.description))
      );

      const proposals = global.mockProposals.filter(
        p => p.status === 'Approved' && (regex.test(p.title) || regex.test(p.category) || regex.test(p.technologies))
      );

      // Seed mock mentors for searching
      const mockMentorsList = [
        { name: 'Dr. Anita Rao', expertise: 'Machine Learning, Deep Learning', designation: 'AI Research Head' },
        { name: 'Sanjay Mehta', expertise: 'SaaS, Business Strategy, GTM', designation: 'Partner, Venture Capital' },
        { name: 'Marcus Sterling', expertise: 'Hardware, Embedded Systems', designation: 'Director of Labs' }
      ];
      const mentors = mockMentorsList.filter(
        m => regex.test(m.name) || regex.test(m.expertise) || regex.test(m.designation)
      );

      const successStories = global.mockSuccessStories.filter(
        s => regex.test(s.startupName) || regex.test(s.founderName) || regex.test(s.achievement)
      );

      return res.status(200).json({ startups, proposals, mentors, successStories });
    }

    // Mongoose regex queries
    const startups = await Startup.find({
      status: 'Approved',
      $or: [
        { startupName: regex },
        { founderName: regex },
        { category: regex },
        { description: regex }
      ]
    }).populate('assignedMentor', 'name expertise designation');

    const proposals = await Proposal.find({
      status: 'Approved',
      $or: [
        { title: regex },
        { category: regex },
        { technologies: regex }
      ]
    });

    const mentors = await Mentor.find({
      $or: [
        { name: regex },
        { expertise: regex },
        { designation: regex }
      ]
    }).select('-password');

    const successStories = await SuccessStory.find({
      $or: [
        { startupName: regex },
        { founderName: regex },
        { achievement: regex }
      ]
    });

    return res.status(200).json({ startups, proposals, mentors, successStories });
  } catch (error) {
    console.error('Global Search Error:', error);
    return res.status(500).json({ message: 'Server error during search query' });
  }
};

/**
 * @desc    Admin global search
 * @route   GET /api/admin/search
 * @access  Private (Admin Only)
 */
const adminSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ users: [], startups: [], proposals: [], mentors: [], successStories: [] });
    }

    const regex = new RegExp(q, 'i');

    if (global.isMockDB) {
      global.mockUsers = global.mockUsers || [];
      global.mockStartups = global.mockStartups || [];
      global.mockProposals = global.mockProposals || [];
      global.mockSuccessStories = global.mockSuccessStories || [];

      const users = global.mockUsers.filter(
        u => regex.test(u.fullName) || regex.test(u.email) || regex.test(u.studentId)
      );

      const startups = global.mockStartups.filter(
        s => regex.test(s.startupName) || regex.test(s.founderName) || regex.test(s.category) || regex.test(s.description)
      );

      const proposals = global.mockProposals.filter(
        p => regex.test(p.title) || regex.test(p.category) || regex.test(p.technologies)
      );

      const mockMentorsList = [
        { name: 'Dr. Anita Rao', expertise: 'Machine Learning, Deep Learning', designation: 'AI Research Head' },
        { name: 'Sanjay Mehta', expertise: 'SaaS, Business Strategy, GTM', designation: 'Partner, Venture Capital' },
        { name: 'Marcus Sterling', expertise: 'Hardware, Embedded Systems', designation: 'Director of Labs' }
      ];
      const mentors = mockMentorsList.filter(
        m => regex.test(m.name) || regex.test(m.expertise) || regex.test(m.designation)
      );

      const successStories = global.mockSuccessStories.filter(
        s => regex.test(s.startupName) || regex.test(s.founderName) || regex.test(s.achievement)
      );

      return res.status(200).json({ users, startups, proposals, mentors, successStories });
    }

    const users = await User.find({
      $or: [
        { fullName: regex },
        { email: regex },
        { studentId: regex }
      ]
    }).select('-password');

    const startups = await Startup.find({
      $or: [
        { startupName: regex },
        { founderName: regex },
        { category: regex },
        { description: regex }
      ]
    }).populate('assignedMentor', 'name expertise');

    const proposals = await Proposal.find({
      $or: [
        { title: regex },
        { category: regex },
        { technologies: regex }
      ]
    });

    const mentors = await Mentor.find({
      $or: [
        { name: regex },
        { expertise: regex },
        { designation: regex }
      ]
    }).select('-password');

    const successStories = await SuccessStory.find({
      $or: [
        { startupName: regex },
        { founderName: regex },
        { achievement: regex }
      ]
    });

    return res.status(200).json({ users, startups, proposals, mentors, successStories });
  } catch (error) {
    console.error('Admin Search Error:', error);
    return res.status(500).json({ message: 'Server error during administrative search query' });
  }
};

module.exports = {
  globalSearch,
  adminSearch,
};
