import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const profileSchema = new mongoose.Schema({
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  location: { type: String, default: '' },
  hourly_rate: { type: Number },
  portfolio_urls: { type: [String], default: [] }, // Kept for legacy/simple links
  social_links: {
    type: Map,
    of: String,
    default: {}
  },
  avatar_url: { type: String, default: '' },
  saved_projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }], // For designers to bookmark projects
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['designer', 'business', 'admin'],
  },
  name: {
    type: String,
    required: true,
  },
  last_login: {
    type: Date,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_email_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_token: { type: String },
  email_verification_expires: { type: Date },
  password_reset_token: { type: String },
  password_reset_expires: { type: Date },
  profile: profileSchema,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for 'id'
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Initialize profile when a new user is created
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.profile = {}; // Mongoose will apply defaults from schema
  }
  next();
});

// Method to compare password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

const User = mongoose.model('User', userSchema);

export default User;