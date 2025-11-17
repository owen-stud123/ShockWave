import Order from '../models/orderModel.js';
import Review from '../models/reviewModel.js';
import Message from '../models/messageModel.js';

// Get dashboard stats for the logged-in user

export const getDashboardStats = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const userId = req.user.id;
    const role = req.user.role;

    let projectsQuery;
    let financialQuery;

    if (role === 'designer') {
      projectsQuery = { seller: userId, status: { $in: ['in_progress', 'delivered'] } };
      financialQuery = { seller: userId, status: 'completed' };
    } else { // 'business' role
      projectsQuery = { buyer: userId, status: { $in: ['in_progress', 'delivered'] } };
      financialQuery = { buyer: userId, status: 'completed' };
    }

    const [projectsCount, financialResult, reviewsCount, messagesCount] = await Promise.all([
      Order.countDocuments(projectsQuery),
      Order.aggregate([
        { $match: financialQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Review.countDocuments({ reviewee: userId }),
      Message.countDocuments({ recipient: userId, is_read: false })
    ]);

    const stats = {
      projects: projectsCount || 0,
      earnings: financialResult[0]?.total || 0.00,
      reviews: reviewsCount || 0,
      messages: messagesCount || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    next(error);
  }
};