import mongoose from 'mongoose';

const progressUpdateSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  attachments: {
    type: [String], // Array of file URLs
    default: [],
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

progressUpdateSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const ProgressUpdate = mongoose.model('ProgressUpdate', progressUpdateSchema);

export default ProgressUpdate;