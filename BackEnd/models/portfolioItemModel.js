import mongoose from 'mongoose';

const portfolioItemSchema = new mongoose.Schema({
  designer: {
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
  },
  file_url: {
    type: String,
    required: true,
  },
  file_type: {
    type: String, // e.g., 'png', 'pdf', 'docx'
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

portfolioItemSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);

export default PortfolioItem;