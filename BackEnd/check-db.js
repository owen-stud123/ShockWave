import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

console.log('\n✅ DATABASE VERIFICATION\n');
console.log('═══════════════════════════════════════════\n');

const users = db.prepare('SELECT id, username, name, role, is_active FROM users').all();

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

db.close();
