/**
 * Seed script — creates the demo user with a proper bcrypt hash.
 * Run once: node seed.js
 * The demo credentials are: demo@codealchemy.com / demo123
 */
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'users.json');

async function seed() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  let users = [];
  if (fs.existsSync(DATA_FILE)) {
    try { users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { users = []; }
  }

  const demoExists = users.find(u => u.email === 'demo@codealchemy.com');
  if (demoExists) {
    console.log('✅ Demo user already exists. Skipping seed.');
    return;
  }

  const demoUsers = [
    { name: 'Demo User',       email: 'demo@codealchemy.com', password: 'demo123' },
    { name: 'John Developer',  email: 'user@example.com',     password: 'password123' },
    { name: 'Test Account',    email: 'test@test.com',        password: 'test123456' }
  ];

  console.log('🔐 Hashing demo passwords with bcrypt...');
  for (const u of demoUsers) {
    const hashed = await bcrypt.hash(u.password, 10);
    users.push({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: u.name,
      email: u.email,
      password: hashed,
      createdAt: new Date().toISOString()
    });
    console.log(`   ✓ ${u.email}`);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  console.log('\n✅ Seed complete! Demo users created in data/users.json');
  console.log('   Login: demo@codealchemy.com / demo123');
}

seed().catch(console.error);
