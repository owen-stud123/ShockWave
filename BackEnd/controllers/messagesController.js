import db from '../config/database.js';

// Helper function (no changes)
const generateThreadId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

// @desc    Get all message threads for the logged-in user
// @route   GET /api/messages/threads
// @access  Private
export const getMessageThreads = (req, res, next) => {
  // --- ULTIMATE DEBUGGING VERSION ---
  console.log('\n\n--- [ULTIMATE DEBUG] GETTING MESSAGE THREADS ---');
  try {
    if (!req.user) {
      console.error('[DEBUG] FATAL: req.user is missing. User is not authenticated.');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userId = req.user.id;
    console.log(`[DEBUG] Authenticated user ID is: ${userId}`);

    // Step 1: Get ALL messages from the database to inspect them.
    const allMessages = db.prepare('SELECT * FROM messages').all();
    console.log(`[DEBUG] Found a total of ${allMessages.length} messages in the entire database.`);
    // console.log(allMessages); // Uncomment this line if you need to see every single message

    // Step 2: Manually filter messages in JavaScript to find ones involving our user.
    const userMessages = allMessages.filter(m => m.sender_id === userId || m.recipient_id === userId);
    console.log(`[DEBUG] Found ${userMessages.length} messages involving user ${userId}.`);

    if (userMessages.length === 0) {
      console.log('[DEBUG] No messages found for this user. Sending empty array to frontend.');
      console.log('--- [ULTIMATE DEBUG] END ---');
      return res.json([]);
    }

    // Step 3: Group messages by thread_id.
    const threadsMap = new Map();
    for (const message of userMessages) {
      if (!threadsMap.has(message.thread_id)) {
        threadsMap.set(message.thread_id, []);
      }
      threadsMap.get(message.thread_id).push(message);
    }
    console.log(`[DEBUG] Grouped messages into ${threadsMap.size} unique conversation threads.`);

    // Step 4: Process each thread to get the final data structure.
    const threads = [];
    for (const [threadId, messagesInThread] of threadsMap.entries()) {
      // Sort to find the last message
      messagesInThread.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const lastMessage = messagesInThread[0];
      
      const participantId = (lastMessage.sender_id === userId) ? lastMessage.recipient_id : lastMessage.sender_id;
      
      const participant = db.prepare('SELECT id, name FROM users WHERE id = ?').get(participantId);

      if (participant) {
        threads.push({
          thread_id: threadId,
          last_message: lastMessage.body,
          last_message_date: lastMessage.created_at,
          participant_id: participant.id,
          participant_name: participant.name,
        });
      } else {
        console.warn(`[DEBUG] Could not find participant with ID: ${participantId} for thread: ${threadId}`);
      }
    }

    // Final sort
    threads.sort((a, b) => new Date(b.last_message_date) - new Date(a.last_message_date));
    
    console.log(`[DEBUG] Successfully processed ${threads.length} threads to send to frontend.`);
    console.log(threads);
    console.log('--- [ULTIMATE DEBUG] END ---');
    
    res.json(threads);
  } catch (error) {
    console.error("CRITICAL ERROR in getMessageThreads:", error);
    next(error);
  }
};

// getMessagesInThread function remains the same
export const getMessagesInThread = (req, res, next) => {
  // ... (no changes needed here)
};