/**
 * Chat utility functions
 */

/**
 * Generate a deterministic thread ID for two users
 * @param {string} userId1 - First user ID
 * @param {string} userId2 - Second user ID
 * @returns {string} Thread ID in format "thread_<smaller_id>_<larger_id>"
 */
export const generateThreadId = (userId1, userId2) => {
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `thread_${ids[0]}_${ids[1]}`;
};

/**
 * Extract user IDs from a thread ID
 * @param {string} threadId - Thread ID in format "thread_<id1>_<id2>"
 * @returns {Array<string>} Array of two user IDs
 */
export const parseThreadId = (threadId) => {
  const parts = threadId.replace('thread_', '').split('_');
  return parts;
};

/**
 * Check if a user is part of a thread
 * @param {string} threadId - Thread ID
 * @param {string} userId - User ID to check
 * @returns {boolean} True if user is part of the thread
 */
export const isUserInThread = (threadId, userId) => {
  const userIds = parseThreadId(threadId);
  return userIds.includes(userId.toString());
};
