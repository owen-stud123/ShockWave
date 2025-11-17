import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// Helper function
const generateThreadId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

// @desc    Get all message threads for the logged-in user
// @route   GET /api/messages/threads
// @access  Private
export const getMessageThreads = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userId = req.user.id;

    // Get all unique thread_ids where user is sender or recipient
    const allMessages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
    .sort({ created_at: -1 })
    .populate('sender recipient', 'name')
    .lean();

    // Group by thread_id and get the latest message for each
    const threadMap = new Map();
    allMessages.forEach(msg => {
      if (!threadMap.has(msg.thread_id)) {
        const participant_id = msg.sender._id.toString() === userId.toString() 
          ? msg.recipient._id 
          : msg.sender._id;
        const participant_name = msg.sender._id.toString() === userId.toString()
          ? msg.recipient.name
          : msg.sender.name;
        
        threadMap.set(msg.thread_id, {
          thread_id: msg.thread_id,
          participant_id,
          participant_name,
          last_message: msg.body,
          last_message_date: msg.created_at
        });
      }
    });

    const threads = Array.from(threadMap.values());
    res.json(threads);
  } catch (error) {
    console.error("CRITICAL ERROR in getMessageThreads:", error);
    next(error);
  }
};

// Get all messages within a specific thread (with a participant)

export const getMessagesInThread = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const participantId = req.params.participantId;
        const thread_id = generateThreadId(userId, participantId);

        const messages = await Message.find({ thread_id })
          .sort({ created_at: 1 })
          .lean();

        // Mark messages as read
        await Message.updateMany(
          { thread_id, recipient: userId, is_read: false },
          { is_read: true }
        );

        res.json(messages);
    } catch (error) {
        console.error("Error in getMessagesInThread:", error);
        next(error);
    }
};