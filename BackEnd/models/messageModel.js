import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  thread_id: {
    type: String,
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  body: {
    type: String,
    required: true,
  },
  attachments: {
    type: [String],
    default: [],
  },
  is_read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

messageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


const Message = mongoose.model('Message', messageSchema);

export default Message;
