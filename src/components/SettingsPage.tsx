import React from 'react';
import { Link } from 'react-router-dom';
import XtreamApiService from '../api';

const SettingsPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const api = React.useRef(XtreamApiService.getInstance());

  const handleWipeData = () => {
    if (confirm('Cancella tutte le credenziali salvate?')) {
      api.current.clearAuth();
      localStorage.removeItem('xtream_auth');
      onLogout();
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 shadow-lg">
        <h1 className="text-4xl font-bold">⚙ Impostazioni</h1>
      </header>

      <nav className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Link to="/live" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all mr-3">📺 Live</Link>
        <Link to="/vod" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all mr-3">🎬 VOD</Link>
        <Link to="/series" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all">📡 Serie</Link>
      </nav>

      <div className="container mx-auto p-6 max-w-3xl">
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Info Account</h2>
            <p className="text-gray-300">Credenziali salvate su questo dispositivo</p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Azioni</h2>
            
            <button
              onClick={() => {
                api.current.clearAuth();
                localStorage.removeItem('xtream_auth');
                // Ritorna alla pagina di login
                onLogout();
              }}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
            >
              🔄 Cambia account
            </button>

            <button
              onClick={handleWipeData}
              className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all"
            >
              🗑️ Cancella tutti i dati
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-4">Informazioni App</h2>
            <div className="space-y-2 text-gray-300">
              <p><span className="font-semibold">Versione:</span> 1.0.0 (Web PWA)</p>
              <p><span className="font-semibold">Compatibilità:</span> Xbox Series X|S Dev Mode</p>
              <p><span className="font-semibold">API:</span> Xtream Codes</p>
              <p><span className="font-semibold">Features:</span> Live TV, VOD, Serie TV, EPG</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800/50 p-6 text-center text-gray-400">
        <p>Made with ❤️ per Xbox Dev Mode • Versione Web PWA</p>
      </footer>
    </div>
  );
};

export default SettingsPage;
