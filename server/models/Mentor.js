const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide mentor name'],
      trim: true,
    },
    expertise: {
      type: String,
      required: [true, 'Please specify mentor expertise'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide mentor email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide mentor phone number'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Please specify mentor designation/organization'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      default: '$2a$10$x82R3.kQhGjZ7yqVd/B3U.tK/Z35Z1oT.mH7V3iQpQ4m1k5t7t5t2', // Default: Mentor@123 hashed
    },
    role: {
      type: String,
      default: 'mentor',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
MentorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
MentorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Mentor', MentorSchema);
