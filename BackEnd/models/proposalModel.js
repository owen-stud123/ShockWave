import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Listing',
  },
  designer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  price_offered: {
    type: Number,
    required: true,
  },
  delivery_time: {
    type: Number, // in days
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

proposalSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;
