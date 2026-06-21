const { corsHeaders } = require('./utils/auth-helper');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const hasOpenAI = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      engine: hasOpenAI ? 'openai' : 'pattern-based',
      openaiConfigured: hasOpenAI
    })
  };
};
