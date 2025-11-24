import Invoice from '../models/invoiceModel.js';
import Order from '../models/orderModel.js';
import { validationResult } from 'express-validator';

// @desc    Create a new invoice for a completed order (Designer only)
// @route   POST /api/invoices
// @access  Private (Designer)
export const createInvoice = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { order_id, due_date, notes } = req.body;
    const designerId = req.user.id;

    const order = await Order.findById(order_id)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('listing', 'title');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.seller._id.toString() !== designerId) {
      return res.status(403).json({ error: 'You are not the designer for this order' });
    }
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Invoice can only be created for completed orders' });
    }

    const existingInvoice = await Invoice.findOne({ order: order_id });
    if (existingInvoice) {
      return res.status(409).json({ error: 'An invoice already exists for this order' });
    }

    const invoice = new Invoice({
      order: order_id,
      designer: designerId,
      business: order.buyer._id,
      amount: order.amount,
      due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      notes: notes?.trim() || '',
      status: 'sent', // sent → paid / overdue handled by cron later if you want
    });

    await invoice.save();

    const populated = await Invoice.findById(invoice._id)
      .populate('designer', 'name email')
      .populate('business', 'name email')
      .populate({
        path: 'order',
        populate: { path: 'listing', select: 'title' },
      });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: {
        id: populated._id,
        invoice_number: `INV-${populated._id.toString().slice(-8).toUpperCase()}`,
        order_id: populated.order._id,
        listing_title: populated.order.listing.title,
        designer: populated.designer,
        business: populated.business,
        amount: populated.amount,
        status: populated.status,
        due_date: populated.due_date,
        notes: populated.notes,
        created_at: populated.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices (for logged-in user)
// @route   GET /api/invoices
// @access  Private
export const getUserInvoices = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const query = role === 'designer' ? { designer: userId } : { business: userId };

    const invoices = await Invoice.find(query)
      .populate('designer', 'name')
      .populate('business', 'name')
      .populate({
        path: 'order',
        populate: { path: 'listing', select: 'title' },
      })
      .sort({ created_at: -1 })
      .lean();

    const formatted = invoices.map((inv) => ({
      id: inv._id,
      invoice_number: `INV-${inv._id.toString().slice(-8).toUpperCase()}`,
      order_id: inv.order._id,
      listing_title: inv.order.listing?.title || 'N/A',
      amount: inv.amount,
      status: inv.status,
      due_date: inv.due_date,
      created_at: inv.created_at,
      designer_name: inv.designer.name,
      business_name: inv.business.name,
      notes: inv.notes || '',
    }));

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private (Designer or Business on invoice)
export const getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const invoice = await Invoice.findById(id)
      .populate('designer', 'name email profile')
      .populate('business', 'name email profile')
      .populate({
        path: 'order',
        populate: { path: 'listing', select: 'title description' },
      })
      .lean();

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const isParticipant = 
      invoice.designer._id.toString() === userId || 
      invoice.business._id.toString() === userId;

    if (!isParticipant && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      id: invoice._id,
      invoice_number: `INV-${invoice._id.toString().slice(-8).toUpperCase()}`,
      order_id: invoice.order._id,
      listing_title: invoice.order.listing.title,
      listing_description: invoice.order.listing.description,
      amount: invoice.amount,
      status: invoice.status,
      due_date: invoice.due_date,
      notes: invoice.notes || '',
      created_at: invoice.created_at,
      designer: {
        name: invoice.designer.name,
        email: invoice.designer.email,
        avatar_url: invoice.designer.profile?.avatar_url || '',
      },
      business: {
        name: invoice.business.name,
        email: invoice.business.email,
        avatar_url: invoice.business.profile?.avatar_url || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark invoice as paid (Business or Admin only)
// @route   PATCH /api/invoices/:id/pay
// @access  Private
export const markInvoiceAsPaid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const isBusiness = invoice.business.toString() === userId;
    const isAdmin = role === 'admin';

    if (!isBusiness && !isAdmin) {
      return res.status(403).json({ error: 'Only the client or admin can mark as paid' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ error: 'Invoice already marked as paid' });
    }

    invoice.status = 'paid';
    await invoice.save();

    res.json({ message: 'Invoice marked as paid successfully', invoice });
  } catch (error) {
    next(error);
  }
};