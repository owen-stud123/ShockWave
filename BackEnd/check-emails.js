import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/userModel.js';

dotenv.config();

const checkEmails = async () => {
  try {
    await connectDB();
    console.log('\n✅ CHECKING USER EMAILS\n');
    console.log('═══════════════════════════════════════════\n');

    const users = await User.find({}).select('name email role');

    console.log(`📊 Total Users: ${users.length}\n`);

    users.forEach((user, index) => {
      console.log(`User #${index + 1}:`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email: ${user.email || 'NO EMAIL FIELD'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkEmails();
