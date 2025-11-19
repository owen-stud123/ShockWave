import { validationResult } from 'express-validator';
import Order from '../models/orderModel.js';
import Proposal from '../models/proposalModel.js';
import Listing from '../models/listingModel.js';
import User from '../models/userModel.js';
import ProgressUpdate from '../models/progressUpdateModel.js';

export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { proposal_id } = req.body;
    const buyerId = req.user.id;

    const proposal = await Proposal.findById(proposal_id).populate('listing').populate('designer');
    if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
    if (proposal.listing.owner.toString() !== buyerId) return res.status(403).json({ error: 'You are not authorized' });
    if (!['pending', 'shortlisted'].includes(proposal.status)) return res.status(400).json({ error: 'Proposal already processed' });

    const amount = proposal.price_offered;
    const platform_fee = amount * 0.10;

    const order = new Order({
      buyer: buyerId,
      seller: proposal.designer._id,
      listing: proposal.listing._id,
      proposal: proposal_id,
      amount,
      platform_fee,
      status: 'in_progress' // Set directly to in_progress
    });
    await order.save();

    proposal.status = 'accepted';
    await proposal.save();

    await Listing.findByIdAndUpdate(proposal.listing._id, { status: 'in_progress' });

    res.status(201).json({ 
      message: 'Order created successfully! The project is now active.',
      orderId: order.id
    });
  } catch (error) { next(error); }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = req.user.role === 'designer' ? { seller: userId } : { buyer: userId };
    const orders = await Order.find(query)
      .populate('buyer', 'name')
      .populate('seller', 'name')
      .populate({ path: 'listing', select: 'title' })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders.map(o => ({ ...o, id: o._id, listing_title: o.listing?.title || 'N/A' })));
  } catch (error) { next(error); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name profile.avatar_url')
      .populate('seller', 'name profile.avatar_url')
      .populate('listing', 'title description')
      .populate('proposal', 'price_offered delivery_time')
      .lean();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.buyer._id.toString() !== req.user.id && order.seller._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const updates = await ProgressUpdate.find({ order: req.params.id }).populate('author', 'name role').sort({ created_at: 'asc' }).lean();
    res.json({ ...order, id: order._id, progress_updates: updates });
  } catch (error) { next(error); }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const isBuyer = order.buyer.toString() === req.user.id;
    const isSeller = order.seller.toString() === req.user.id;
    if (!isBuyer && !isSeller) return res.status(403).json({ error: 'Not authorized' });

    const transitions = { in_progress: 'delivered', delivered: 'completed' };
    const roles = { delivered: 'seller', completed: 'buyer' };
    
    if (transitions[order.status] !== status) return res.status(400).json({ error: `Invalid status transition.` });
    if ((roles[status] === 'seller' && !isSeller) || (roles[status] === 'buyer' && !isBuyer)) {
      return res.status(403).json({ error: 'Action not allowed for your role.' });
    }

    order.status = status;
    await order.save();
    if (status === 'completed') await Listing.findByIdAndUpdate(order.listing, { status: 'completed' });

    res.json({ message: 'Order status updated', order });
  } catch (error) { next(error); }
};