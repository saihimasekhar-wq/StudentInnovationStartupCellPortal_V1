const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { fullName, email, studentId, department, password } = req.body;

    // Simple validation
    if (!fullName || !email || !studentId || !department || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // FALLBACK SIMULATION DATABASE
    if (global.isMockDB) {
      global.mockUsers = global.mockUsers || [];
      const userExistsByEmail = global.mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (userExistsByEmail) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const userExistsByStudentId = global.mockUsers.find(
        (u) => u.studentId.trim() === studentId.trim()
      );
      if (userExistsByStudentId) {
        return res.status(400).json({ message: 'An account with this Student ID already exists' });
      }

      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const mockId = 'mock_' + Math.random().toString(36).substring(2, 9);
      const user = {
        _id: mockId,
        fullName,
        email: email.toLowerCase().trim(),
        studentId: studentId.trim(),
        department,
        password: hashedPassword,
        createdAt: new Date(),
      };

      global.mockUsers.push(user);

      return res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
        },
      });
    }

    // Check if user already exists (by email)
    const userExistsByEmail = await User.findOne({ email });
    if (userExistsByEmail) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // Check if user already exists (by studentId)
    const userExistsByStudentId = await User.findOne({ studentId });
    if (userExistsByStudentId) {
      return res.status(400).json({ message: 'An account with this Student ID already exists' });
    }

    // Create user (password will be hashed automatically by Schema pre-save hook)
    const user = await User.create({
      fullName,
      email,
      studentId,
      department,
      password,
    });

    if (user) {
      return res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // User-Agent details parsing
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const browserInfo = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Other Browser';
    const deviceInfo = userAgent.includes('Windows') ? 'Windows PC' : userAgent.includes('Macintosh') ? 'macOS' : userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop';

    // FALLBACK SIMULATION DATABASE
    if (global.isMockDB) {
      global.mockUsers = global.mockUsers || [];
      global.mockMentors = global.mockMentors || [];
      
      // 1. Check students
      let user = global.mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
      let isMentor = false;

      if (!user) {
        // 2. Check mentors
        user = global.mockMentors.find(m => m.email.toLowerCase() === cleanEmail);
        if (user) {
          isMentor = true;
        }
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const bcrypt = require('bcryptjs');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Record Login Activity
      global.mockLoginHistory = global.mockLoginHistory || [];
      global.mockLoginHistory.push({
        _id: 'login_' + Date.now(),
        userId: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        loginTime: new Date(),
        ipAddress: ip,
        deviceInfo,
        browserInfo,
      });

      return res.status(200).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          fullName: user.fullName || user.name,
          email: user.email,
          studentId: user.studentId || 'N/A',
          department: user.department || user.expertise || 'Adviser',
          role: isMentor ? 'mentor' : 'student',
        },
      });
    }

    // Connect to database
    // 1. Try finding student
    let user = await User.findOne({ email: cleanEmail });
    let isMentor = false;

    if (!user) {
      // 2. Try finding mentor
      const Mentor = require('../models/Mentor');
      user = await Mentor.findOne({ email: cleanEmail });
      if (user) {
        isMentor = true;
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify Password
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Record Login Activity
    const LoginActivity = require('../models/LoginActivity');
    await LoginActivity.create({
      userId: user._id.toString(),
      fullName: user.fullName || user.name,
      email: user.email,
      ipAddress: ip,
      deviceInfo,
      browserInfo,
    });

    return res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName || user.name,
        email: user.email,
        studentId: user.studentId || 'N/A',
        department: user.department || user.expertise || 'Adviser',
        role: isMentor ? 'mentor' : 'student',
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Get current user notifications
 * @route   GET /api/auth/notifications
 * @access  Private
 */
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    if (global.isMockDB) {
      global.mockNotifications = global.mockNotifications || [];
      const list = global.mockNotifications
        .filter(n => n.targetUserId?.toString() === userId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json(list);
    }

    const Notification = require('../models/Notification');
    const list = await Notification.find({ targetUserId: userId.toString() })
      .sort({ createdAt: -1 });
    return res.status(200).json(list);
  } catch (error) {
    console.error('Fetch Notifications Error:', error);
    return res.status(500).json({ message: 'Server error retrieving notifications' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserNotifications,
};
