const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── Pattern-Based Converter (fallback when no OpenAI key) ──────────────────

/**
 * Comprehensive rule-based code converter for common language pairs.
 * Handles Python↔JavaScript, Python↔Java, JavaScript↔TypeScript, etc.
 */
function patternConvert(code, sourceLang, targetLang) {
  const src = sourceLang.toLowerCase();
  const tgt = targetLang.toLowerCase();
  let result = code;

  // ── Python → JavaScript ─────────────────────────────────────────────────
  if (src === 'python' && (tgt === 'javascript' || tgt === 'js')) {
    result = result
      // def → function
      .replace(/^def (\w+)\((.*?)\):\s*$/gm, 'function $1($2) {')
      // print() → console.log()
      .replace(/\bprint\((.*?)\)/g, 'console.log($1)')
      // Python True/False/None → JS true/false/null
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      // elif → else if
      .replace(/\belif (.+?):/g, '} else if ($1) {')
      // else: → } else {
      .replace(/\belse:\s*$/gm, '} else {')
      // if x: → if (x) {
      .replace(/^(\s*)if (.+?):\s*$/gm, '$1if ($2) {')
      // for x in range(n): → for (let x = 0; x < n; x++) {
      .replace(/for (\w+) in range\((\d+)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {')
      // for x in y: → for (const x of y) {
      .replace(/for (\w+) in (\w+):/g, 'for (const $1 of $2) {')
      // while x: → while (x) {
      .replace(/^(\s*)while (.+?):\s*$/gm, '$1while ($2) {')
      // Python f-strings → template literals
      .replace(/f"(.*?)"/g, (_, s) => '`' + s.replace(/\{(\w+)\}/g, '${$1}') + '`')
      .replace(/f'(.*?)'/g, (_, s) => '`' + s.replace(/\{(\w+)\}/g, '${$1}') + '`')
      // # comments → // comments
      .replace(/^(\s*)#(.*)$/gm, '$1//$2')
      // self. → this.
      .replace(/\bself\./g, 'this.')
      // __init__ → constructor
      .replace(/def __init__\(self,?\s*/g, 'constructor(')
      // class X: → class X {
      .replace(/^class (\w+)(?:\((\w+)\))?:\s*$/gm, (_, name, parent) =>
        parent ? `class ${name} extends ${parent} {` : `class ${name} {`
      )
      // return (same)
      // Add closing braces heuristically by dedent
      ;
    result = addJsClosingBraces(result);
    result = `// Converted from Python to JavaScript\n\n${result}`;
    return result;
  }

  // ── JavaScript → Python ─────────────────────────────────────────────────
  if ((src === 'javascript' || src === 'js') && tgt === 'python') {
    result = result
      .replace(/function (\w+)\((.*?)\) \{/g, 'def $1($2):')
      .replace(/console\.log\((.*?)\)/g, 'print($1)')
      .replace(/\btrue\b/g, 'True')
      .replace(/\bfalse\b/g, 'False')
      .replace(/\bnull\b/g, 'None')
      .replace(/\bundefined\b/g, 'None')
      .replace(/const |let |var /g, '')
      .replace(/\/\/(.*)$/gm, '#$1')
      .replace(/\bthis\./g, 'self.')
      .replace(/\{$/gm, ':')
      .replace(/^\s*\}\s*$/gm, '');
    result = `# Converted from JavaScript to Python\n\n${result}`;
    return result;
  }

  // ── JavaScript → TypeScript ─────────────────────────────────────────────
  if ((src === 'javascript' || src === 'js') && (tgt === 'typescript' || tgt === 'ts')) {
    result = result
      // const x = function → const x = (...): ReturnType => ...
      .replace(/const (\w+) = function\((.*?)\)/g, 'const $1 = ($2): void =>')
      // function foo(x) → function foo(x: unknown): unknown
      .replace(/function (\w+)\(([^)]*)\)/g, (_, name, params) => {
        const typedParams = params
          .split(',')
          .map(p => p.trim() ? `${p.trim()}: unknown` : '')
          .join(', ');
        return `function ${name}(${typedParams}): unknown`;
      })
      // var → let
      .replace(/\bvar\b/g, 'let');
    result = `// Converted from JavaScript to TypeScript\n\n${result}`;
    return result;
  }

  // ── Python → Java ─────────────────────────────────────────────────────
  if (src === 'python' && tgt === 'java') {
    result = result
      .replace(/def (\w+)\((.*?)\):/g, 'public static void $1($2) {')
      .replace(/\bprint\((.*?)\)/g, 'System.out.println($1);')
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/^(\s*)#(.*)$/gm, '$1//$2')
      .replace(/\bself\./g, 'this.');
    result = `// Converted from Python to Java\n// Note: Add class wrapper and imports as needed\n\n${result}`;
    return result;
  }

  // ── Generic fallback — just add header ───────────────────────────────────
  return `// Converted from ${sourceLang} to ${targetLang}\n// Note: Manual review recommended for complex logic\n\n${code}`;
}

/**
 * Heuristic: add closing braces for JS output from Python conversion.
 * Each indented block gets a matching } based on dedent.
 */
function addJsClosingBraces(code) {
  const lines = code.split('\n');
  const result = [];
  const indentStack = [0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;

    // Close blocks when dedenting
    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      result.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    if (line.trim().endsWith('{')) {
      indentStack.push(indent + 2);
    }
    result.push(line);
  }

  // Close remaining open blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    result.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
  }

  return result.join('\n');
}

// ─── OpenAI Conversion ───────────────────────────────────────────────────────

async function openAIConvert(code, sourceLang, targetLang) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an expert code converter. Convert the following ${sourceLang} code to ${targetLang}.
Rules:
- Preserve all logic, variable names, and functionality exactly
- Use idiomatic ${targetLang} syntax and conventions
- Add brief comments only for significant translation choices
- Return ONLY the converted code, no explanations or markdown fences

${sourceLang} code:
${code}`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 4096
  });

  return completion.choices[0].message.content.trim();
}

async function openAIBugDetect(code, language) {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are a senior code reviewer. Analyze this ${language} code for bugs, security issues, and quality problems.

Return a JSON array of issues. Each issue must have these fields:
- "severity": one of "critical", "high", "medium", "low"
- "type": short category like "syntax", "logic", "security", "performance", "style"
- "line": line number (integer) or null
- "description": clear explanation of the problem
- "fix": concrete suggestion to fix it

Return ONLY valid JSON array, no markdown, no explanation. Example:
[{"severity":"high","type":"logic","line":5,"description":"Off-by-one error in loop","fix":"Change i < arr.length to i <= arr.length"}]

${language} code:
${code}`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 2048
  });

  const raw = completion.choices[0].message.content.trim();
  try {
    return JSON.parse(raw);
  } catch {
    // Try extracting JSON array from response
    const match = raw.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    return [];
  }
}

// ─── POST /api/convert ────────────────────────────────────────────────────

router.post('/convert', authMiddleware, async (req, res) => {
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
      // Use real OpenAI conversion
      convertedCode = await openAIConvert(code, sourceLanguage, targetLanguage);
      engine = 'openai';
    } else {
      // Use smart pattern-based fallback
      convertedCode = patternConvert(code, sourceLanguage, targetLanguage);
    }

    return res.json({ convertedCode, targetLanguage, engine });

  } catch (err) {
    console.error('[/convert] OpenAI error:', err.message);
    // Graceful fallback to pattern-based if OpenAI fails
    try {
      const convertedCode = patternConvert(code, sourceLanguage, targetLanguage);
      return res.json({ convertedCode, targetLanguage, engine: 'pattern-fallback' });
    } catch (fallbackErr) {
      return res.status(500).json({ error: 'Conversion failed. Please try again.' });
    }
  }
});

// ─── POST /api/bugs ──────────────────────────────────────────────────────

router.post('/bugs', authMiddleware, async (req, res) => {
  const { code, language } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required.' });
  }

  try {
    let bugs = [];

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-')) {
      bugs = await openAIBugDetect(code, language || 'Unknown');
    } else {
      // Pattern-based bug detection fallback
      bugs = patternBugDetect(code, language || '');
    }

    return res.json({ bugs });

  } catch (err) {
    console.error('[/bugs] Error:', err.message);
    // Fallback to pattern-based
    const bugs = patternBugDetect(code, language || '');
    return res.json({ bugs, engine: 'pattern-fallback' });
  }
});

/**
 * Enhanced pattern-based bug detection (used when no OpenAI key).
 */
function patternBugDetect(code, language) {
  const bugs = [];
  const lines = code.split('\n');
  const lang = language.toLowerCase();

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // JavaScript-specific
    if (lang === 'javascript' || lang === 'js' || lang === 'typescript') {
      if (/\bvar\b/.test(trimmed)) {
        bugs.push({ severity: 'medium', type: 'style', line: lineNum, description: '`var` usage found — function-scoped and can cause hoisting bugs.', fix: 'Replace `var` with `const` or `let`.' });
      }
      if (/[^=!<>]={1}[^=>]/.test(trimmed) && !/^(const|let|var|return|if|for|while)/.test(trimmed)) {
        // skip, hard to pattern match reliably
      }
      if (/==(?!=)/.test(trimmed) && !/===/.test(trimmed)) {
        bugs.push({ severity: 'high', type: 'logic', line: lineNum, description: 'Loose equality `==` can cause unexpected type coercions.', fix: 'Use strict equality `===` instead.' });
      }
      if (/console\.log/.test(trimmed)) {
        bugs.push({ severity: 'low', type: 'style', line: lineNum, description: '`console.log` left in code — not suitable for production.', fix: 'Remove or replace with a proper logging library.' });
      }
      if (/eval\(/.test(trimmed)) {
        bugs.push({ severity: 'critical', type: 'security', line: lineNum, description: '`eval()` is a security risk — executes arbitrary code.', fix: 'Avoid `eval()`. Use JSON.parse() or safer alternatives.' });
      }
      if (/innerHTML\s*=/.test(trimmed)) {
        bugs.push({ severity: 'high', type: 'security', line: lineNum, description: '`innerHTML` can lead to XSS (Cross-Site Scripting) vulnerabilities.', fix: 'Use `textContent` or sanitize input before using innerHTML.' });
      }
    }

    // Python-specific
    if (lang === 'python') {
      if (/except:/.test(trimmed) && !/except \w/.test(trimmed)) {
        bugs.push({ severity: 'high', type: 'logic', line: lineNum, description: 'Bare `except:` catches all exceptions including KeyboardInterrupt.', fix: 'Specify the exception type: `except Exception as e:`' });
      }
      if (/print /.test(trimmed) && !/print\(/.test(trimmed)) {
        bugs.push({ severity: 'medium', type: 'syntax', line: lineNum, description: 'Python 2 `print` statement used — not valid in Python 3.', fix: 'Use `print()` function.' });
      }
      if (/==\s*None/.test(trimmed)) {
        bugs.push({ severity: 'medium', type: 'style', line: lineNum, description: 'Comparing to None with `==` is not recommended.', fix: 'Use `is None` instead of `== None`.' });
      }
    }

    // General
    if (trimmed.length > 200) {
      bugs.push({ severity: 'low', type: 'style', line: lineNum, description: 'Very long line (200+ chars) — hard to read.', fix: 'Break into multiple lines for readability.' });
    }
  });

  // Deduplicate by description
  const seen = new Set();
  return bugs.filter(b => {
    if (seen.has(b.description)) return false;
    seen.add(b.description);
    return true;
  });
}

module.exports = router;
