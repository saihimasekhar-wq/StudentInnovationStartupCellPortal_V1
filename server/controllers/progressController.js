const Progress = require('../models/Progress');
const Startup = require('../models/Startup');

// Mock database storage
global.mockProgressList = global.mockProgressList || [];

/**
 * @desc    Submit a weekly progress report
 * @route   POST /api/progress
 * @access  Private
 */
const submitProgress = async (req, res) => {
  try {
    const {
      startupId,
      title,
      summary,
      achievements,
      challenges,
      nextMilestone,
    } = req.body;

    if (!startupId || !title || !summary || !achievements || !challenges || !nextMilestone) {
      return res.status(400).json({ message: 'Please enter all required fields' });
    }

    const userId = (req.user.id || req.user._id).toString();

    // Verify startup ownership
    if (global.isMockDB) {
      const startup = global.mockStartups.find(s => s._id === startupId);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      if (startup.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to report progress on this startup' });
      }
    } else {
      const startup = await Startup.findById(startupId);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      if (startup.createdBy.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to report progress on this startup' });
      }
    }

    let evidencePath = '';
    if (req.file) {
      evidencePath = `uploads/${req.file.filename}`;
    }

    if (global.isMockDB) {
      const mockId = 'progress_' + Math.random().toString(36).substring(2, 9);
      const progress = {
        _id: mockId,
        startupId,
        title,
        summary,
        achievements,
        challenges,
        nextMilestone,
        evidence: evidencePath,
        status: 'Submitted',
        mentorRating: null,
        mentorComment: '',
        reviewedBy: null,
        submittedBy: userId,
        createdAt: new Date(),
      };
      global.mockProgressList.push(progress);
      return res.status(201).json(progress);
    }

    const progress = await Progress.create({
      startupId,
      title,
      summary,
      achievements,
      challenges,
      nextMilestone,
      evidence: evidencePath,
      submittedBy: userId,
    });

    return res.status(201).json(progress);
  } catch (error) {
    console.error('Submit Progress Error:', error);
    return res.status(500).json({ message: 'Server error filing progress report' });
  }
};

/**
 * @desc    Get progress reports timeline history for a specific startup
 * @route   GET /api/progress/startup/:startupId
 * @access  Private
 */
const getStartupTimeline = async (req, res) => {
  try {
    const { startupId } = req.params;
    const userId = (req.user.id || req.user._id).toString();

    // Verify access rights (creator, assigned mentor, or admin)
    if (global.isMockDB) {
      const startup = global.mockStartups.find(s => s._id === startupId);
      if (!startup) {
        return res.status(404).json({ message: 'Startup not found' });
      }
      
      const isCreator = startup.createdBy.toString() === userId;
      const isMentor = req.user.role === 'mentor' && startup.assignedMentor?.toString() === userId;
      const isAdmin = req.user.role === 'admin';

      if (!isCreator && !isMentor && !isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view progress timeline' });
      }

      const timeline = global.mockProgressList
        .filter(p => p.startupId === startupId)
        .sort((a, b) => b.createdAt - a.createdAt); // newest first

      return res.status(200).json(timeline);
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    const isCreator = startup.createdBy.toString() === userId;
    const isMentor = req.user.role === 'mentor' && startup.assignedMentor?.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isMentor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view progress timeline' });
    }

    const timeline = await Progress.find({ startupId })
      .populate('reviewedBy', 'name expertise designation')
      .sort({ createdAt: -1 });

    return res.status(200).json(timeline);
  } catch (error) {
    console.error('Get Timeline Error:', error);
    return res.status(500).json({ message: 'Server error retrieving timeline' });
  }
};

/**
 * @desc    Review and rate weekly progress reports
 * @route   PUT /api/progress/:id/review
 * @access  Private (Mentors Only)
 */
const reviewProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorRating, mentorComment } = req.body;
    const mentorId = (req.user.id || req.user._id).toString();

    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only assigned mentors can review weekly progress logs' });
    }

    if (!mentorRating || !mentorComment) {
      return res.status(400).json({ message: 'Please provide both rating and comment' });
    }

    const ratingVal = parseInt(mentorRating);
    if (ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    if (global.isMockDB) {
      const index = global.mockProgressList.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Progress report not found' });
      }

      // Verify that this mentor is assigned to the startup
      const startup = global.mockStartups.find(s => s._id === global.mockProgressList[index].startupId);
      if (!startup || startup.assignedMentor?.toString() !== mentorId) {
        return res.status(403).json({ message: 'You are not assigned as mentor for this startup' });
      }

      const updatedProgress = {
        ...global.mockProgressList[index],
        status: 'Reviewed',
        mentorRating: ratingVal,
        mentorComment,
        reviewedBy: mentorId,
        updatedAt: new Date(),
      };
      global.mockProgressList[index] = updatedProgress;
      
      // Auto notification to student
      global.mockNotifications = global.mockNotifications || [];
      global.mockNotifications.push({
        _id: 'notif_' + Date.now(),
        title: 'Weekly Progress Reviewed',
        message: `Your progress report "${updatedProgress.title}" has been reviewed and rated ${ratingVal}/5 stars by mentor ${req.user.name}.`,
        targetUserId: updatedProgress.submittedBy,
        createdAt: new Date()
      });

      return res.status(200).json(updatedProgress);
    }

    const progress = await Progress.findById(id);
    if (!progress) {
      return res.status(404).json({ message: 'Progress report not found' });
    }

    const startup = await Startup.findById(progress.startupId);
    if (!startup || startup.assignedMentor?.toString() !== mentorId) {
      return res.status(403).json({ message: 'You are not assigned as mentor for this startup' });
    }

    const updatedProgress = await Progress.findByIdAndUpdate(
      id,
      {
        status: 'Reviewed',
        mentorRating: ratingVal,
        mentorComment,
        reviewedBy: mentorId,
      },
      { new: true }
    );

    // Trigger Notification
    const Notification = require('../models/Notification');
    await Notification.create({
      title: 'Weekly Progress Reviewed',
      message: `Your progress report "${progress.title}" has been reviewed and rated ${ratingVal}/5 stars by mentor ${req.user.name}.`,
      targetUserId: progress.submittedBy.toString(),
    });

    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error('Review Progress Error:', error);
    return res.status(500).json({ message: 'Server error submitting progress review' });
  }
};

module.exports = {
  submitProgress,
  getStartupTimeline,
  reviewProgress,
};
