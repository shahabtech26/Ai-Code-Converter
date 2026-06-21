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
      .replace(/^def (\w+)\((.*?)\):\s*$/gm, 'function $1($2) {')
      .replace(/\bprint\((.*?)\)/g, 'console.log($1)')
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\belif (.+?):/g, '} else if ($1) {')
      .replace(/\belse:\s*$/gm, '} else {')
      .replace(/^(\s*)if (.+?):\s*$/gm, '$1if ($2) {')
      .replace(/for (\w+) in range\((\d+)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {')
      .replace(/for (\w+) in (\w+):/g, 'for (const $1 of $2) {')
      .replace(/^(\s*)while (.+?):\s*$/gm, '$1while ($2) {')
      .replace(/f"(.*?)"/g, (_, s) => '`' + s.replace(/\{(\w+)\}/g, '${$1}') + '`')
      .replace(/f'(.*?)'/g, (_, s) => '`' + s.replace(/\{(\w+)\}/g, '${$1}') + '`')
      .replace(/^(\s*)#(.*)$/gm, '$1//$2')
      .replace(/\bself\./g, 'this.')
      .replace(/def __init__\(self,?\s*/g, 'constructor(')
      .replace(/^class (\w+)(?:\((\w+)\))?:\s*$/gm, (_, name, parent) =>
        parent ? `class ${name} extends ${parent} {` : `class ${name} {`
      );
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
      .replace(/const (\w+) = function\((.*?)\)/g, 'const $1 = ($2): void =>')
      .replace(/function (\w+)\(([^)]*)\)/g, (_, name, params) => {
        const typedParams = params
          .split(',')
          .map(p => p.trim() ? `${p.trim()}: unknown` : '')
          .join(', ');
        return `function ${name}(${typedParams}): unknown`;
      })
      .replace(/\bvar\b/g, 'let');
    result = `// Converted from JavaScript to TypeScript\n\n${result}`;
    return result;
  }

  // ── JavaScript → C++ ─────────────────────────────────────────────────────
  if ((src === 'javascript' || src === 'js') && tgt === 'c++') {
    result = result
      .replace(/console\.log\((.*?)\);?/g, 'std::cout << $1 << std::endl;')
      .replace(/const (\w+) = \((.*?)\) => \{/g, 'void $1($2) {')
      .replace(/const (\w+) = function\((.*?)\) \{/g, 'void $1($2) {')
      .replace(/function (\w+)\((.*?)\) \{/g, 'void $1($2) {')
      .replace(/\b(?:const|let|var)\b/g, 'auto')
      .replace(/\bnull\b/g, 'nullptr')
      .replace(/\bundefined\b/g, 'nullptr')
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/for \(const (\w+) of (\w+)\) \{/g, 'for (auto & $1 : $2) {')
      .replace(/\/\/(.*)$/gm, '//$1');

    result = `// Converted from JavaScript to C++\n// Note: Review types and include <iostream> / any container headers as needed\n\n${result}`;
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
 */
function addJsClosingBraces(code) {
  const lines = code.split('\n');
  const result = [];
  const indentStack = [0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    const indent = line.length - trimmed.length;

    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      result.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    if (line.trim().endsWith('{')) {
      indentStack.push(indent + 2);
    }
    result.push(line);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    result.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
  }

  return result.join('\n');
}

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

module.exports = {
  patternConvert,
  patternBugDetect,
  addJsClosingBraces
};
