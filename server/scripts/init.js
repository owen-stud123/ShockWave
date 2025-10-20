import db, { initializeDatabase } from '../config/database.js';
import bcrypt from 'bcrypt';

// Initialize database
initializeDatabase();

// Create default admin user if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin');
    
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 12);
      
      const result = db.prepare(`
        INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('admin@designmarket.com', passwordHash, 'Admin User', 'admin', 1, 1);

      // Create admin profile
      db.prepare(`
        INSERT INTO profiles (user_id, bio, skills, portfolio_urls, social_links)
        VALUES (?, ?, ?, ?, ?)
      `).run(result.lastInsertRowid, 'System Administrator', '["Administration"]', '[]', '{}');

      console.log('✅ Default admin user created:');
      console.log('   Email: admin@designmarket.com');
      console.log('   Password: admin123');
      console.log('   Please change the password after first login!');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Create sample data
const createSampleData = async () => {
  try {
    // Check if sample data already exists
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role != ?').get('admin');
    
    if (existingUsers.count === 0) {
      console.log('📊 Creating sample data...');
      
      // Create sample designer
      const designerPasswordHash = await bcrypt.hash('designer123', 12);
      const designerResult = db.prepare(`
        INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('designer@example.com', designerPasswordHash, 'Sarah Johnson', 'designer', 1, 1);

      db.prepare(`
        INSERT INTO profiles (user_id, bio, skills, location, hourly_rate, portfolio_urls, social_links)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        designerResult.lastInsertRowid,
        'Creative graphic designer with 5+ years of experience in branding and web design.',
        '["Logo Design", "Branding", "Web Design", "Print Design"]',
        'New York, NY',
        75.00,
        '["https://example.com/portfolio1", "https://example.com/portfolio2"]',
        '{"behance": "sarah_designs", "dribbble": "sarahj"}'
      );

      // Create sample business user
      const businessPasswordHash = await bcrypt.hash('business123', 12);
      const businessResult = db.prepare(`
        INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('business@example.com', businessPasswordHash, 'Tech Startup Inc', 'business', 1, 1);

      db.prepare(`
        INSERT INTO profiles (user_id, bio, skills, location, portfolio_urls, social_links)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        businessResult.lastInsertRowid,
        'Fast-growing tech startup looking for talented designers to help build our brand.',
        '[]',
        'San Francisco, CA',
        '[]',
        '{"website": "https://techstartup.com"}'
      );

      console.log('✅ Sample data created:');
      console.log('   Designer: designer@example.com / designer123');
      console.log('   Business: business@example.com / business123');
    }
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

// Run initialization
const init = async () => {
  console.log('🚀 Initializing Digital Marketplace...');
  await createDefaultAdmin();
  await createSampleData();
  console.log('✅ Initialization complete!');
  process.exit(0);
};

init();