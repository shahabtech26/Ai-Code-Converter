const express = require('express');
const {
  patternConvert,
  openAIConvert,
  patternBugDetect,
  openAIBugDetect
} = require('./convert');

const router = express.Router();

router.post('/convert', async (req, res) => {
  const { code, sourceLanguage, targetLanguage } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required.' });
  }
  if (!sourceLanguage || !targetLanguage) {
    return res.status(400).json({ error: 'Source and target languages are required.' });
  }
  if (sourceLanguage.toLowerCase() === targetLanguage.toLowerCase()) {
    return res.status(400).json({ error: 'Source and target languages must be different.' });
  }

  try {
    let convertedCode;
    let engine = 'pattern';

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      convertedCode = await openAIConvert(code, sourceLanguage, targetLanguage);
      engine = 'openai';
    } else {
      convertedCode = patternConvert(code, sourceLanguage, targetLanguage);
    }

    return res.json({ convertedCode, targetLanguage, engine });
  } catch (err) {
    console.error('[/plugin/convert] Error:', err.message);
    try {
      const convertedCode = patternConvert(code, sourceLanguage, targetLanguage);
      return res.json({ convertedCode, targetLanguage, engine: 'pattern-fallback' });
    } catch (fallbackErr) {
      return res.status(500).json({ error: 'Conversion failed. Please try again.' });
    }
  }
});

router.post('/bugs', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required.' });
  }

  try {
    let bugs = [];

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      bugs = await openAIBugDetect(code, language || 'Unknown');
    } else {
      bugs = patternBugDetect(code, language || '');
    }

    return res.json({ bugs });
  } catch (err) {
    console.error('[/plugin/bugs] Error:', err.message);
    const bugs = patternBugDetect(code, language || '');
    return res.json({ bugs, engine: 'pattern-fallback' });
  }
});

router.get('/health', (_req, res) => {
  const hasOpenAI = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    engine: hasOpenAI ? 'openai' : 'pattern-based',
    openaiConfigured: hasOpenAI
  });
});

module.exports = router;
