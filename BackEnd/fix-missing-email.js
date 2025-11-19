import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import User from './models/userModel.js';

dotenv.config();

const fixMissingEmail = async () => {
  try {
    await connectDB();
    console.log('\n🔧 FIXING MISSING EMAIL FIELDS\n');
    console.log('═══════════════════════════════════════════\n');

    // Find users without email field
    const usersWithoutEmail = await User.find({ email: { $exists: false } });

    console.log(`Found ${usersWithoutEmail.length} user(s) without email field\n`);

    for (const user of usersWithoutEmail) {
      console.log(`User: ${user.name} (${user.role})`);
      console.log(`   Option 1: Delete this user`);
      console.log(`   Option 2: Add email manually\n`);
      
      // YOU CAN CHOOSE:
      // Option 1: Delete the user (uncomment below)
      // await User.findByIdAndDelete(user._id);
      // console.log(`   ✅ Deleted user: ${user.name}\n`);
      
      // Option 2: Add a default email (uncomment and modify below)
      // const defaultEmail = `${user.name.toLowerCase().replace(' ', '.')}@temp.com`;
      // await User.findByIdAndUpdate(user._id, { email: defaultEmail });
      // console.log(`   ✅ Added email: ${defaultEmail}\n`);
    }

    console.log('═══════════════════════════════════════════');
    console.log('\n⚠️  Script ran in READ-ONLY mode.');
    console.log('Uncomment the fix option you want in fix-missing-email.js\n');
    
  } catch (error) {
    console.error('❌ Failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixMissingEmail();
