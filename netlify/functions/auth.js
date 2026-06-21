const {
  findUserByEmail,
  createUser,
  verifyPassword,
  generateToken,
  validateEmail,
  getUserFromHeaders,
  corsHeaders
} = require('./utils/auth-helper');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const path = event.path.replace('/.netlify/functions/auth', '').replace(/^\//, '');

  // ─── POST /register ─────────────────────────────────────────────────────
  if (event.httpMethod === 'POST' && path === 'register') {
    try {
      const { name, email, password } = JSON.parse(event.body || '{}');

      if (!name || !name.trim()) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Name is required.' }) };
      }
      if (!email || !validateEmail(email)) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'A valid email address is required.' }) };
      }
      if (!password || password.length < 6) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Password must be at least 6 characters.' }) };
      }

      if (findUserByEmail(email)) {
        return { statusCode: 409, headers: corsHeaders, body: JSON.stringify({ error: 'An account with this email already exists.' }) };
      }

      const newUser = await createUser(name, email, password);
      const token = generateToken(newUser);

      return {
        statusCode: 201,
        headers: corsHeaders,
        body: JSON.stringify({
          token,
          user: { id: newUser.id, name: newUser.name, email: newUser.email }
        })
      };
    } catch (err) {
      console.error('[auth/register]', err);
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Server error. Please try again.' }) };
    }
  }

  // ─── POST /login ────────────────────────────────────────────────────────
  if (event.httpMethod === 'POST' && path === 'login') {
    try {
      const { email, password } = JSON.parse(event.body || '{}');

      if (!email || !password) {
        return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Email and password are required.' }) };
      }

      const user = findUserByEmail(email);
      if (!user) {
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid email or password.' }) };
      }

      const isMatch = await verifyPassword(password, user.password);
      if (!isMatch) {
        return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid email or password.' }) };
      }

      const token = generateToken(user);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          token,
          user: { id: user.id, name: user.name, email: user.email }
        })
      };
    } catch (err) {
      console.error('[auth/login]', err);
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Server error. Please try again.' }) };
    }
  }

  // ─── GET /me ────────────────────────────────────────────────────────────
  if (event.httpMethod === 'GET' && path === 'me') {
    const user = getUserFromHeaders(event.headers);
    if (!user) {
      return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'No token provided. Please sign in.' }) };
    }
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ user })
    };
  }

  return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Endpoint not found.' }) };
};
