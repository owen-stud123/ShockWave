import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  budget_min: {
    type: Number,
  },
  budget_max: {
    type: Number,
  },
  deadline: {
    type: Date,
  },
  tags: {
    type: [String],
    default: [],
  },
  attachments: {
    type: [String], // Array of URLs
    default: [],
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled'],
    default: 'open',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

listingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
