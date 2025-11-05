import db from '../config/database.js';

// A thread_id is a unique identifier for a conversation between two users.
// It's created by sorting their IDs and joining them with a hyphen.
// This ensures the same thread_id is always generated for the same two users.
const generateThreadId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

// @desc    Get all message threads for the logged-in user
// @route   GET /api/messages/threads
// @access  Private
export const getMessageThreads = (req, res, next) => {
  try {
    const userId = req.user.id;
    // This query is complex. It finds the most recent message for each conversation
    // the user is a part of and also gets the other participant's name.
    const threads = db.prepare(`
      SELECT 
        m.thread_id,
        m.body as last_message,
        m.created_at as last_message_date,
        u.name as participant_name,
        u.id as participant_id,
        (SELECT COUNT(*) FROM messages WHERE thread_id = m.thread_id AND recipient_id = ? AND is_read = 0) as unread_count
      FROM messages m
      JOIN users u ON u.id = (
        CASE 
          WHEN m.sender_id = ? THEN m.recipient_id 
          ELSE m.sender_id 
        END
      )
      WHERE m.id IN (
        SELECT MAX(id) 
        FROM messages 
        WHERE sender_id = ? OR recipient_id = ? 
        GROUP BY thread_id
      )
      ORDER BY m.created_at DESC
    `).all(userId, userId, userId, userId);
    
    res.json(threads);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages within a specific thread
// @route   GET /api/messages/threads/:participantId
// @access  Private
export const getMessagesInThread = (req, res, next) => {
  try {
    const userId = req.user.id;
    const participantId = parseInt(req.params.participantId, 10);
    const threadId = generateThreadId(userId, participantId);

    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE thread_id = ? 
      ORDER BY created_at ASC
    `).all(threadId);

    // Mark messages as read
    db.prepare(`
      UPDATE messages 
      SET is_read = 1 
      WHERE thread_id = ? AND recipient_id = ?
    `).run(threadId, userId);

    res.json(messages);
  } catch (error) {
    next(error);
  }
};