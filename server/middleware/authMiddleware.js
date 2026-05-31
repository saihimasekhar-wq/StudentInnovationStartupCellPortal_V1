const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (excluding password)
      if (global.isMockDB) {
        global.mockUsers = global.mockUsers || [];
        global.mockMentors = global.mockMentors || [];
        global.mockAdmins = global.mockAdmins || [];
        
        let found = global.mockUsers.find((u) => u._id === decoded.id);
        if (!found) {
          found = global.mockMentors.find((m) => m._id === decoded.id);
          if (found) {
            found = { ...found, role: 'mentor' };
          }
        }
        if (!found && decoded.id === 'admin_default') {
          found = { _id: 'admin_default', name: 'College Startup Cell Admin', email: 'admin@startupcell.edu', role: 'admin' };
        }
        if (!found) {
          found = global.mockAdmins.find((a) => a._id === decoded.id);
          if (found) {
            found = { ...found, role: 'admin' };
          }
        }
        req.user = found;
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          const Mentor = require('../models/Mentor');
          const mentor = await Mentor.findById(decoded.id).select('-password');
          if (mentor) {
            req.user = mentor;
            req.user.role = 'mentor';
          }
        }
        if (!req.user) {
          const Admin = require('../models/Admin');
          const admin = await Admin.findById(decoded.id).select('-password');
          if (admin) {
            req.user = admin;
            req.user.role = 'admin';
          }
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found in system' });
      }

      next();
    } catch (error) {
      console.error('Token validation error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
