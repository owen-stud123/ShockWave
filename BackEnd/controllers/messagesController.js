import { validationResult } from 'express-validator';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// @desc    Send a message (creates thread if needed)
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { recipient_id, body, attachments = [] } = req.body;
    const sender_id = req.user.id;

    if (sender_id === recipient_id) {
      return res.status(400).json({ error: 'You cannot send a message to yourself.' });
    }

    // Ensure recipient exists
    const recipient = await User.findById(recipient_id);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    // Generate deterministic thread_id: smaller_id_larger_id
    const ids = [sender_id, recipient_id].sort();
    const thread_id = `thread_${ids[0]}_${ids[1]}`;

    const message = new Message({
      thread_id,
      sender: sender_id,
      recipient: recipient_id,
      body: body.trim(),
      attachments,
    });

    await message.save();

    // Populate sender and recipient for response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name role profile.avatar_url')
      .populate('recipient', 'name role profile.avatar_url')
      .lean();

    res.status(201).json({
      message: 'Message sent successfully',
      data: {
        ...populatedMessage,
        id: populatedMessage._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all threads for the logged-in user
// @route   GET /api/messages/threads
// @access  Private
export const getUserThreads = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const threads = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { created_at: -1 },
      },
      {
        $group: {
          _id: '$thread_id',
          lastMessage: { $first: '$body' },
          lastMessageDate: { $first: '$created_at' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$recipient', userId] }, { $eq: ['$is_read', false] }] },
                1,
                0,
              ],
            },
          },
          otherParticipant: {
            $first: {
              $cond: [
                { $eq: ['$sender', userId] },
                '$recipient',
                '$sender',
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'otherParticipant',
          foreignField: '_id',
          as: 'participantInfo',
        },
      },
      { $unwind: '$participantInfo' },
      {
        $project: {
          thread_id: '$_id',
          last_message: '$lastMessage',
          last_message_date: '$lastMessageDate',
          unread_count: '$unreadCount',
          participant: {
            id: '$participantInfo._id',
            name: '$participantInfo.name',
            avatar_url: '$participantInfo.profile.avatar_url',
            role: '$participantInfo.role',
          },
          _id: 0,
        },
      },
      { $sort: { last_message_date: -1 } },
    ]);

    res.json(threads);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages in a specific thread
// @route   GET /api/messages/:threadId
// @access  Private
export const getMessagesInThread = async (req, res, next) => {
  try {
    const { threadId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({ thread_id: threadId })
      .populate('sender', 'name role profile.avatar_url')
      .populate('recipient', 'name role profile.avatar_url')
      .sort({ created_at: 1 })
      .lean();

    // Security: ensure user is part of this thread
    const isParticipant = messages.some(
      (msg) => msg.sender._id.toString() === userId || msg.recipient._id.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({ error: 'You do not have access to this conversation.' });
    }

    // Mark all messages as read where current user is recipient
    await Message.updateMany(
      { thread_id: threadId, recipient: userId, is_read: false },
      { $set: { is_read: true } }
    );

    const formatted = messages.map((msg) => ({
      id: msg._id,
      thread_id: msg.thread_id,
      body: msg.body,
      attachments: msg.attachments,
      created_at: msg.created_at,
      is_read: msg.is_read,
      sender: {
        id: msg.sender._id,
        name: msg.sender.name,
        role: msg.sender.role,
        avatar_url: msg.sender.profile?.avatar_url || '',
      },
      recipient: {
        id: msg.recipient._id,
        name: msg.recipient.name,
        role: msg.recipient.role,
        avatar_url: msg.recipient.profile?.avatar_url || '',
      },
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};