const SuccessStory = require('../models/SuccessStory');

// Mock database storage
global.mockSuccessStories = global.mockSuccessStories || [
  {
    _id: 'story_default_1',
    startupName: 'EduAI Solutions',
    founderName: 'Aditya Sen (CSE Class of \'25)',
    achievement: 'Raised seed round funding',
    fundingRaised: '₹25 Lakhs',
    awards: 'Best Campus Innovator 2025',
    content: 'EduAI Solutions is a technology startup specializing in customized tutoring pipelines. Using local LLMs, it tracks secondary school learning metrics to adapt educational materials. Incubated at college innovation phase 2, it recently raised ₹25 Lakhs from local angel syndicates and is scaling deployment to 10 schools.',
    coverImage: '',
    createdAt: new Date(),
  },
  {
    _id: 'story_default_2',
    startupName: 'EcoDrive Motors',
    founderName: 'Riya Patel & Team (Mech + EEE \'24)',
    achievement: 'NIDHI-PRAYAS Research Grant Recipient',
    fundingRaised: '₹10 Lakhs',
    awards: 'National CleanTech Showcase Winner',
    content: 'EcoDrive Motors provides retrofit EV drive trains for light cargo wheelers. By optimizing battery pack cell configuration, they reduced charging time by 40% while preserving load carrying capacity. Supported by NIDHI-PRAYAS seed grant, they are conducting pilot testing with local delivery fleets.',
    coverImage: '',
    createdAt: new Date(),
  },
];

/**
 * @desc    Create a success story
 * @route   POST /api/stories
 * @access  Private (Admin Only)
 */
const createStory = async (req, res) => {
  try {
    const { startupName, founderName, achievement, fundingRaised, awards, content } = req.body;

    if (!startupName || !founderName || !achievement || !fundingRaised || !awards || !content) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    let coverImagePath = '';
    if (req.file) {
      coverImagePath = `uploads/${req.file.filename}`;
    }

    if (global.isMockDB) {
      const mockId = 'story_' + Math.random().toString(36).substring(2, 9);
      const story = {
        _id: mockId,
        startupName,
        founderName,
        achievement,
        fundingRaised,
        awards,
        content,
        coverImage: coverImagePath,
        createdAt: new Date(),
      };
      global.mockSuccessStories.push(story);
      return res.status(201).json(story);
    }

    const story = await SuccessStory.create({
      startupName,
      founderName,
      achievement,
      fundingRaised,
      awards,
      content,
      coverImage: coverImagePath,
    });

    return res.status(201).json(story);
  } catch (error) {
    console.error('Create Success Story Error:', error);
    return res.status(500).json({ message: 'Server error publishing success story' });
  }
};

/**
 * @desc    Get all success stories
 * @route   GET /api/stories
 * @access  Public
 */
const getStories = async (req, res) => {
  try {
    if (global.isMockDB) {
      return res.status(200).json(global.mockSuccessStories);
    }

    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    return res.status(200).json(stories);
  } catch (error) {
    console.error('Get Success Stories Error:', error);
    return res.status(500).json({ message: 'Server error fetching success stories' });
  }
};

/**
 * @desc    Get success story by ID
 * @route   GET /api/stories/:id
 * @access  Public
 */
const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const story = global.mockSuccessStories.find(s => s._id === id);
      if (!story) {
        return res.status(404).json({ message: 'Success story not found' });
      }
      return res.status(200).json(story);
    }

    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }

    return res.status(200).json(story);
  } catch (error) {
    console.error('Get Success Story Detail Error:', error);
    return res.status(500).json({ message: 'Server error fetching success story details' });
  }
};

/**
 * @desc    Update success story by ID
 * @route   PUT /api/stories/:id
 * @access  Private (Admin Only)
 */
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.coverImage = `uploads/${req.file.filename}`;
    }

    if (global.isMockDB) {
      const index = global.mockSuccessStories.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Success story not found' });
      }

      const updatedStory = {
        ...global.mockSuccessStories[index],
        ...updateData,
        updatedAt: new Date(),
      };
      global.mockSuccessStories[index] = updatedStory;
      return res.status(200).json(updatedStory);
    }

    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }

    const updatedStory = await SuccessStory.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json(updatedStory);
  } catch (error) {
    console.error('Update Success Story Error:', error);
    return res.status(500).json({ message: 'Server error updating success story' });
  }
};

/**
 * @desc    Delete success story by ID
 * @route   DELETE /api/stories/:id
 * @access  Private (Admin Only)
 */
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.isMockDB) {
      const index = global.mockSuccessStories.findIndex(s => s._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Success story not found' });
      }
      global.mockSuccessStories.splice(index, 1);
      return res.status(200).json({ success: true, message: 'Success story deleted successfully' });
    }

    const story = await SuccessStory.findById(id);
    if (!story) {
      return res.status(404).json({ message: 'Success story not found' });
    }

    await SuccessStory.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Success story deleted successfully' });
  } catch (error) {
    console.error('Delete Success Story Error:', error);
    return res.status(500).json({ message: 'Server error deleting success story' });
  }
};

module.exports = {
  createStory,
  getStories,
  getStoryById,
  updateStory,
  deleteStory,
};
