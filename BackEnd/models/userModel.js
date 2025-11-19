// BackEnd/models/userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true, // allows null but unique when exists
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['designer', 'business', 'admin'],
    default: 'designer',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  profile: {
    avatar_url: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: [String],
    hourly_rate: { type: Number },
    company_name: { type: String },
    website: { type: String },
    location: { type: String },
  },
  saved_listings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

// Virtual for password
userSchema.virtual('password').set(function(password) {
  this.password_hash = bcrypt.hashSync(password, 12);
});

// Method to compare password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password_hash);
};

// Ensure email index
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;