import db, { initializeDatabase } from '../config/database.js';
import bcrypt from 'bcrypt';

// Initialize database
initializeDatabase();

// Clear all existing users (for fresh start)
const clearDatabase = () => {
  try {
    console.log('🗑️  Clearing existing data...');
    db.prepare('DELETE FROM profiles').run();
    db.prepare('DELETE FROM users').run();
    console.log('✅ Database cleared');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

// Create test accounts
const createTestAccounts = async () => {
  try {
    console.log('👥 Creating test accounts...\n');

    const accounts = [
      {
        username: 'designer_creative',
        password: 'design2024',
        name: 'Creative Designer',
        role: 'designer',
        bio: 'Professional designer specializing in branding and visual identity.',
        skills: '["Logo Design", "Branding", "UI/UX", "Illustration"]'
      },
      {
        username: 'business_startup',
        password: 'startup2024',
        name: 'Tech Startup Co',
        role: 'business',
        bio: 'Growing tech company looking for talented designers.',
        skills: '[]'
      },
      {
        username: 'admin_master',
        password: 'admin2024',
        name: 'System Administrator',
        role: 'admin',
        bio: 'Platform administrator.',
        skills: '["Platform Management"]'
      }
    ];

    for (const account of accounts) {
      const passwordHash = await bcrypt.hash(account.password, 12);
      
      const result = db.prepare(`
        INSERT INTO users (username, password_hash, name, role, is_active)
        VALUES (?, ?, ?, ?, 1)
      `).run(account.username, passwordHash, account.name, account.role);

      // Create profile
      db.prepare(`
        INSERT INTO profiles (user_id, bio, skills, portfolio_urls, social_links)
        VALUES (?, ?, ?, '[]', '{}')
      `).run(result.lastInsertRowid, account.bio, account.skills);

      console.log(`✅ Created ${account.role.toUpperCase()} account:`);
      console.log(`   Username: ${account.username}`);
      console.log(`   Password: ${account.password}`);
      console.log(`   Name: ${account.name}\n`);
    }

    console.log('═══════════════════════════════════════════');
    console.log('🎉 TEST ACCOUNTS READY FOR TESTING');
    console.log('═══════════════════════════════════════════');
    console.log('\n📋 DESIGNER ACCOUNT:');
    console.log('   Username: designer_creative');
    console.log('   Password: design2024');
    console.log('\n💼 BUSINESS ACCOUNT:');
    console.log('   Username: business_startup');
    console.log('   Password: startup2024');
    console.log('\n🔐 ADMIN ACCOUNT:');
    console.log('   Username: admin_master');
    console.log('   Password: admin2024');
    console.log('\n═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error creating test accounts:', error);
  }
};

// Run initialization
const init = async () => {
  console.log('\n🚀 Initializing ShockWave Digital Marketplace...\n');
  clearDatabase();
  await createTestAccounts();
  console.log('✅ Initialization complete!\n');
  process.exit(0);
};

init();