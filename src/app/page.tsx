'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, ChevronDown, ChevronUp } from 'lucide-react';

export default function SoundCloudPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);

  // Attığın Linkin Doğrudan SoundCloud Track ID'si
  const trackId = "341071239";

  useEffect(() => {
    // SoundCloud Widget API Script yüklemesi
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).SC && iframeRef.current) {
        const widget = (window as any).SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        // Oynatma Durumlarını Dinle
        widget.bind((window as any).SC.Widget.Events.PLAY, () => setIsPlaying(true));
        widget.bind((window as any).SC.Widget.Events.PAUSE, () => setIsPlaying(false));
        widget.bind((window as any).SC.Widget.Events.FINISH, () => setIsPlaying(false));
      }
    };
  }, []);

  const togglePlay = () => {
    if (!widgetRef.current) return;
    widgetRef.current.toggle();
  };

  return (
    <div className="fixed bottom-14 right-4 z-30 max-w-[280px] w-full bg-[#0d1322]/95 border border-blue-900/60 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden font-mono">
      {/* Track ID Doğrudan SoundCloud Widget API'ye Bağlandı */}
      <iframe
        ref={iframeRef}
        className="hidden"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&auto_play=false`}
        allow="autoplay"
      ></iframe>

      {/* Header Bar */}
      <div 
        onClick={() => setIsPlayerOpen(!isPlayerOpen)}
        className="flex items-center justify-between px-3 py-1.5 bg-blue-950/50 cursor-pointer border-b border-blue-900/40 hover:bg-blue-900/30 transition select-none"
      >
        <div className="flex items-center gap-2 text-xs text-blue-300 font-semibold truncate">
          <Music size={13} className={`text-blue-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="truncate">Gimme More (Kim Thomas Remix)</span>
        </div>
        <button className="text-slate-400 hover:text-white p-0.5">
          {isPlayerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {/* Kontroller */}
      {isPlayerOpen && (
        <div className="p-3 bg-[#090d16] flex flex-col gap-2">
          {/* ASCII Bar */}
          <div className="flex items-center justify-between text-[11px] text-blue-400 font-mono bg-slate-950/80 p-2 rounded border border-slate-800/80">
            <span className="text-blue-400 font-extrabold tracking-widest px-1">
              {isPlaying ? '>---•--------' : '>------------'}
            </span>
            <span className="text-slate-500">SOUNDCLOUD</span>
          </div>

          {/* Oynat/Durdur Butonu */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={togglePlay}
              className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/40 text-blue-300 rounded text-xs transition font-bold"
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <span className="text-[10px] text-slate-500">READY</span>
          </div>
        </div>
      )}
    </div>
  );
}
