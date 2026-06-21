const { getUserFromHeaders, corsHeaders } = require('./utils/auth-helper');
const { patternConvert } = require('./utils/converter');

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
    const { code, sourceLanguage, targetLanguage } = JSON.parse(event.body || '{}');

    if (!code || !code.trim()) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Code is required.' }) };
    }
    if (!sourceLanguage || !targetLanguage) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Source and target languages are required.' }) };
    }
    if (sourceLanguage.toLowerCase() === targetLanguage.toLowerCase()) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Source and target languages must be different.' }) };
    }

    let convertedCode;
    let engine = 'pattern';

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      // Use real OpenAI conversion
      try {
        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `You are an expert code converter. Convert the following ${sourceLanguage} code to ${targetLanguage}.
Rules:
- Preserve all logic, variable names, and functionality exactly
- Use idiomatic ${targetLanguage} syntax and conventions
- Add brief comments only for significant translation choices
- Return ONLY the converted code, no explanations or markdown fences

${sourceLanguage} code:
${code}`;

        const completion = await client.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          max_tokens: 4096
        });

        convertedCode = completion.choices[0].message.content.trim();
        engine = 'openai';
      } catch (aiErr) {
        console.error('[convert] OpenAI error, falling back:', aiErr.message);
        convertedCode = patternConvert(code, sourceLanguage, targetLanguage);
        engine = 'pattern-fallback';
      }
    } else {
      convertedCode = patternConvert(code, sourceLanguage, targetLanguage);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ convertedCode, targetLanguage, engine })
    };
  } catch (err) {
    console.error('[convert] Error:', err.message);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Conversion failed. Please try again.' }) };
  }
};
