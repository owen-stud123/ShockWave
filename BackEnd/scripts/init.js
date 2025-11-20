import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';

// Load Models
import User from '../models/userModel.js';
import Listing from '../models/listingModel.js';
import Proposal from '../models/proposalModel.js';
import Order from '../models/orderModel.js';
import Message from '../models/messageModel.js';
import Review from '../models/reviewModel.js';
import PortfolioItem from '../models/portfolioItemModel.js';
import Invoice from '../models/invoiceModel.js';

dotenv.config();

const clearDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    // Order matters for logs, but not for Mongo's parallel deletion
    await Invoice.deleteMany({});
    await Review.deleteMany({});
    await Message.deleteMany({});
    await Order.deleteMany({});
    await Proposal.deleteMany({});
    await PortfolioItem.deleteMany({});
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

const createTestAccounts = async () => {
  try {
    console.log('👥 Creating test accounts...\n');

    const accounts = [
      {
        email: 'designer@creative.com',
        password_hash: 'design2024',
        name: 'Creative Designer',
        role: 'designer',
        is_email_verified: true,
        profile: {
          bio: 'Professional designer specializing in branding and visual identity. Over 10 years of experience.',
          skills: ['Logo Design', 'Branding', 'UI/UX', 'Illustration'],
          location: 'New York, USA',
          hourly_rate: 75,
        },
      },
      {
        email: 'business@startup.com',
        password_hash: 'startup2024',
        name: 'Tech Startup Co',
        role: 'business',
        is_email_verified: true,
        profile: {
          bio: 'Growing tech company looking for talented designers to help us build the next big thing.',
        },
      },
      {
        email: 'admin@shockwave.com',
        password_hash: 'admin2024',
        name: 'System Administrator',
        role: 'admin',
        is_email_verified: true,
        profile: {
          bio: 'Platform administrator.',
          skills: ['Platform Management'],
        },
      },
    ];

    for (const account of accounts) {
      // The password will be hashed by the pre-save middleware in the User model
      const user = new User(account);
      await user.save();
      
      console.log(`✅ Created ${account.role.toUpperCase()} account:`);
      console.log(`   Email: ${account.email}`);
      console.log(`   Password: ${account.password_hash}`); // Note: this is the plain text before hashing
      console.log(`   Name: ${account.name}\n`);
    }

    console.log('═══════════════════════════════════════════');
    console.log('🎉 TEST ACCOUNTS READY FOR TESTING');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 DESIGNER ACCOUNT:');
    console.log('   Email: designer@creative.com');
    console.log('   Password: design2024');
    console.log('\n💼 BUSINESS ACCOUNT:');
    console.log('   Email: business@startup.com');
    console.log('   Password: startup2024');
    console.log('\n🔐 ADMIN ACCOUNT:');
    console.log('   Email: admin@shockwave.com');
    console.log('   Password: admin2024');
    console.log('\n═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
    process.exit(1);
  }
};

const init = async () => {
  console.log('\n🚀 Initializing ShockWave Digital Marketplace with MongoDB...\n');
  await connectDB();
  await clearDatabase();
  // await createTestAccounts(); // COMMENTED OUT - No test accounts in production
  console.log('✅ Initialization complete!\n');
  await mongoose.disconnect();
  process.exit(0);
};

init();