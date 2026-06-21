import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Loader2, CheckCircle, Moon, Sun } from 'lucide-react';
import { convertAPI } from '../utils/api';
import CodeBlock from './CodeBlock';

export default function ChatSection({ userName = 'User', onLogout, theme = 'dark', onToggleTheme }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedCode, setUploadedCode] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);  // AI call in progress
  const [copyToast, setCopyToast] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const profileMenuRef = useRef(null);
  const greetingShownRef = useRef(false);

  const commonTargetLanguages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'C#', 'Rust', 'PHP', 'Ruby'];

  const monogram = userName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const addMessage = (text, sender = 'bot', type = 'default', meta = {}) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), text, sender, type, ...meta, timestamp: new Date() }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isAILoading]);

  // ─── Greeting ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!greetingShownRef.current) {
      greetingShownRef.current = true;
      addMessage(
        `👋 Welcome, ${userName}! I'm CodeAlchemy — your AI code assistant.\n\nPaste code below or upload a file to get started. I can:\n• 🔄 Convert between 20+ languages\n• 🐛 Find & explain bugs\n• ✅ Suggest fixes`,
        'bot',
        'greeting'
      );
    }
  }, []);

  // ─── Close profile menu on outside click ────────────────────────────────────

  useEffect(() => {
    const handler = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Language detection (client-side fast check) ────────────────────────────

  const detectLanguage = (code) => {
    const n = code.toLowerCase();
    if (n.includes('def ') || (n.includes('import ') && n.includes('print('))) return 'Python';
    if (n.includes('console.log') || n.includes('const ') || n.includes('function ')) return 'JavaScript';
    if (n.includes(': string') || n.includes(': number') || n.includes(': boolean')) return 'TypeScript';
    if (n.includes('public static void main') || n.includes('system.out.println')) return 'Java';
    if (n.includes('#include') || n.includes('std::')) return 'C++';
    if (n.includes('using system') || n.includes('namespace ')) return 'C#';
    if (n.includes('func ') || n.includes('package main')) return 'Go';
    if (n.includes('fn ') || n.includes('let mut')) return 'Rust';
    if (n.includes('<?php')) return 'PHP';
    if (n.includes('def ') && n.includes('end')) return 'Ruby';
    return 'Unknown';
  };

  const normalizeCode = (code) =>
    code.replace(/\t/g, '  ').split('\n').map((l) => l.replace(/\s+$/g, '')).join('\n').trim();

  const getCodeStructure = (code, language) => {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter((l) => l.trim().length > 0);
    const functionCount = nonEmptyLines.filter((l) =>
      /^(def |function |func |public .*?\(|private .*?\(|protected .*?\(|[\w<>[\]]+\s+\w+\(.*\)\s*\{)/.test(l.trim())
    ).length;
    const classCount = nonEmptyLines.filter((l) => l.trim().startsWith('class ')).length;
    const importCount = nonEmptyLines.filter((l) => {
      const t = l.trim();
      return t.startsWith('import ') || t.startsWith('from ') || t.startsWith('#include') || t.startsWith('using ');
    }).length;
    return { language, totalLines: lines.length, nonEmptyLines: nonEmptyLines.length, importCount, classCount, functionCount };
  };

  const extractFencedCode = (text) => {
    const m = text.match(/```([\w#+.-]*)\n([\s\S]*?)```/);
    if (!m) return null;
    return { language: m[1]?.trim() || '', code: m[2]?.trim() || '' };
  };

  const looksLikeCode = (text) =>
    text.includes('\n') ||
    ['{', '}', ';', 'def ', 'function ', 'class ', '#include', 'import ', 'const ', 'let '].some((m) => text.includes(m));

  // ─── Copy code ───────────────────────────────────────────────────────────────

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    }
  };

  // ─── Prompt user to choose action after code detected ────────────────────────

  const promptActionForCode = (code, source, { skipCodeDisplay = false, codeLabel = 'Your code' } = {}) => {
    const normalized = normalizeCode(code);
    const structure = getCodeStructure(normalized, source);
    setUploadedCode(normalized);
    setDetectedLanguage(source);
    setPendingAction('choose-action');
    setShowSuggestions(true);

    if (!skipCodeDisplay) {
      addMessage(codeLabel, 'bot', 'code', { code: normalized, codeLanguage: source });
    }

    addMessage(
      `✅ Code analysed!\nLanguage: ${structure.language} | Lines: ${structure.totalLines} | Functions: ${structure.functionCount} | Classes: ${structure.classCount}`,
      'bot'
    );
    addMessage(
      `What would you like to do with this ${source} code?`,
      'bot'
    );
  };

  // ─── Bug Detection via backend ────────────────────────────────────────────────

  const handleBugDetection = async (code, language) => {
    setPendingAction(null);
    setShowSuggestions(false);
    setIsAILoading(true);
    addMessage('🔍 Analysing your code for bugs…', 'bot');

    try {
      const response = await convertAPI.detectBugs(code, language);
      const { bugs } = response.data;

      if (!bugs || bugs.length === 0) {
        addMessage('✅ No bugs found! Your code looks clean.', 'bot');
      } else {
        addMessage(
          `🐛 Found ${bugs.length} issue${bugs.length > 1 ? 's' : ''}:`,
          'bot'
        );
        bugs.forEach((bug, i) => {
          const severityEmoji = { critical: '🔴', high: '🟠', medium: '🟡', low: '🔵' }[bug.severity] || '⚪';
          const lineInfo = bug.line ? ` (Line ${bug.line})` : '';
          addMessage(
            `${severityEmoji} [${bug.severity?.toUpperCase()}] ${bug.type?.toUpperCase()}${lineInfo}\n${bug.description}\n💡 Fix: ${bug.fix}`,
            'bot'
          );
        });
        addMessage('Would you like me to also convert this code to another language?', 'bot');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Bug detection failed. Please try again.';
      addMessage(`❌ ${msg}`, 'bot');
    } finally {
      setIsAILoading(false);
    }
  };

  // ─── Code Conversion via backend ─────────────────────────────────────────────

  const handleConversion = async (targetLang) => {
    setPendingAction(null);
    setShowSuggestions(false);
    setIsAILoading(true);
    addMessage(`🔄 Converting ${detectedLanguage} → ${targetLang}…`, 'bot');

    try {
      const response = await convertAPI.convertCode(uploadedCode, detectedLanguage, targetLang);
      const { convertedCode, engine } = response.data;

      const engineLabel = engine === 'openai'
        ? ' (AI-powered)'
        : engine === 'pattern-fallback'
        ? ' (pattern-based fallback)'
        : ' (pattern-based)';

      addMessage(
        `✅ Converted to ${targetLang}${engineLabel}`,
        'bot'
      );
      addMessage('Converted code', 'bot', 'code', {
        code: convertedCode,
        codeLanguage: targetLang
      });
      addMessage(
        `Your ${detectedLanguage} code has been converted to ${targetLang}. Use the copy button above to grab it!\n\nNeed anything else? Paste more code or upload another file.`,
        'bot'
      );

      // Reset for next conversion
      setUploadedCode('');
      setDetectedLanguage('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Conversion failed. Please try again.';
      addMessage(`❌ ${msg}`, 'bot');
    } finally {
      setIsAILoading(false);
    }
  };

  // ─── Action handlers ─────────────────────────────────────────────────────────

  const handleChooseAction = (rawInput) => {
    const input = rawInput.toLowerCase();
    if (input.includes('bug') || input.includes('error') || input.includes('fix')) {
      setPendingAction(null);
      setShowSuggestions(false);
      handleBugDetection(uploadedCode, detectedLanguage);
    } else if (input.includes('convert')) {
      setPendingAction('choose-target-language');
      setShowSuggestions(true);
      addMessage('Which language would you like to convert to?', 'bot');
    } else {
      addMessage('Please choose "Fix Bugs" or "Convert Language" below.', 'bot');
    }
  };

  const handleChooseTargetLanguage = (lang) => {
    setPendingAction(null);
    setShowSuggestions(false);
    handleConversion(lang);
  };

  // ─── Send message ─────────────────────────────────────────────────────────────

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text || isAILoading) return;
    setInputValue('');

    if (looksLikeCode(text)) {
      const lang = detectLanguage(text);
      const displayLang = lang === 'Unknown' ? 'Code' : lang;
      const normalized = normalizeCode(text);
      addMessage('Your code', 'user', 'code', { code: normalized, codeLanguage: displayLang });
      promptActionForCode(text, displayLang, { skipCodeDisplay: true });
      return;
    }

    addMessage(text, 'user');

    if (pendingAction === 'choose-action') {
      handleChooseAction(text);
      return;
    }

    if (pendingAction === 'choose-target-language') {
      const matched = commonTargetLanguages.find((l) => l.toLowerCase() === text.toLowerCase());
      if (matched) {
        handleChooseTargetLanguage(matched);
      } else {
        addMessage(`I don't recognise "${text}" as a supported language. Please select one below.`, 'bot');
      }
      return;
    }

    // Generic chat
    addMessage('Paste or upload code to get started! I can convert between languages or find bugs.', 'bot');
  };

  // ─── File upload ─────────────────────────────────────────────────────────────

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    const langMap = {
      py: 'Python', js: 'JavaScript', jsx: 'JavaScript', ts: 'TypeScript', tsx: 'TypeScript',
      java: 'Java', cpp: 'C++', cc: 'C++', cs: 'C#', go: 'Go', rs: 'Rust', php: 'PHP',
      rb: 'Ruby', kt: 'Kotlin', swift: 'Swift', sql: 'SQL', sh: 'Bash', lua: 'Lua'
    };

    if (file.size > 5 * 1024 * 1024) {
      addMessage('❌ File too large. Maximum size is 5MB.', 'bot');
      return;
    }

    addMessage(`📎 Uploading: ${file.name}`, 'user');

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (!content || !content.trim()) {
        addMessage('⚠️ The uploaded file appears to be empty.', 'bot');
        return;
      }
      const detectedLang = langMap[ext] || detectLanguage(content) || 'Code';
      const normalized = normalizeCode(content);
      promptActionForCode(normalized, detectedLang);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className={`h-full rounded-xl border p-5 flex flex-col shadow-2xl relative overflow-hidden ${
      theme === 'dark'
        ? 'border-slate-700 bg-slate-800 text-slate-100'
        : 'border-slate-300 bg-white/90 text-slate-900'
    }`}>
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />

      {/* Copy toast */}
      {copyToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/90 text-white text-sm font-medium shadow-lg animate-slideDown">
          <CheckCircle className="w-4 h-4" />
          Copied to clipboard!
        </div>
      )}

      {/* Header */}
      <div className="mb-3 pt-2 flex items-center justify-between gap-3">
        <h2 className={`text-[clamp(1.5rem,3vw,2.25rem)] font-medium tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          CodeAlchemy
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (typeof onToggleTheme === 'function') {
                onToggleTheme();
              } else {
                const current = document.documentElement.dataset.theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                const next = current === 'dark' ? 'light' : 'dark';
                document.documentElement.dataset.theme = next;
                try { localStorage.setItem('codealchemy_theme', next); } catch (e) {}
              }
            }}
            className={`inline-flex h-11 items-center justify-center rounded-full px-3 text-sm font-semibold transition shadow-lg ${
              theme === 'dark'
                ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
            }`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((p) => !p)}
            className="h-11 w-11 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform"
            title="Profile menu"
            aria-label="Open profile menu"
            aria-expanded={isProfileMenuOpen}
          >
            {monogram}
          </button>
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-600 bg-slate-800 shadow-2xl z-20 animate-slideDown">
              <div className="px-4 py-3 border-b border-slate-700">
                <p className="text-xs uppercase tracking-wide text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-white truncate">{userName}</p>
              </div>
              <button
                type="button"
                onClick={() => { setIsProfileMenuOpen(false); if (onLogout) onLogout(); }}
                className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-slate-700 rounded-b-xl transition"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-transparent px-2 py-1 space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === 'greeting'
                ? 'justify-center'
                : message.sender === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-3 ${
                message.type === 'greeting'
                  ? 'max-w-xl text-center border border-indigo-400/40 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-100'
                  : message.type === 'code'
                  ? `w-full max-w-3xl border border-slate-700 bg-[#111318] text-slate-100 ${
                      message.sender === 'user' ? 'ml-auto' : ''
                    }`
                  : message.sender === 'user'
                  ? 'max-w-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                  : 'max-w-lg border border-slate-600 bg-slate-700 text-slate-100'
              }`}
            >
              {message.type === 'code' ? (
                <CodeBlock
                  code={message.code}
                  language={message.codeLanguage}
                  label={message.text}
                  onCopy={handleCopyCode}
                />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.text}
                </p>
              )}
              <span className="text-xs opacity-50 mt-1.5 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {/* AI Loading indicator */}
        {isAILoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-3 border border-slate-600 bg-slate-700 rounded-2xl px-4 py-3">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-sm text-slate-300">AI is thinking…</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Action suggestion buttons */}
      {showSuggestions && pendingAction === 'choose-action' && !isAILoading && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { addMessage('Fix Bugs / Errors', 'user'); handleChooseAction('bug'); }}
            className="rounded-full border border-indigo-500/40 bg-indigo-500/20 px-4 py-1.5 text-sm text-indigo-200 transition hover:bg-indigo-500/30 font-medium"
          >
            🐛 Fix Bugs / Errors
          </button>
          <button
            type="button"
            onClick={() => { addMessage('Convert Language', 'user'); handleChooseAction('convert'); }}
            className="rounded-full border border-purple-500/40 bg-purple-500/20 px-4 py-1.5 text-sm text-purple-200 transition hover:bg-purple-500/30 font-medium"
          >
            🔄 Convert Language
          </button>
        </div>
      )}

      {showSuggestions && pendingAction === 'choose-target-language' && !isAILoading && (
        <div className="mt-2 flex flex-wrap gap-2">
          {commonTargetLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => { addMessage(lang, 'user'); handleChooseTargetLanguage(lang); }}
              className="rounded-full border border-slate-500 bg-slate-700 px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-600 hover:border-indigo-400"
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="mt-4 flex items-end gap-2 rounded-2xl border border-slate-600 bg-slate-700 px-4 sm:px-6 py-2.5 sm:py-3 focus-within:border-indigo-500/50 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".py,.js,.jsx,.ts,.tsx,.java,.cpp,.c,.cs,.go,.php,.rb,.rs,.swift,.kt,.scala,.sql,.sh,.txt,.lua"
        />
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          placeholder={isAILoading ? 'AI is processing…' : 'Paste code or type a message… (Enter to send, Shift+Enter for new line)'}
          disabled={isAILoading}
          className="flex-1 resize-none bg-transparent py-0.5 text-[clamp(0.9rem,2vw,1.1rem)] text-white placeholder-slate-400 outline-none disabled:opacity-50 max-h-32 overflow-y-auto"
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isAILoading}
          className="rounded-full p-2 text-indigo-300 transition hover:bg-slate-600 hover:text-indigo-200 disabled:opacity-40"
          title="Upload code file"
          aria-label="Upload file"
        >
          <Paperclip className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isAILoading || !inputValue.trim()}
          className="rounded-full p-2 text-indigo-300 transition hover:bg-slate-600 hover:text-indigo-200 disabled:opacity-40"
          title="Send"
          aria-label="Send message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
