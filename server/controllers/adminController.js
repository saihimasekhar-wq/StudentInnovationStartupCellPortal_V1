const Admin = require('../models/Admin');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Proposal = require('../models/Proposal');
const Incubation = require('../models/Incubation');
const Mentor = require('../models/Mentor');
const Progress = require('../models/Progress');
const LoginActivity = require('../models/LoginActivity');
const Notification = require('../models/Notification');
const SuccessStory = require('../models/SuccessStory');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Mock databases
global.mockAdmins = global.mockAdmins || [];
global.mockLoginHistory = global.mockLoginHistory || [];
global.mockMentors = global.mockMentors || [
  { _id: 'mentor_1', name: 'Dr. Anita Rao', expertise: 'Machine Learning', email: 'anita.rao@college.edu', phone: '9880123456', designation: 'AI Research Head' },
  { _id: 'mentor_2', name: 'Sanjay Mehta', expertise: 'Business GTM Strategy', email: 'sanjay@ventures.com', phone: '9845099887', designation: 'Partner, Venture Fund' }
];
global.mockNotifications = global.mockNotifications || [];

const generateAdminToken = (id) => {
  return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Authenticate admin
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (global.isMockDB) {
      // Find inside mock admins or check default email
      const adminMail = email.toLowerCase().trim();
      if (adminMail === 'admin@startupcell.edu' && password === 'Admin@123') {
        const adminUser = {
          id: 'admin_default',
          name: 'College Startup Cell Admin',
          email: adminMail,
          role: 'admin'
        };
        const token = generateAdminToken(adminUser.id);
        return res.status(200).json({ token, user: adminUser });
      }

      // Check other mock admins
      const admin = global.mockAdmins.find(a => a.email === adminMail);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const adminUser = { id: admin._id, name: admin.name, email: admin.email, role: 'admin' };
      const token = generateAdminToken(admin._id);
      return res.status(200).json({ token, user: adminUser });
    }

    // Connect to database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const adminUser = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    };

    return res.status(200).json({
      token: generateAdminToken(admin._id),
      user: adminUser,
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ message: 'Server error during admin login' });
  }
};

/**
 * @desc    Get dashboard metrics & stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin Only)
 */
const getAdminStats = async (req, res) => {
  try {
    if (global.isMockDB) {
      global.mockUsers = global.mockUsers || [];
      global.mockStartups = global.mockStartups || [];
      global.mockProposals = global.mockProposals || [];
      global.mockIncubations = global.mockIncubations || [];
      global.mockProgressList = global.mockProgressList || [];
      global.mockLoginHistory = global.mockLoginHistory || [];

      const totalUsers = global.mockUsers.length;
      const totalStartups = global.mockStartups.length;
      const pendingStartups = global.mockStartups.filter(s => s.status === 'Pending').length;
      const approvedStartups = global.mockStartups.filter(s => s.status === 'Approved').length;
      const rejectedStartups = global.mockStartups.filter(s => s.status === 'Rejected').length;
      
      const totalProposals = global.mockProposals.length;
      const pendingProposals = global.mockProposals.filter(p => p.status === 'Pending').length;
      const approvedProposals = global.mockProposals.filter(p => p.status === 'Approved').length;
      const rejectedProposals = global.mockProposals.filter(p => p.status === 'Rejected').length;

      const totalIncubations = global.mockIncubations.length;
      const pendingIncubations = global.mockIncubations.filter(i => i.status === 'Pending').length;
      const approvedIncubations = global.mockIncubations.filter(i => i.status === 'Approved').length;

      const totalLogins = global.mockLoginHistory.length;

      return res.status(200).json({
        totalUsers,
        totalStartups,
        pendingStartups,
        approvedStartups,
        rejectedStartups,
        totalProposals,
        pendingProposals,
        approvedProposals,
        rejectedProposals,
        totalIncubations,
        pendingIncubations,
        approvedIncubations,
        totalLogins,
      });
    }

    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const pendingStartups = await Startup.countDocuments({ status: 'Pending' });
    const approvedStartups = await Startup.countDocuments({ status: 'Approved' });
    const rejectedStartups = await Startup.countDocuments({ status: 'Rejected' });
    
    const totalProposals = await Proposal.countDocuments();
    const pendingProposals = await Proposal.countDocuments({ status: 'Pending' });
    const approvedProposals = await Proposal.countDocuments({ status: 'Approved' });
    const rejectedProposals = await Proposal.countDocuments({ status: 'Rejected' });

    const totalIncubations = await Incubation.countDocuments();
    const pendingIncubations = await Incubation.countDocuments({ status: 'Pending' });
    const approvedIncubations = await Incubation.countDocuments({ status: 'Approved' });

    const totalLogins = await LoginActivity.countDocuments();

    return res.status(200).json({
      totalUsers,
      totalStartups,
      pendingStartups,
      approvedStartups,
      rejectedStartups,
      totalProposals,
      pendingProposals,
      approvedProposals,
      rejectedProposals,
      totalIncubations,
      pendingIncubations,
      approvedIncubations,
      totalLogins,
    });
  } catch (error) {
    console.error('Fetch Stats Error:', error);
    return res.status(500).json({ message: 'Server error fetching statistics' });
  }
};

/**
 * @desc    Get all users list
 * @route   GET /api/admin/users
 * @access  Private (Admin Only)
 */
const getUsersList = async (req, res) => {
  try {
    if (global.isMockDB) {
      global.mockUsers = global.mockUsers || [];
      // Hydrate startup & proposal count for view
      const users = global.mockUsers.map(u => {
        const startupsCount = global.mockStartups.filter(s => s.createdBy === u._id).length;
        const proposalsCount = global.mockProposals.filter(p => p.submittedBy === u._id).length;
        const lastLogin = global.mockLoginHistory.filter(l => l.userId === u._id).sort((a,b)=>b.loginTime-a.loginTime)[0]?.loginTime || null;
        return {
          ...u,
          startupsCount,
          proposalsCount,
          lastLogin,
        };
      });
      return res.status(200).json(users);
    }

    const dbUsers = await User.find().select('-password');
    const users = await Promise.all(dbUsers.map(async (u) => {
      const startupsCount = await Startup.countDocuments({ createdBy: u._id });
      const proposalsCount = await Proposal.countDocuments({ submittedBy: u._id });
      const lastLoginObj = await LoginActivity.findOne({ userId: u._id.toString() }).sort({ loginTime: -1 });
      return {
        _id: u._id,
        fullName: u.fullName,
        email: u.email,
        studentId: u.studentId,
        department: u.department,
        createdAt: u.createdAt,
        startupsCount,
        proposalsCount,
        lastLogin: lastLoginObj ? lastLoginObj.loginTime : null,
      };
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    return res.status(500).json({ message: 'Server error retrieving users list' });
  }
};

/**
 * @desc    Get single user details with submissions
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin Only)
 */
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const user = global.mockUsers.find(u => u._id === id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const startups = global.mockStartups.filter(s => s.createdBy === id);
      const proposals = global.mockProposals.filter(p => p.submittedBy === id);
      const loginRecords = global.mockLoginHistory.filter(l => l.userId === id).sort((a,b)=>b.loginTime-a.loginTime);

      return res.status(200).json({
        user,
        startups,
        proposals,
        loginRecords,
        totalLogins: loginRecords.length,
      });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startups = await Startup.find({ createdBy: id });
    const proposals = await Proposal.find({ submittedBy: id });
    const loginRecords = await LoginActivity.find({ userId: id }).sort({ loginTime: -1 });

    return res.status(200).json({
      user,
      startups,
      proposals,
      loginRecords,
      totalLogins: loginRecords.length,
    });
  } catch (error) {
    console.error('Get User Details Error:', error);
    return res.status(500).json({ message: 'Server error retrieving user details' });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin Only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const index = global.mockUsers.findIndex(u => u._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
      }
      global.mockUsers.splice(index, 1);
      // Clean up linked submissions
      global.mockStartups = global.mockStartups.filter(s => s.createdBy !== id);
      global.mockProposals = global.mockProposals.filter(p => p.submittedBy !== id);
      return res.status(200).json({ success: true, message: 'User and all linked submissions deleted successfully' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);
    await Startup.deleteMany({ createdBy: id });
    await Proposal.deleteMany({ submittedBy: id });
    await LoginActivity.deleteMany({ userId: id });

    return res.status(200).json({ success: true, message: 'User and all linked submissions deleted successfully' });
  } catch (error) {
    console.error('Delete User Error:', error);
    return res.status(500).json({ message: 'Server error deleting user' });
  }
};

/**
 * @desc    Get login history logs
 * @route   GET /api/admin/login-history
 * @access  Private (Admin Only)
 */
const getLoginHistory = async (req, res) => {
  try {
    if (global.isMockDB) {
      global.mockLoginHistory = global.mockLoginHistory || [];
      const history = [...global.mockLoginHistory].sort((a,b)=>b.loginTime-a.loginTime);
      return res.status(200).json(history);
    }

    const history = await LoginActivity.find().sort({ loginTime: -1 });
    return res.status(200).json(history);
  } catch (error) {
    console.error('Get Login History Error:', error);
    return res.status(500).json({ message: 'Server error retrieving login history logs' });
  }
};

/**
 * @desc    Get all startups
 * @route   GET /api/admin/startups
 * @access  Private (Admin Only)
 */
const getAllStartups = async (req, res) => {
  try {
    if (global.isMockDB) {
      return res.status(200).json(global.mockStartups);
    }
    const startups = await Startup.find()
      .populate('createdBy', 'fullName email department studentId')
      .populate('assignedMentor', 'name expertise designation')
      .sort({ createdAt: -1 });
    return res.status(200).json(startups);
  } catch (error) {
    console.error('Get All Startups Error:', error);
    return res.status(500).json({ message: 'Server error retrieving startups list' });
  }
};

/**
 * @desc    Update startup status with admin comments
 * @route   PUT /api/admin/startups/:id/status
 * @access  Private (Admin Only)
 */
const updateStartupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    const allowedStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Request Changes'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (global.isMockDB) {
      const index = global.mockStartups.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Startup not found' });
      }

      global.mockStartups[index].status = status;
      global.mockStartups[index].adminComment = adminComment || '';
      global.mockStartups[index].updatedAt = new Date();

      const startup = global.mockStartups[index];

      // Auto Notification
      global.mockNotifications = global.mockNotifications || [];
      global.mockNotifications.push({
        _id: 'notif_' + Date.now(),
        title: `Startup Application Status: ${status}`,
        message: `Your startup application for "${startup.startupName}" is now "${status}". Comments: ${adminComment || 'No feedback provided.'}`,
        targetUserId: startup.createdBy,
        createdAt: new Date(),
      });

      return res.status(200).json(startup);
    }

    const startup = await Startup.findById(id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    startup.status = status;
    startup.adminComment = adminComment || '';
    await startup.save();

    // Trigger Notification log
    await Notification.create({
      title: `Startup Application Status: ${status}`,
      message: `Your startup application for "${startup.startupName}" is now "${status}". Comments: ${adminComment || 'No feedback provided.'}`,
      targetUserId: startup.createdBy.toString(),
    });

    return res.status(200).json(startup);
  } catch (error) {
    console.error('Update Startup Status Error:', error);
    return res.status(500).json({ message: 'Server error updating startup status' });
  }
};

/**
 * @desc    Get all proposals
 * @route   GET /api/admin/proposals
 * @access  Private (Admin Only)
 */
const getAllProposals = async (req, res) => {
  try {
    if (global.isMockDB) {
      return res.status(200).json(global.mockProposals);
    }
    const proposals = await Proposal.find()
      .populate('submittedBy', 'fullName email department studentId')
      .sort({ createdAt: -1 });
    return res.status(200).json(proposals);
  } catch (error) {
    console.error('Get All Proposals Error:', error);
    return res.status(500).json({ message: 'Server error retrieving proposals list' });
  }
};

/**
 * @desc    Update proposal status
 * @route   PUT /api/admin/proposals/:id/status
 * @access  Private (Admin Only)
 */
const updateProposalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    const allowedStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Request Changes'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (global.isMockDB) {
      const index = global.mockProposals.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Proposal not found' });
      }

      global.mockProposals[index].status = status;
      global.mockProposals[index].adminComment = adminComment || '';
      global.mockProposals[index].updatedAt = new Date();

      const proposal = global.mockProposals[index];

      // Auto Notification
      global.mockNotifications = global.mockNotifications || [];
      global.mockNotifications.push({
        _id: 'notif_' + Date.now(),
        title: `Proposal Status: ${status}`,
        message: `Your innovation proposal "${proposal.title}" is now "${status}". Comments: ${adminComment || 'No feedback provided.'}`,
        targetUserId: proposal.submittedBy,
        createdAt: new Date(),
      });

      return res.status(200).json(proposal);
    }

    const proposal = await Proposal.findById(id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = status;
    proposal.adminComment = adminComment || '';
    await proposal.save();

    // Trigger Notification log
    await Notification.create({
      title: `Proposal Status: ${status}`,
      message: `Your innovation proposal "${proposal.title}" is now "${status}". Comments: ${adminComment || 'No feedback provided.'}`,
      targetUserId: proposal.submittedBy.toString(),
    });

    return res.status(200).json(proposal);
  } catch (error) {
    console.error('Update Proposal Status Error:', error);
    return res.status(500).json({ message: 'Server error updating proposal status' });
  }
};

/**
 * @desc    Get all incubation applications
 * @route   GET /api/admin/incubations
 * @access  Private (Admin Only)
 */
const getAllIncubations = async (req, res) => {
  try {
    if (global.isMockDB) {
      // Hydrate startup details
      const list = global.mockIncubations.map(i => {
        const startup = global.mockStartups.find(s => s._id === i.startupId);
        const student = global.mockUsers.find(u => u._id === i.submittedBy);
        return {
          ...i,
          startupId: startup || { startupName: i.startupName },
          submittedBy: student || { fullName: 'Student' }
        };
      });
      return res.status(200).json(list);
    }

    const incubations = await Incubation.find()
      .populate('startupId', 'startupName category stage founderName email phone')
      .populate('submittedBy', 'fullName email department studentId')
      .sort({ createdAt: -1 });

    return res.status(200).json(incubations);
  } catch (error) {
    console.error('Get All Incubations Error:', error);
    return res.status(500).json({ message: 'Server error retrieving incubation applications' });
  }
};

/**
 * @desc    Update incubation application status
 * @route   PUT /api/admin/incubations/:id/status
 * @access  Private (Admin Only)
 */
const updateIncubationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    const allowedStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (global.isMockDB) {
      const index = global.mockIncubations.findIndex(i => i._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Application not found' });
      }

      global.mockIncubations[index].status = status;
      global.mockIncubations[index].adminComment = adminComment || '';
      global.mockIncubations[index].updatedAt = new Date();

      const app = global.mockIncubations[index];

      // Auto Notification
      global.mockNotifications = global.mockNotifications || [];
      global.mockNotifications.push({
        _id: 'notif_' + Date.now(),
        title: `Incubation Application Status: ${status}`,
        message: `Your incubation space application for startup "${app.startupName}" is now "${status}". Comment: ${adminComment || 'None'}`,
        targetUserId: app.submittedBy,
        createdAt: new Date(),
      });

      return res.status(200).json(app);
    }

    const app = await Incubation.findById(id);
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    app.status = status;
    app.adminComment = adminComment || '';
    await app.save();

    const startup = await Startup.findById(app.startupId);
    const startupNameStr = startup ? startup.startupName : 'Your Startup';

    // Trigger Notification
    await Notification.create({
      title: `Incubation Application Status: ${status}`,
      message: `Your incubation space application for startup "${startupNameStr}" is now "${status}". Comment: ${adminComment || 'None'}`,
      targetUserId: app.submittedBy.toString(),
    });

    return res.status(200).json(app);
  } catch (error) {
    console.error('Update Incubation Status Error:', error);
    return res.status(500).json({ message: 'Server error updating status' });
  }
};

/**
 * @desc    Get all progress tracker weekly logs
 * @route   GET /api/admin/progress
 * @access  Private (Admin Only)
 */
const getAllProgressLogs = async (req, res) => {
  try {
    if (global.isMockDB) {
      // Hydrate startup names
      const list = global.mockProgressList.map(p => {
        const startup = global.mockStartups.find(s => s._id === p.startupId);
        const mentor = global.mockMentors.find(m => m._id === p.reviewedBy);
        return {
          ...p,
          startupName: startup ? startup.startupName : 'Unknown Startup',
          mentorName: mentor ? mentor.name : 'Unassigned',
        };
      });
      return res.status(200).json(list);
    }

    const progress = await Progress.find()
      .populate('startupId', 'startupName category stage')
      .populate('reviewedBy', 'name expertise designation')
      .populate('submittedBy', 'fullName email department')
      .sort({ createdAt: -1 });

    return res.status(200).json(progress);
  } catch (error) {
    console.error('Get All Progress logs error:', error);
    return res.status(500).json({ message: 'Server error fetching progress logs' });
  }
};

/**
 * @desc    Create a new mentor profile
 * @route   POST /api/admin/mentors
 * @access  Private (Admin Only)
 */
const createMentor = async (req, res) => {
  try {
    const { name, expertise, email, phone, designation, password } = req.body;

    if (!name || !expertise || !email || !phone || !designation) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    if (global.isMockDB) {
      const emailMail = email.toLowerCase().trim();
      const mentorExists = global.mockMentors.some(m => m.email === emailMail);
      if (mentorExists) {
        return res.status(400).json({ message: 'Mentor with this email already exists' });
      }

      const pass = password || 'Mentor@123';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pass, salt);

      const mockId = 'mentor_' + Math.random().toString(36).substring(2, 9);
      const mentor = {
        _id: mockId,
        name,
        expertise,
        email: emailMail,
        phone,
        designation,
        password: hashedPassword,
        role: 'mentor',
        createdAt: new Date(),
      };
      global.mockMentors.push(mentor);
      return res.status(201).json(mentor);
    }

    const mentorExists = await Mentor.findOne({ email });
    if (mentorExists) {
      return res.status(400).json({ message: 'Mentor with this email already exists' });
    }

    const pass = password || 'Mentor@123';
    const mentor = await Mentor.create({
      name,
      expertise,
      email,
      phone,
      designation,
      password: pass,
    });

    return res.status(201).json(mentor);
  } catch (error) {
    console.error('Create Mentor Error:', error);
    return res.status(500).json({ message: 'Server error creating mentor profile' });
  }
};

/**
 * @desc    Get all mentors list
 * @route   GET /api/admin/mentors
 * @access  Private (Admin Only)
 */
const getMentorsList = async (req, res) => {
  try {
    if (global.isMockDB) {
      return res.status(200).json(global.mockMentors);
    }

    const mentors = await Mentor.find().select('-password').sort({ name: 1 });
    return res.status(200).json(mentors);
  } catch (error) {
    console.error('Get Mentors Error:', error);
    return res.status(500).json({ message: 'Server error retrieving mentors list' });
  }
};

/**
 * @desc    Update mentor profile
 * @route   PUT /api/admin/mentors/:id
 * @access  Private (Admin Only)
 */
const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, expertise, email, phone, designation } = req.body;

    if (global.isMockDB) {
      const index = global.mockMentors.findIndex(m => m._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Mentor profile not found' });
      }

      global.mockMentors[index] = {
        ...global.mockMentors[index],
        name: name || global.mockMentors[index].name,
        expertise: expertise || global.mockMentors[index].expertise,
        email: email ? email.toLowerCase().trim() : global.mockMentors[index].email,
        phone: phone || global.mockMentors[index].phone,
        designation: designation || global.mockMentors[index].designation,
        updatedAt: new Date(),
      };

      return res.status(200).json(global.mockMentors[index]);
    }

    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    const updatedMentor = await Mentor.findByIdAndUpdate(
      id,
      { name, expertise, email, phone, designation },
      { new: true }
    ).select('-password');

    return res.status(200).json(updatedMentor);
  } catch (error) {
    console.error('Update Mentor Error:', error);
    return res.status(500).json({ message: 'Server error updating mentor' });
  }
};

/**
 * @desc    Delete mentor profile
 * @route   DELETE /api/admin/mentors/:id
 * @access  Private (Admin Only)
 */
const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const index = global.mockMentors.findIndex(m => m._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Mentor profile not found' });
      }
      global.mockMentors.splice(index, 1);
      
      // Remove assignment from startups
      global.mockStartups.forEach(s => {
        if (s.assignedMentor?.toString() === id) {
          s.assignedMentor = null;
        }
      });
      return res.status(200).json({ success: true, message: 'Mentor profile deleted successfully' });
    }

    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    await Mentor.findByIdAndDelete(id);
    // Unassign mentor from startups
    await Startup.updateMany({ assignedMentor: id }, { $unset: { assignedMentor: '' } });

    return res.status(200).json({ success: true, message: 'Mentor profile deleted successfully' });
  } catch (error) {
    console.error('Delete Mentor Error:', error);
    return res.status(500).json({ message: 'Server error deleting mentor profile' });
  }
};

/**
 * @desc    Assign mentor to startup
 * @route   POST /api/admin/assign-mentor
 * @access  Private (Admin Only)
 */
const assignMentorToStartup = async (req, res) => {
  try {
    const { startupId, mentorId } = req.body;

    if (!startupId || !mentorId) {
      return res.status(400).json({ message: 'Please provide both startup ID and mentor ID' });
    }

    if (global.isMockDB) {
      const startupIndex = global.mockStartups.findIndex(s => s._id === startupId);
      if (startupIndex === -1) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      const mentor = global.mockMentors.find(m => m._id === mentorId);
      if (!mentor) {
        return res.status(404).json({ message: 'Mentor not found' });
      }

      global.mockStartups[startupIndex].assignedMentor = mentorId;
      
      // Notify creator
      global.mockNotifications.push({
        _id: 'notif_' + Date.now(),
        title: 'Mentor Assigned',
        message: `Dr./Mr./Ms. ${mentor.name} has been assigned as the mentor for your startup "${global.mockStartups[startupIndex].startupName}".`,
        targetUserId: global.mockStartups[startupIndex].createdBy,
        createdAt: new Date(),
      });

      return res.status(200).json(global.mockStartups[startupIndex]);
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    startup.assignedMentor = mentorId;
    await startup.save();

    // Notify creator
    await Notification.create({
      title: 'Mentor Assigned',
      message: `Dr./Mr./Ms. ${mentor.name} has been assigned as the mentor for your startup "${startup.startupName}".`,
      targetUserId: startup.createdBy.toString(),
    });

    return res.status(200).json(startup);
  } catch (error) {
    console.error('Assign Mentor Error:', error);
    return res.status(500).json({ message: 'Server error assigning mentor' });
  }
};

/**
 * @desc    Publish notification broadcast to all/selected users
 * @route   POST /api/admin/notifications
 * @access  Private (Admin Only)
 */
const sendBroadNotification = async (req, res) => {
  try {
    const { title, message, targetUserId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Please enter title and message' });
    }

    if (global.isMockDB) {
      const users = targetUserId ? [targetUserId] : global.mockUsers.map(u => u._id);
      users.forEach(uid => {
        global.mockNotifications.push({
          _id: 'notif_' + Math.random().toString(36).substring(2, 9),
          title,
          message,
          targetUserId: uid,
          createdAt: new Date()
        });
      });
      return res.status(201).json({ success: true, message: 'Notification broadcast queued' });
    }

    if (targetUserId) {
      await Notification.create({ title, message, targetUserId });
    } else {
      const allUsers = await User.find();
      const notificationPromises = allUsers.map(u => 
        Notification.create({ title, message, targetUserId: u._id.toString() })
      );
      await Promise.all(notificationPromises);
    }

    return res.status(201).json({ success: true, message: 'Notification broadcast completed' });
  } catch (error) {
    console.error('Send Notification Error:', error);
    return res.status(500).json({ message: 'Server error distributing notifications' });
  }
};

/**
 * @desc    Export logs (Users, Startups, Proposals, Incubations, Progress reports)
 * @route   GET /api/admin/export/:type
 * @access  Private (Admin Only)
 */
const exportDataReport = async (req, res) => {
  try {
    const { type } = req.params; // users, startups, proposals, incubations, progress
    const { format, startDate, endDate } = req.query; // format: csv, xlsx, pdf

    // Date range filters logic
    const start = startDate ? new Date(startDate) : new Date('2020-01-01');
    const end = endDate ? new Date(endDate) : new Date('2030-12-31');
    // Ensure end date covers full day
    end.setHours(23, 59, 59, 999);

    let data = [];

    // Fetch data based on type
    if (global.isMockDB) {
      if (type === 'users') {
        data = global.mockUsers.filter(u => new Date(u.createdAt) >= start && new Date(u.createdAt) <= end);
      } else if (type === 'startups') {
        data = global.mockStartups.filter(s => new Date(s.createdAt) >= start && new Date(s.createdAt) <= end);
      } else if (type === 'proposals') {
        data = global.mockProposals.filter(p => new Date(p.createdAt) >= start && new Date(p.createdAt) <= end);
      } else if (type === 'incubations') {
        data = global.mockIncubations.filter(i => new Date(i.createdAt) >= start && new Date(i.createdAt) <= end);
      } else if (type === 'progress') {
        data = global.mockProgressList.filter(p => new Date(p.createdAt) >= start && new Date(p.createdAt) <= end);
      }
    } else {
      if (type === 'users') {
        data = await User.find({ createdAt: { $gte: start, $lte: end } }).select('-password');
      } else if (type === 'startups') {
        data = await Startup.find({ createdAt: { $gte: start, $lte: end } }).populate('createdBy', 'fullName email');
      } else if (type === 'proposals') {
        data = await Proposal.find({ createdAt: { $gte: start, $lte: end } }).populate('submittedBy', 'fullName email');
      } else if (type === 'incubations') {
        data = await Incubation.find({ createdAt: { $gte: start, $lte: end } }).populate('startupId', 'startupName').populate('submittedBy', 'fullName');
      } else if (type === 'progress') {
        data = await Progress.find({ createdAt: { $gte: start, $lte: end } }).populate('startupId', 'startupName').populate('submittedBy', 'fullName');
      }
    }

    if (data.length === 0) {
      return res.status(404).send('No records found in selected date range for export');
    }

    // 1. CSV or Excel Format Generation (via exceljs)
    if (format === 'csv' || format === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(`${type.toUpperCase()} Report`);

      // Column configuration
      if (type === 'users') {
        worksheet.columns = [
          { header: 'Full Name', key: 'fullName', width: 25 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Student ID', key: 'studentId', width: 18 },
          { header: 'Department', key: 'department', width: 25 },
          { header: 'Registration Date', key: 'createdAt', width: 22 },
        ];
        data.forEach(item => {
          worksheet.addRow({
            fullName: item.fullName,
            email: item.email,
            studentId: item.studentId,
            department: item.department,
            createdAt: new Date(item.createdAt).toLocaleString(),
          });
        });
      } else if (type === 'startups') {
        worksheet.columns = [
          { header: 'Startup Name', key: 'startupName', width: 25 },
          { header: 'Category', key: 'category', width: 20 },
          { header: 'Founder', key: 'founderName', width: 22 },
          { header: 'Department', key: 'department', width: 25 },
          { header: 'Stage', key: 'stage', width: 18 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Submission Date', key: 'createdAt', width: 22 },
        ];
        data.forEach(item => {
          worksheet.addRow({
            startupName: item.startupName,
            category: item.category,
            founderName: item.founderName,
            department: item.department,
            stage: item.stage,
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleString(),
          });
        });
      } else if (type === 'proposals') {
        worksheet.columns = [
          { header: 'Proposal Title', key: 'title', width: 30 },
          { header: 'Category', key: 'category', width: 20 },
          { header: 'Technologies Used', key: 'technologies', width: 25 },
          { header: 'Submitted By', key: 'submittedBy', width: 22 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Submission Date', key: 'createdAt', width: 22 },
        ];
        data.forEach(item => {
          const submittedName = item.submittedBy?.fullName || item.founderName || 'Student';
          worksheet.addRow({
            title: item.title,
            category: item.category,
            technologies: item.technologies,
            submittedBy: submittedName,
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleString(),
          });
        });
      } else if (type === 'incubations') {
        worksheet.columns = [
          { header: 'Startup Name', key: 'startupName', width: 25 },
          { header: 'Progress', key: 'progress', width: 30 },
          { header: 'Funding Need', key: 'fundingRequirement', width: 20 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Filing Date', key: 'createdAt', width: 22 },
        ];
        data.forEach(item => {
          const name = item.startupId?.startupName || item.startupName || 'Startup';
          worksheet.addRow({
            startupName: name,
            progress: item.progress,
            fundingRequirement: item.fundingRequirement,
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleString(),
          });
        });
      } else if (type === 'progress') {
        worksheet.columns = [
          { header: 'Startup Name', key: 'startupName', width: 25 },
          { header: 'Report Title', key: 'title', width: 25 },
          { header: 'Achievements', key: 'achievements', width: 30 },
          { header: 'Rating', key: 'mentorRating', width: 10 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Log Date', key: 'createdAt', width: 22 },
        ];
        data.forEach(item => {
          const name = item.startupId?.startupName || item.startupName || 'Startup';
          worksheet.addRow({
            startupName: name,
            title: item.title,
            achievements: item.achievements,
            mentorRating: item.mentorRating || 'Pending',
            status: item.status,
            createdAt: new Date(item.createdAt).toLocaleString(),
          });
        });
      }

      // Styles headers
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' }, // Slate Blue
      };

      if (format === 'xlsx') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${Date.now()}.xlsx`);
        await workbook.xlsx.write(res);
      } else {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${Date.now()}.csv`);
        await workbook.csv.write(res);
      }
      return res.end();
    }

    // 2. PDF Format Generation (via PDFKit)
    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 30 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_report_${Date.now()}.pdf`);
      doc.pipe(res);

      // Header Branding
      doc.rect(0, 0, 612, 80).fill('#0F172A'); // dark slate
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(22).text('College Startup Cell Portal', 30, 20);
      doc.fillColor('#A78BFA').font('Helvetica').fontSize(11).text(`OFFICIAL ADMINISTRATIVE EXPORT - ${type.toUpperCase()} REPORTS`, 30, 48);

      // Metas
      doc.fillColor('#475569').font('Helvetica').fontSize(9).text(`Filter Dates: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`, 30, 95);
      doc.text(`Generated On: ${new Date().toLocaleString()}`, 400, 95);
      doc.text(`Total Records: ${data.length}`, 30, 110);
      doc.moveTo(30, 125).lineTo(582, 125).stroke('#E2E8F0');

      let yPos = 145;

      data.forEach((item, idx) => {
        // Handle page breaking
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }

        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(12).text(`${idx + 1}. ${item.fullName || item.startupName || item.title || 'Record'}`, 30, yPos);
        
        doc.fillColor('#475569').font('Helvetica').fontSize(9);
        if (type === 'users') {
          doc.text(`Email: ${item.email}  |  Student ID: ${item.studentId}  |  Dept: ${item.department}`, 40, yPos + 18);
          doc.text(`Registered: ${new Date(item.createdAt).toLocaleDateString()}`, 40, yPos + 32);
          yPos += 55;
        } else if (type === 'startups') {
          doc.text(`Category: ${item.category}  |  Stage: ${item.stage}  |  Status: ${item.status}`, 40, yPos + 18);
          doc.text(`Founder: ${item.founderName}  |  Contact: ${item.email}`, 40, yPos + 32);
          yPos += 55;
        } else if (type === 'proposals') {
          doc.text(`Category: ${item.category}  |  Status: ${item.status}  |  Tech: ${item.technologies}`, 40, yPos + 18);
          doc.text(`Abstract: ${item.abstract ? item.abstract.substring(0, 120) + '...' : 'N/A'}`, 40, yPos + 32);
          yPos += 65;
        } else if (type === 'incubations') {
          doc.text(`Startup ID: ${item.startupId?._id || item.startupId || 'N/A'}  |  Status: ${item.status}`, 40, yPos + 18);
          doc.text(`Progress: ${item.progress.substring(0, 100)}...`, 40, yPos + 32);
          yPos += 60;
        } else if (type === 'progress') {
          doc.text(`Weekly progress log: ${item.title}  |  Rating: ${item.mentorRating || 'Pending'}  |  Status: ${item.status}`, 40, yPos + 18);
          doc.text(`Summary: ${item.summary.substring(0, 100)}...`, 40, yPos + 32);
          yPos += 60;
        }
      });

      doc.end();
      return;
    }

    return res.status(400).send('Invalid export format requested');
  } catch (error) {
    console.error('Data Export Error:', error);
    return res.status(500).json({ message: 'Server error compiling reports' });
  }
};

module.exports = {
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
};
