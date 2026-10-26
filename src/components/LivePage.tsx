import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hls from 'hls.js';
import XtreamApiService from '../api';
import { LiveChannel, Category, EpgProgramme } from '../types';

const LivePage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const api = React.useRef(XtreamApiService.getInstance());
  const [channels, setChannels] = useState<LiveChannel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filteredChannels, setFilteredChannels] = useState<LiveChannel[]>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredChannels(channels.filter(ch => ch.category_id === selectedCategory));
    } else {
      setFilteredChannels(channels);
    }
  }, [selectedCategory, channels]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [liveChannels, liveCategories] = await Promise.all([
        api.current.getLiveStreams(),
        api.current.getLiveCategories()
      ]);
      
      setChannels(liveChannels);
      setCategories(liveCategories);
    } catch (error) {
      console.error('Errore caricamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const playChannel = (channel: LiveChannel) => {
    const url = api.current.getStreamUrl(channel.stream_id);
    window.open(url, '_blank');
  };

  const playChannelInApp = (channel: LiveChannel) => {
    const url = api.current.getStreamUrl(channel.stream_id);
    window.location.href = `/player?url=${encodeURIComponent(url)}&title=${encodeURIComponent(channel.name)}`;
  };

  // Carica EPG per canali selezionati
  const loadEPG = async () => {
    if (!channel || !channel.epg_channel_id) return;
    const epg = await api.current.getShortEpg([channel.epg_channel_id]);
    console.log('EPG:', epg[channel.epg_channel_id]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">📺 Canali Live</h1>
            <p className="text-blue-100 mt-1">{channels.length} canali disponibili</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => loadData()}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
            >
              🔄 Aggiorna
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700/50">
        <div className="flex gap-3">
          <Link to="/live" className="px-6 py-2 bg-blue-600 rounded-lg font-medium" onClick={(e) => e.preventDefault()}>
            Canali
          </Link>
          <Link to="/vod" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all">
            🎬 VOD
          </Link>
          <Link to="/series" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all">
            📡 Serie
          </Link>
          <Link to="/settings" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all">
            ⚙ Impostazioni
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="flex gap-6">
          {/* Categories Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Categorie</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full text-left px-4 py-2 rounded-lg mb-2 hover:bg-blue-600/30 transition-all"
              >
                📺 Tutti i canali
              </button>
              {categories.map(cat => (
                <button
                  key={cat.category_id}
                  onClick={() => setSelectedCategory(cat.category_id)}
                  className="w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center gap-2
                            hover:bg-blue-600/30 transition-all text-sm"
                >
                  {selectedCategory === cat.category_id && '🔹'}
                  {cat.category_name}
                </button>
              ))}
            </div>
          </aside>

          {/* Channels List */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-pulse text-6xl mb-4">⏳</div>
                <p className="text-lg">Caricamento canali...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChannels.map(channel => (
                  <div
                    key={channel.stream_id}
                    className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 
                             hover:border-blue-500/50 transition-all cursor-pointer group"
                    onClick={() => playChannelInApp(channel)}
                    onDoubleClick={() => playChannel(channel)}
                  >
                    {channel.stream_icon && (
                      <div className="mb-3 flex justify-center">
                        <img
                          src={channel.stream_icon}
                          alt={channel.name}
                          className="w-24 h-16 object-contain bg-white/5 rounded-lg"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-400 transition-all">
                      {channel.name}
                    </h3>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Live
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredChannels.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl">Nessun canale trovato</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800/50 p-4 text-center text-gray-400 text-sm">
        <p>💡 Doppio click per aprire in tab esterna • Single click per player integrato</p>
      </footer>
    </div>
  );
};

export default LivePage;
