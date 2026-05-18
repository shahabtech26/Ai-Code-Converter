import React, { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import { Code2, Copy } from 'lucide-react';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('php', php);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);

const LANG_ALIASES = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  'c++': 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
  sh: 'bash',
};

function resolveLanguage(language) {
  const key = (language || '').toLowerCase().trim();
  return LANG_ALIASES[key] || key || 'plaintext';
}

function highlightCode(code, language) {
  const lang = resolveLanguage(language);
  try {
    if (lang !== 'plaintext' && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
  } catch {
    // fall through to auto-detect
  }
  try {
    return hljs.highlightAuto(code).value;
  } catch {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

export default function CodeBlock({ code, language = 'Code', label, onCopy }) {
  const highlighted = useMemo(
    () => highlightCode(code || '', language),
    [code, language]
  );

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </div>
      )}
      <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden />
          <span className="text-sm font-semibold text-white truncate">{language || 'Code'}</span>
        </div>
        {onCopy && (
          <button
            type="button"
            onClick={() => onCopy(code)}
            className="shrink-0 rounded-full border border-slate-600 px-2 py-1 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white flex items-center gap-1"
            title="Copy code"
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        )}
      </div>
      <pre className="cm-scroller w-full max-w-full max-h-[42vh] overflow-auto rounded-md border border-slate-700 bg-[#0b0f14] p-3 text-sm leading-relaxed font-mono m-0">
        <code
          className="hljs block whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
