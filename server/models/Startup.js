const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema(
  {
    startupName: {
      type: String,
      required: [true, 'Please provide startup name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide startup category/domain'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide startup description'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Please outline the problem statement'],
    },
    solution: {
      type: String,
      required: [true, 'Please outline the proposed solution'],
    },
    founderName: {
      type: String,
      required: [true, 'Please provide founder name'],
      trim: true,
    },
    coFounderName: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Please select your department'],
    },
    teamSize: {
      type: Number,
      required: [true, 'Please specify team size'],
    },
    stage: {
      type: String,
      required: [true, 'Please specify current startup stage'],
      enum: ['Idea Stage', 'Prototype', 'MVP', 'Revenue Generating'],
    },
    fundingRequired: {
      type: String,
      required: [true, 'Please specify funding requirements'],
    },
    email: {
      type: String,
      required: [true, 'Please provide contact email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    logo: {
      type: String, // Relative path to logo upload
    },
    pitchDeck: {
      type: String, // Relative path to PDF pitch deck upload
    },
    website: {
      type: String, // Optional website link
      trim: true,
    },
    videoUrl: {
      type: String, // Optional video link
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Request Changes'],
      default: 'Pending',
    },
    adminComment: {
      type: String,
      default: '',
    },
    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Startup', StartupSchema);
