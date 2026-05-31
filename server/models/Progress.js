const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please specify progress report title'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Please provide weekly summary'],
    },
    achievements: {
      type: String,
      required: [true, 'Please specify weekly achievements'],
    },
    challenges: {
      type: String,
      required: [true, 'Please specify weekly challenges'],
    },
    nextMilestone: {
      type: String,
      required: [true, 'Please specify next milestone goals'],
    },
    evidence: {
      type: String, // Relative path to uploaded file (PDF/Image)
    },
    status: {
      type: String,
      enum: ['Submitted', 'Reviewed'],
      default: 'Submitted',
    },
    mentorRating: {
      type: Number, // 1 to 5 stars
      min: 1,
      max: 5,
    },
    mentorComment: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mentor',
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

module.exports = mongoose.model('Progress', ProgressSchema);
