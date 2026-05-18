import React, { useEffect, useState } from 'react';
import ChatSection from './components/ChatSection';
import Auth from './components/Auth';
import { saveToken, clearToken, getToken } from './utils/api';

const SESSION_USER_KEY = 'codealchemy_session_user';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // On mount: restore session from localStorage (token + user)
  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_USER_KEY);
    const savedToken = getToken();
    if (savedUser && savedToken) {
      setUserName(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6 sm:px-8">
      <main className="mx-auto max-w-6xl">
        <div className="h-[85vh]">
          <ChatSection onLogout={handleLogout} userName={userName} />
        </div>
      </main>
    </div>
  );
}
