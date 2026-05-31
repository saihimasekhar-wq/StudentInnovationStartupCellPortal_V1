const mongoose = require('mongoose');

const LoginActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    deviceInfo: {
      type: String,
      default: 'Unknown Device',
    },
    browserInfo: {
      type: String,
      default: 'Unknown Browser',
    },
  },
  {
    timestamps: false, // loginTime is already recorded
  }
);

module.exports = mongoose.model('LoginActivity', LoginActivitySchema);
