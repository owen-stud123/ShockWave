import { validationResult } from 'express-validator';
import ProgressUpdate from '../models/progressUpdateModel.js';
import Order from '../models/orderModel.js';

// @desc    Create a new progress update for an order
// @route   POST /api/orders/:orderId/updates
// @access  Private (Designer only)
export const createProgressUpdate = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId } = req.params;
        const { message } = req.body;
        const authorId = req.user.id;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Ensure the person posting the update is the seller (designer) on the order
        if (order.seller.toString() !== authorId) {
            return res.status(403).json({ error: 'You are not authorized to post an update to this order.' });
        }
        
        // Ensure updates can only be posted while the project is active
        if (order.status !== 'in_progress' && order.status !== 'delivered') {
            return res.status(400).json({ error: 'Progress updates can only be added to active or delivered projects.' });
        }

        const newUpdate = new ProgressUpdate({
            order: orderId,
            author: authorId,
            message,
            // Attachments can be handled here in the future if you add file uploads for updates
        });

        await newUpdate.save();
        
        // Populate author info for the immediate response to the client
        const populatedUpdate = await ProgressUpdate.findById(newUpdate._id)
            .populate('author', 'name role')
            .lean();

        res.status(201).json({ message: 'Progress update posted successfully', update: populatedUpdate });
    } catch (error) {
        next(error);
    }
};