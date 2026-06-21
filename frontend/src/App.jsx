import React, { useEffect, useState } from 'react';
import ChatSection from './components/ChatSection';
import Auth from './components/Auth';
import { saveToken, clearToken, getToken } from './utils/api';

const SESSION_USER_KEY = 'codealchemy_session_user';
const THEME_STORAGE_KEY = 'codealchemy_theme';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState('dark');

  // On mount: restore session from localStorage (token + user + theme)
  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_USER_KEY);
    const savedToken = getToken();
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedUser && savedToken) {
      setUserName(savedUser);
      setIsAuthenticated(true);
    }

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  // Called by Auth component after successful login/register
  const handleAuthSuccess = ({ token, user }) => {
    saveToken(token);
    localStorage.setItem(SESSION_USER_KEY, user.name);
    setUserName(user.name);
    setIsAuthenticated(true);
  };

  // Called by ChatSection logout button
  const handleLogout = () => {
    clearToken();
    localStorage.removeItem(SESSION_USER_KEY);
    setUserName('');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100'
      }`}
    >
      <main className="mx-auto max-w-6xl">
        <div className="h-[85vh]">
          <ChatSection
            onLogout={handleLogout}
            userName={userName}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>
      </main>
    </div>
  );
}
