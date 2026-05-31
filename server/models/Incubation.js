const mongoose = require('mongoose');

const IncubationSchema = new mongoose.Schema(
  {
    startupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup',
      required: true,
    },
    progress: {
      type: String,
      required: [true, 'Please explain current startup progress'],
    },
    fundingRequirement: {
      type: String,
      required: [true, 'Please explain funding requirements'],
    },
    whyIncubation: {
      type: String,
      required: [true, 'Please explain why incubation space is needed'],
    },
    expectedSupport: {
      type: String,
      required: [true, 'Please explain expected support (mentorship, lab credits, etc.)'],
    },
    futureGoals: {
      type: String,
      required: [true, 'Please outline future goals'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
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

module.exports = mongoose.model('Incubation', IncubationSchema);
