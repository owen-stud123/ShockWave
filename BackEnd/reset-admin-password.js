// reset-admin-password.js
import mongoose from 'mongoose';
import User from './models/userModel.js';
import 'dotenv/config';

await mongoose.connect(process.env.MONGO_URI);

const adminEmail = 'admin_master@temp.com';
const newPassword = 'admin2024'; // Set your desired password here

const admin = await User.findOne({ email: adminEmail });

if (admin) {
  admin.password_hash = newPassword; // Will be hashed by the model's virtual
  await admin.save();
  console.log(`✅ Password reset for ${adminEmail}`);
  console.log(`   New password: ${newPassword}`);
} else {
  console.log(`❌ User not found: ${adminEmail}`);
}

process.exit();
