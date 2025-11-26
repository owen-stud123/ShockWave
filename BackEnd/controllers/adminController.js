import User from '../models/userModel.js';
import Listing from '../models/listingModel.js';
import Order from '../models/orderModel.js';
import Message from '../models/messageModel.js';

// @desc    Get all users with stats
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const total = await User.countDocuments({ role: { $ne: 'admin' } });
    
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('name email role is_active created_at')
      .skip(skip)
      .limit(limit)
      .lean();
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + users.length < total
      }
    });
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
        User.countDocuments({ role: { $ne: 'admin' } }),
        User.countDocuments({ role: 'designer' }),
        User.countDocuments({ role: 'business' }),
        Listing.countDocuments()
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      { $match: { created_at: { $gte: thirtyDaysAgo }, role: { $ne: 'admin' } } },
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        
        // Use aggregation for efficient pagination
        const threads = await Message.aggregate([
            { $sort: { created_at: -1 } },
            {
                $group: {
                    _id: '$thread_id',
                    last_message: { $first: '$body' },
                    last_message_date: { $first: '$created_at' },
                    is_flagged: { $first: '$is_flagged' },
                    sender: { $first: '$sender' },
                    recipient: { $first: '$recipient' }
                }
            },
            { $sort: { last_message_date: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'senderInfo'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'recipient',
                    foreignField: '_id',
                    as: 'recipientInfo'
                }
            },
            { $unwind: { path: '$senderInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$recipientInfo', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    thread_id: '$_id',
                    participants: [
                        { id: '$senderInfo._id', name: '$senderInfo.name' },
                        { id: '$recipientInfo._id', name: '$recipientInfo.name' }
                    ],
                    last_message: 1,
                    last_message_date: 1,
                    is_flagged: 1,
                    _id: 0
                }
            }
        ]);
        
        // Get total count
        const totalThreads = await Message.distinct('thread_id').then(ids => ids.length);

        res.json({
            threads,
            pagination: {
                page,
                limit,
                total: totalThreads,
                totalPages: Math.ceil(totalThreads / limit),
                hasMore: (page * limit) < totalThreads
            }
        });
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