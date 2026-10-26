import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import XtreamApiService from './api';
import LoginPage from './components/LoginPage';
import LivePage from './components/LivePage';
import VodPage from './components/VodPage';
import SeriesPage from './components/SeriesPage';
import PlayerPage from './components/PlayerPage';
import SettingsPage from './components/SettingsPage';

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('xtream_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const api = React.useRef(XtreamApiService.getInstance());

  const handleLogin = async (username: string, password: string, serverUrl: string) => {
    api.current.setAuth({ username, password, serverUrl });
    
    try {
      await api.current.getUserInfo();
      setAuth({ username, password, serverUrl });
      return 'success';
    } catch (error: any) {
      return error.message || 'Login fallito';
    }
  };

  return (
    <Router>
      <Routes>
        {!auth ? (
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/live" element={<LivePage onLogout={() => {
              api.current.clearAuth();
              setAuth(null);
              localStorage.removeItem('xtream_auth');
            }} />} />
            <Route path="/vod" element={<VodPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/player" element={<PlayerPage onBack={() => window.history.back()} />} />
            <Route path="/settings" element={<SettingsPage onLogout={() => {
              api.current.clearAuth();
              setAuth(null);
              localStorage.removeItem('xtream_auth');
            }} />} />
            <Route path="/" element={<Navigate to="/live" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
