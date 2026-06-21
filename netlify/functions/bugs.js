const { getUserFromHeaders, corsHeaders } = require('./utils/auth-helper');
const { patternBugDetect } = require('./utils/converter');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed.' }) };
  }

  // Auth check
  const user = getUserFromHeaders(event.headers);
  if (!user) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'No token provided. Please sign in.' }) };
  }

  try {
    const { code, language } = JSON.parse(event.body || '{}');

    if (!code || !code.trim()) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Code is required.' }) };
    }

    let bugs = [];

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      try {
        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `You are a senior code reviewer. Analyze this ${language || 'Unknown'} code for bugs, security issues, and quality problems.

Return a JSON array of issues. Each issue must have these fields:
- "severity": one of "critical", "high", "medium", "low"
- "type": short category like "syntax", "logic", "security", "performance", "style"
- "line": line number (integer) or null
- "description": clear explanation of the problem
- "fix": concrete suggestion to fix it

Return ONLY valid JSON array, no markdown, no explanation.

${language || 'Unknown'} code:
${code}`;

        const completion = await client.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 2048
        });

        const raw = completion.choices[0].message.content.trim();
        try {
          bugs = JSON.parse(raw);
        } catch {
          const match = raw.match(/\[[\s\S]*\]/);
          if (match) bugs = JSON.parse(match[0]);
        }
      } catch (aiErr) {
        console.error('[bugs] OpenAI error, falling back:', aiErr.message);
        bugs = patternBugDetect(code, language || '');
      }
    } else {
      bugs = patternBugDetect(code, language || '');
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ bugs })
    };
  } catch (err) {
    console.error('[bugs] Error:', err.message);
    const bugs = patternBugDetect(code, language || '');
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ bugs, engine: 'pattern-fallback' })
    };
  }
};
