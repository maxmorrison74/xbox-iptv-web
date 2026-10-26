import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hls from 'hls.js';

const PlayerPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceUrl = searchParams.get('url');
  const title = searchParams.get('title') || 'Video';

  useEffect(() => {
    if (!sourceUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        capLevelToPlayerSize: true,
      });

      hls.loadSource(sourceUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.log('Errore avvio:', e));
        console.log('Stream caricato con HLS.js');
      });

      hls.on(Hls.Events.ERROR, (data) => {
        console.error('Errore HLS:', data);
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari e alcuni browser supportano HLS nativamente
      video.src = sourceUrl;
      video.play().catch(e => console.log('Errore avvio:', e));
    }
  }, [sourceUrl]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all"
      >
        ⬅ INDIETRO
      </button>

      <div className="flex-1 flex items-center justify-center bg-black p-4">
        <video
          ref={videoRef}
          className="w-full max-h-screen"
          controls
          autoPlay
          playsInline
        />
      </div>

      <div className="bg-gray-900 p-4 border-t border-gray-800">
        <h2 className="text-xl font-semibold truncate">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">Player integrato • Doppio click per fullscreen</p>
      </div>
    </div>
  );
};

export default PlayerPage;
