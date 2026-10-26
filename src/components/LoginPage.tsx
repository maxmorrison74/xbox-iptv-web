import React, { useState, useEffect } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string, serverUrl: string) => Promise<string>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [serverUrl, setServerUrl] = useState('http://ngueyepdn.xxczsmart.com');
  const [username, setUsername] = useState('M99SVERR');
  const [password, setPassword] = useState('JJAJXT7V');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Carica credenziali salvate
    const saved = localStorage.getItem('xtream_auth');
    if (saved) {
      const { serverUrl, username, password } = JSON.parse(saved);
      setServerUrl(serverUrl);
      setUsername(username);
      setPassword(password);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await onLogin(username, password, serverUrl);
      if (result !== 'success') {
        setError(result);
        // Cancella auth su errore
        localStorage.removeItem('xtream_auth');
      }
    } catch (err: any) {
      setError(err.message || 'Errore di connessione');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          📺 IPTV Smarters Xbox
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">URL del Server</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="http://server-iptv.com:8080"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Username"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Password"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg font-bold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Autenticazione...' : '🔐 ACCEDI'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Credenziali salvate automaticamente su questo dispositivo
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
