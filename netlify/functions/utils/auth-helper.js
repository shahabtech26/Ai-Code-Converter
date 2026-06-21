const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'codealchemy_netlify_secret_32chars_min';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

// ─── In-Memory User Store ────────────────────────────────────────────────────
// Note: This resets on cold starts. For persistent storage, use a database.
const users = [];

function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
}

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
}

async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Extract user from Authorization header ──────────────────────────────────
function getUserFromHeaders(headers) {
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

// ─── Standard CORS headers for all responses ─────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

module.exports = {
  users,
  findUserByEmail,
  createUser,
  verifyPassword,
  generateToken,
  verifyToken,
  validateEmail,
  getUserFromHeaders,
  corsHeaders
};
