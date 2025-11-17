import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  },
  // gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }, // Uncomment when Gig model is created
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
  },
  amount: {
    type: Number,
    required: true,
  },
  platform_fee: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'pending',
  },
  stripe_payment_intent_id: {
    type: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

orderSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


const Order = mongoose.model('Order', orderSchema);

export default Order;
