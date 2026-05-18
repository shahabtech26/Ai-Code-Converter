require('dotenv').config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 16) {
  console.error('FATAL: JWT_SECRET must be set in .env (at least 16 characters).');
  console.error('Copy .env.example to .env and set a secure secret.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const convertRoutes = require('./routes/convert');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '2mb' }));   // Allow large code payloads
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger ───────────────────────────────────────────────────────────

app.use((req, _res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api', convertRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  const hasOpenAI = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    engine: hasOpenAI ? 'openai' : 'pattern-based',
    openaiConfigured: hasOpenAI
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  const hasOpenAI = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   CodeAlchemy Backend Server         ║');
  console.log('  ╠══════════════════════════════════════╣');
  console.log(`  ║   Running on: http://localhost:${PORT}   ║`);
  console.log(`  ║   Engine: ${hasOpenAI ? 'OpenAI GPT-4o         ' : 'Pattern-based (no key)'}    ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
});

module.exports = app;
