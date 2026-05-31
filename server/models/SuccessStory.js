const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema(
  {
    startupName: {
      type: String,
      required: [true, 'Please provide startup name'],
      trim: true,
    },
    founderName: {
      type: String,
      required: [true, 'Please provide founder name'],
      trim: true,
    },
    achievement: {
      type: String,
      required: [true, 'Please specify major achievement'],
    },
    fundingRaised: {
      type: String,
      required: [true, 'Please specify funding raised'],
      trim: true,
    },
    awards: {
      type: String,
      required: [true, 'Please specify awards received'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the success story details'],
    },
    coverImage: {
      type: String, // Relative path to cover image upload
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);
