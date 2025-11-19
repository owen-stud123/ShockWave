import User from '../models/userModel.js';
import Listing from '../models/listingModel.js';
import Order from '../models/orderModel.js';
import Message from '../models/messageModel.js';

// @desc    Get all users with stats
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('name email role is_active created_at').lean();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend or reactivate a user
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') return res.status(400).json({ error: 'is_active must be a boolean' });

    const user = await User.findByIdAndUpdate(id, { is_active }, { new: true }).select('id name email role is_active');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: `User status updated successfully`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Admin
export const getPlatformAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalDesigners, totalBusinesses, totalProjects] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'designer' }),
        User.countDocuments({ role: 'business' }),
        Listing.countDocuments()
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      { $match: { created_at: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    
    const projectGrowth = await Listing.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      summary: { totalUsers, totalDesigners, totalBusinesses, totalProjects },
      charts: { userGrowth, projectGrowth }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all message threads for moderation
// @route   GET /api/admin/messages
// @access  Admin
export const getAllMessageThreads = async (req, res, next) => {
    try {
        const allMessages = await Message.find({})
            .sort({ created_at: -1 })
            .populate('sender', 'name')
            .populate('recipient', 'name')
            .lean();

        const threadMap = new Map();
        allMessages.forEach(msg => {
            if (!threadMap.has(msg.thread_id)) {
                threadMap.set(msg.thread_id, {
                    thread_id: msg.thread_id,
                    participants: [
                        { id: msg.sender._id, name: msg.sender.name },
                        { id: msg.recipient._id, name: msg.recipient.name }
                    ],
                    last_message: msg.body,
                    last_message_date: msg.created_at,
                    is_flagged: msg.is_flagged, // Include the flag status
                });
            }
        });

        const threads = Array.from(threadMap.values());
        res.json(threads);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all messages in a specific thread (for moderation)
// @route   GET /api/admin/messages/:threadId
// @access  Admin
export const getMessagesForModeration = async (req, res, next) => {
    try {
        const { threadId } = req.params;
        const messages = await Message.find({ thread_id: threadId })
            .populate('sender', 'name role')
            .sort({ created_at: 'asc' })
            .lean();
            
        if (!messages.length) return res.status(404).json({ error: 'Message thread not found.' });
        
        res.json(messages);
    } catch (error) {
        next(error);
    }
};

// @desc    Flag or unflag a message thread
// @route   PATCH /api/admin/messages/:threadId/flag
// @access  Admin
export const toggleFlagMessageThread = async (req, res, next) => {
    try {
        const { threadId } = req.params;
        const firstMessage = await Message.findOne({ thread_id: threadId });
        if (!firstMessage) return res.status(404).json({ error: 'Message thread not found.' });

        const newFlagState = !firstMessage.is_flagged;
        await Message.updateMany({ thread_id: threadId }, { $set: { is_flagged: newFlagState } });

        res.json({ message: `Thread has been ${newFlagState ? 'flagged' : 'unflagged'}.`, is_flagged: newFlagState });
    } catch (error) {
        next(error);
    }
};