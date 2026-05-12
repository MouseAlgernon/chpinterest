import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import LoginPage from './app/components/LoginPage';
import { useAuth } from './app/hooks/useAuth';
import './styles/index.css';

function Root() {
  const { user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  return <App user={user} onLogout={logout} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);