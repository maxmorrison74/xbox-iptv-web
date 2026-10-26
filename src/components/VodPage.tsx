import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import XtreamApiService from '../api';
import { VodItem, Category } from '../types';

const VodPage: React.FC = () => {
  const api = React.useRef(XtreamApiService.getInstance());
  const [vodItems, setVodItems] = useState<VodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = vodItems.filter(v => v.category_id === selectedCategory);
      setVodItemsFromCategory(filtered);
    } else {
      const filtered = vodItems.filter(v => !selectedCategory || v.category_id === selectedCategory);
      setVodItems(filtered);
    }
  }, [selectedCategory, vodItems]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [vodStreams, vodCategories] = await Promise.all([
        api.current.getVodStreams(),
        api.current.getVodCategories()
      ]);
      
      setVodItems(vodStreams);
      setCategories(vodCategories);
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const playVod = (item: VodItem) => {
    const url = api.current.getVodUrl(item.stream_id);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-green-600 to-blue-700 p-6 shadow-lg">
        <h1 className="text-4xl font-bold">🎬 Video on Demand</h1>
        <p className="text-green-100 mt-1">{vodItems.length} film disponibili</p>
      </header>

      <nav className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Link to="/live" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all mr-3">📺 Live</Link>
        <Link to="/series" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all">📡 Serie</Link>
        <Link to="/settings" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all ml-3">⚙ Impostazioni</Link>
      </nav>

      <div className="container mx-auto p-6">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white/5 rounded-xl p-4">
              <h2 className="text-xl font-bold mb-4">Generi</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-green-600/30 transition-all"
              >
                🎬 Tutti i film
              </button>
              {categories.map(cat => (
                <button
                  key={cat.category_id}
                  onClick={() => setSelectedCategory(cat.category_id)}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-green-600/30 transition-all text-sm"
                >
                  {cat.category_name}
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-pulse text-6xl mb-4">⏳</div>
                <p>Caricamento VOD...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vodItems.map(item => (
                  <div
                    key={item.stream_id}
                    className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10
                             hover:border-green-500/50 transition-all cursor-pointer group"
                    onClick={() => playVod(item)}
                    onDoubleClick={() => playVod(item)}
                  >
                    {item.stream_icon ? (
                      <img
                        src={item.stream_icon}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `<div class="h-48 flex items-center justify-center bg-gray-700">🎬</div>`;
                        }}
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-gray-700">🎬</div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm group-hover:text-green-400 transition-all line-clamp-2">
                        {item.name}
                      </h3>
                      {item.rating && (
                        <p className="text-xs text-yellow-400 mt-2">⭐ {item.rating}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VodPage;
