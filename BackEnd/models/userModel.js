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
    index: true,
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

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password_hash')) {
    return next();
  }
  
  // Check if password is already hashed (starts with $2a$ or $2b$)
  if (this.password_hash && (this.password_hash.startsWith('$2a$') || this.password_hash.startsWith('$2b$'))) {
    return next();
  }
  
  // Hash the password
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password_hash);
};

const User = mongoose.model('User', userSchema);

export default User;