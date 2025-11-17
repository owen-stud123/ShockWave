import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/userModel.js';

dotenv.config();

const verifyDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('\n✅ DATABASE VERIFICATION\n');
    console.log('═══════════════════════════════════════════\n');

    // Fetch all users
    const users = await User.find({}).select('id username name role is_active');

    console.log(`📊 Total Users: ${users.length}\n`);

    users.forEach(user => {
      console.log(`${user.role === 'designer' ? '👨‍🎨' : user.role === 'business' ? '💼' : '🔐'} ${user.role.toUpperCase()}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Active: ${user.is_active ? 'Yes' : 'No'}`);
      console.log('');
    });

    console.log('═══════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

verifyDatabase();
