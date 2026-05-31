const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide proposal title'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify innovation category'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Please provide proposal abstract'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Please provide problem statement'],
    },
    innovation: {
      type: String,
      required: [true, 'Please outline proposed innovation'],
    },
    impact: {
      type: String,
      required: [true, 'Please outline expected impact'],
    },
    technologies: {
      type: String,
      required: [true, 'Please specify technologies used'],
      trim: true,
    },
    teamMembers: {
      type: String,
      required: [true, 'Please specify team members'],
    },
    department: {
      type: String,
      required: [true, 'Please select your department'],
    },
    proposalDocument: {
      type: String, // Relative path to main PDF document
    },
    supportingFiles: {
      type: String, // Relative path to supporting PDF/DOC files
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
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Proposal', ProposalSchema);
