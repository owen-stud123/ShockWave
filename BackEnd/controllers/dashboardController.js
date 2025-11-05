import db from '../config/database.js';

// @desc    Get dashboard stats for the logged-in user
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = (req, res, next) => {
  try {
    // --- DEBUGGING STEP 1 ---
    // Log to confirm the function is being called and we have the correct user.
    console.log('--- Fetching Dashboard Stats ---');
    if (!req.user) {
      console.error('ERROR: req.user is not defined. Middleware might have failed.');
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userId = req.user.id;
    const role = req.user.role;
    console.log(`User ID: ${userId}, Role: ${role}`);

    let activeProjectsQuery;
    let financialQuery;

    if (role === 'designer') {
      activeProjectsQuery = `SELECT COUNT(id) as count FROM orders WHERE seller_id = ? AND status IN ('in_progress', 'delivered')`;
      financialQuery = `SELECT SUM(amount) as total FROM orders WHERE seller_id = ? AND status = 'completed'`;
    } else { // 'business' role
      activeProjectsQuery = `SELECT COUNT(id) as count FROM orders WHERE buyer_id = ? AND status IN ('in_progress', 'delivered')`;
      financialQuery = `SELECT SUM(amount) as total FROM orders WHERE buyer_id = ? AND status = 'completed'`;
    }

    const reviewsReceivedQuery = `SELECT COUNT(id) as count FROM reviews WHERE reviewee_id = ?`;
    const unreadMessagesQuery = `SELECT COUNT(id) as count FROM messages WHERE recipient_id = ? AND is_read = 0`;

    // Execute queries
    const projectsResult = db.prepare(activeProjectsQuery).get(userId);
    const financialResult = db.prepare(financialQuery).get(userId);
    const reviewsResult = db.prepare(reviewsReceivedQuery).get(userId);
    const messagesResult = db.prepare(unreadMessagesQuery).get(userId);

    // --- DEBUGGING STEP 2 ---
    // Log the raw results from the database queries.
    console.log('Raw DB Results:');
    console.log('  Projects:', projectsResult);
    console.log('  Financial:', financialResult);
    console.log('  Reviews:', reviewsResult);
    console.log('  Messages:', messagesResult);

    const stats = {
      projects: projectsResult?.count || 0,
      earnings: financialResult?.total || 0.00,
      reviews: reviewsResult?.count || 0,
      messages: messagesResult?.count || 0,
    };

    // --- DEBUGGING STEP 3 ---
    // Log the final JSON object being sent to the frontend.
    console.log('Final Stats Object Sent to Frontend:', stats);
    console.log('--------------------------------\n');

    res.json(stats);
  } catch (error) {
    console.error("CRITICAL ERROR in getDashboardStats:", error);
    next(error);
  }
};