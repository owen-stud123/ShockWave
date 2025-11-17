import { validationResult } from 'express-validator';
import Order from '../models/orderModel.js';
import Proposal from '../models/proposalModel.js';
import Listing from '../models/listingModel.js';
import User from '../models/userModel.js';

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // Find orders where user is either buyer or seller
    const query = role === 'designer' 
      ? { seller: userId } 
      : { buyer: userId };

    const orders = await Order.find(query)
      .populate('buyer', 'name username')
      .populate('seller', 'name username')
      .populate('listing', 'title')
      .populate('proposal', 'price_offered delivery_time')
      .sort({ createdAt: -1 })
      .lean();

    // Format response
    const formattedOrders = orders.map(order => ({
      ...order,
      id: order._id,
      buyer_name: order.buyer?.name,
      seller_name: order.seller?.name,
      listing_title: order.listing?.title,
      price: order.proposal?.price_offered || order.amount,
      created_at: order.createdAt,
      updated_at: order.updatedAt
    }));

    res.json(formattedOrders);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new order (accept proposal)
// @route   POST /api/orders
// @access  Private (Business only)
export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { proposal_id } = req.body;
    const buyer = req.user.id;

    // Verify proposal exists
    const proposal = await Proposal.findById(proposal_id)
      .populate('listing')
      .populate('designer');

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Verify user is the listing owner
    if (proposal.listing.owner.toString() !== buyer) {
      return res.status(403).json({ error: 'You are not authorized to accept this proposal' });
    }

    // Verify proposal is still pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({ error: 'This proposal has already been processed' });
    }

    // Calculate platform fee (10%)
    const amount = proposal.price_offered;
    const platform_fee = amount * 0.10;

    // Create order
    const order = new Order({
      buyer,
      seller: proposal.designer._id,
      listing: proposal.listing._id,
      proposal: proposal_id,
      amount,
      platform_fee,
      status: 'pending'
    });

    await order.save();

    // Update proposal status
    proposal.status = 'accepted';
    await proposal.save();

    // Update listing status
    await Listing.findByIdAndUpdate(proposal.listing._id, { status: 'in_progress' });

    res.status(201).json({ 
      id: order.id, 
      message: 'Order created successfully',
      order: {
        id: order.id,
        amount: order.amount,
        status: order.status,
        seller_name: proposal.designer.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('buyer', 'name username profile.avatar_url')
      .populate('seller', 'name username profile.avatar_url')
      .populate('listing', 'title description')
      .populate('proposal', 'price_offered delivery_time message')
      .lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify user is part of the order
    if (order.buyer._id.toString() !== userId && order.seller._id.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to view this order' });
    }

    // Format response
    const formattedOrder = {
      ...order,
      id: order._id,
      buyer_name: order.buyer.name,
      buyer_avatar: order.buyer.profile?.avatar_url,
      seller_name: order.seller.name,
      seller_avatar: order.seller.profile?.avatar_url,
      listing_title: order.listing.title,
      listing_description: order.listing.description,
      price: order.proposal.price_offered,
      delivery_time: order.proposal.delivery_time,
      proposal_message: order.proposal.message,
      created_at: order.createdAt,
      updated_at: order.updatedAt
    };

    res.json(formattedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private
export const updateOrderStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orderId = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify user is part of the order
    const isBuyer = order.buyer.toString() === userId;
    const isSeller = order.seller.toString() === userId;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ error: 'You are not authorized to update this order' });
    }

    // Validate status transitions
    const allowedTransitions = {
      pending: ['paid', 'cancelled'],
      paid: ['in_progress', 'cancelled'],
      in_progress: ['delivered', 'cancelled'],
      delivered: ['completed', 'disputed'],
      disputed: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };

    if (!allowedTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        error: `Cannot transition from ${order.status} to ${status}` 
      });
    }

    // Role-based permissions
    if (status === 'delivered' && !isSeller) {
      return res.status(403).json({ error: 'Only the seller can mark as delivered' });
    }

    if (status === 'completed' && !isBuyer) {
      return res.status(403).json({ error: 'Only the buyer can mark as completed' });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Update listing status if order is completed or cancelled
    if (status === 'completed') {
      await Listing.findByIdAndUpdate(order.listing, { status: 'completed' });
    } else if (status === 'cancelled') {
      await Listing.findByIdAndUpdate(order.listing, { status: 'open' });
      // Reset proposal to pending so it can be accepted again
      await Proposal.findByIdAndUpdate(order.proposal, { status: 'pending' });
    }

    res.json({ 
      message: 'Order status updated successfully',
      order: {
        id: order.id,
        status: order.status
      }
    });
  } catch (error) {
    next(error);
  }
};
