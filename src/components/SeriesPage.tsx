import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import XtreamApiService from '../api';
import { SeriesData } from '../types';

const SeriesPage: React.FC = () => {
  const api = React.useRef(XtreamApiService.getInstance());
  const [seriesList, setSeriesList] = useState<SeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<SeriesData | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);

  useEffect(() => {
    loadSeries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSeries = async () => {
    try {
      setLoading(true);
      const series = await api.current.getSeries();
      setSeriesList(series);
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeriesSelect = (serie: SeriesData) => {
    setSelectedSeries(serie);
    const firstSeason = Object.keys(serie.seasons || {})[0];
    setSelectedSeason(firstSeason);
    
    if (serie.seasons && firstSeason) {
      const episode = serie.seasons[firstSeason].episodes[0];
      setSelectedEpisode(episode);
    }
  };

  const handleSeasonSelect = (seasonKey: string) => {
    setSelectedSeason(seasonKey);
    if (selectedSeries?.seasons && selectedSeries.seasons[seasonKey]) {
      const episode = selectedSeries.seasons[seasonKey].episodes[0];
      setSelectedEpisode(episode);
    }
  };

  const playEpisode = () => {
    if (!selectedSeries || !selectedSeason || !selectedEpisode) return;
    
    const seasonNum = parseInt(selectedSeason);
    const url = api.current.getSeriesStreamUrl(
      selectedSeries.series_id,
      seasonNum,
      selectedEpisode.id
    );
    
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 to-pink-700 p-6 shadow-lg">
        <h1 className="text-4xl font-bold">📡 Serie TV</h1>
        <p className="text-purple-100 mt-1">{seriesList.length} serie disponibili</p>
      </header>

      <nav className="bg-gray-800/50 p-4 border-b border-gray-700">
        <Link to="/live" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all mr-3">📺 Live</Link>
        <Link to="/vod" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all">🎬 VOD</Link>
        <Link to="/settings" className="px-6 py-2 hover:bg-gray-700 rounded-lg transition-all ml-3">⚙ Impostazioni</Link>
      </nav>

      <div className="container mx-auto p-6">
        {!selectedSeries ? (
          // Lista Serie
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <div className="animate-pulse text-6xl mb-4">⏳</div>
                <p>Caricamento serie...</p>
              </div>
            ) : (
              seriesList.map(serie => (
                <div
                  key={serie.series_id}
                  className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10
                           hover:border-purple-500/50 transition-all cursor-pointer group"
                  onClick={() => handleSeriesSelect(serie)}
                >
                  {serie.cover ? (
                    <img
                      src={serie.cover}
                      alt={serie.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="h-64 flex items-center justify-center bg-gray-700">📺</div>`;
                      }}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-700">📺</div>
                  )}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm group-hover:text-purple-400 transition-all line-clamp-2">
                      {serie.name}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Dettaglio Serie
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => {
                setSelectedSeries(null);
                setSelectedSeason(null);
                setSelectedEpisode(null);
              }}
              className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              ⬅ Indietro
            </button>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                  {selectedSeries.cover ? (
                    <img
                      src={selectedSeries.cover}
                      alt={selectedSeries.name}
                      className="w-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="h-64 flex items-center justify-center bg-gray-700">📺</div>`;
                      }}
                    />
                  ) : (
                    <div className="h-64 flex items-center justify-center bg-gray-700">📺</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h2 className="text-3xl font-bold mb-4">{selectedSeries.name}</h2>
                  
                  <div className="flex gap-4 mb-6">
                    <div className="bg-blue-600/20 px-4 py-2 rounded-lg">
                      <span className="text-sm text-blue-300">Stagioni:</span>
                      <span className="ml-2 font-semibold">{Object.keys(selectedSeries.seasons || {}).length}</span>
                    </div>
                  </div>

                  {/* Selezione Stagione */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Seleziona Stagione</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeries.seasons && Object.entries(selectedSeries.seasons).map(([key, season]) => (
                        <button
                          key={key}
                          onClick={() => handleSeasonSelect(key)}
                          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            selectedSeason === key
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          Stagione {season.season_number}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selezione Episodio */}
                  {selectedSeason && selectedSeries.seasons && selectedSeries.seasons[selectedSeason] && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Episodi</h3>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {selectedSeries.seasons[selectedSeason]?.episodes.map(ep => (
                          <div
                            key={ep.id}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${
                              selectedEpisode?.id === ep.id
                                ? 'bg-purple-600/30 border-2 border-purple-500'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            onClick={() => {
                              setSelectedEpisode(ep);
                              setSelectedSeries(null);
                              // Re-render forza player
                              setTimeout(() => setSelectedSeries(selectedSeries), 100);
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">
                                  E{String(ep.episode_number).padStart(2, '0')} - {ep.name}
                                </h4>
                                {ep.info?.plot && (
                                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">{ep.info.plot}</p>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEpisode(ep);
                                }}
                                className="ml-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition-all"
                              >
                                ▶ Riproduci
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={playEpisode}
                    className="block mt-6 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold text-xl transition-all"
                  >
                    ▶ RIPRODUCI {selectedEpisode ? `S${selectedSeries.seasons[selectedSeason]?.season_number}E${selectedEpisode.episode_number}` : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;
