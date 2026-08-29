'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Send, 
  MessageSquare, 
  Link as LinkIcon, 
  Globe, 
  Gamepad2, 
  LoaderPinwheel,
  Search,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';

// TikTok SVG İkonu
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// Instagram SVG İkonu
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// YouTube SVG İkonu
const YoutubeIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

// Route API ve SoundCloud Widget API Bağlantılı Custom Audio Player
function SoundCloudAudioPlayer({ trackUrl }: { trackUrl: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [meta, setMeta] = useState<{ title?: string; author_name?: string }>({});

  // 1. /api/soundcloud Endpoint'inden Parça Bilgisi Çek
  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await fetch(`/api/soundcloud?url=${encodeURIComponent(trackUrl)}`);
        const data = await res.json();
        if (!data.error) {
          setMeta({ title: data.title, author_name: data.author_name });
        }
      } catch (e) {
        console.error('Route handler fetch error', e);
      }
    }
    fetchMeta();
  }, [trackUrl]);

  // 2. SoundCloud Widget API Yükle & Event Binding
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).SC && iframeRef.current) {
        const widget = (window as any).SC.Widget(iframeRef.current);
        widgetRef.current = widget;

        widget.bind((window as any).SC.Widget.Events.READY, () => {
          setIsReady(true);
          widget.getDuration((d: number) => setDuration(d / 1000));
          widget.setVolume(volume * 100);
        });

        widget.bind((window as any).SC.Widget.Events.PLAY, () => setIsPlaying(true));
        widget.bind((window as any).SC.Widget.Events.PAUSE, () => setIsPlaying(false));
        widget.bind((window as any).SC.Widget.Events.FINISH, () => setIsPlaying(false));

        widget.bind((window as any).SC.Widget.Events.PLAY_PROGRESS, (data: any) => {
          setCurrentTime(data.currentPosition / 1000);
        });
      }
    };
  }, []);

  const togglePlay = () => {
    if (!widgetRef.current || !isReady) return;
    widgetRef.current.toggle();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeInSec = parseFloat(e.target.value);
    setCurrentTime(timeInSec);
    if (widgetRef.current && isReady) {
      widgetRef.current.seekTo(timeInSec * 1000);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (widgetRef.current && isReady) {
      widgetRef.current.setVolume(val * 100);
    }
  };

  const toggleMute = () => {
    if (!widgetRef.current || !isReady) return;
    if (isMuted) {
      widgetRef.current.setVolume(volume * 100);
      setIsMuted(false);
    } else {
      widgetRef.current.setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full bg-[#0f172a]/90 border border-blue-900/60 rounded-xl p-4 shadow-xl backdrop-blur-md flex flex-col gap-3 relative">
      {/* Gizli Iframe (Arka planda SoundCloud API ile köprü kurar) */}
      <iframe
        ref={iframeRef}
        className="absolute w-1 h-1 opacity-0 pointer-events-none -z-50"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&auto_play=false`}
        allow="autoplay"
      ></iframe>

      {/* Parça İsmi */}
      <div className="text-xs font-semibold text-blue-400 tracking-wider truncate flex items-center gap-2">
        <Music size={14} className={`text-blue-400 ${isPlaying ? 'animate-spin' : ''}`} />
        <span className="truncate">{meta.title || 'Gimme More (Kim Thomas Remix)'}</span>
      </div>

      {/* Ana Kontroller & İlerleme Çubuğu */}
      <div className="flex items-center gap-3">
        {/* Play/Pause Butonu */}
        <button
          onClick={togglePlay}
          disabled={!isReady}
          className="p-2.5 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50 hover:text-white transition-all flex-shrink-0 disabled:opacity-50"
        >
          {!isReady ? (
            <LoaderPinwheel size={18} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} className="ml-0.5" />
          )}
        </button>

        {/* İlerleme Çubuğu + Zaman */}
        <div className="flex-1 flex flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            disabled={!isReady}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Ses Kontrolü */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleMute}
            disabled={!isReady}
            className="text-slate-400 hover:text-blue-300 transition-colors p-1 disabled:opacity-50"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            disabled={!isReady}
            className="w-14 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hidden sm:block disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<'chat' | 'links'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
    { role: 'assistant', text: "I'm Mami. Ask me anything!" },
  ]);
  const [loading, setLoading] = useState(false);

  // SoundCloud Parça Adresi
  const trackUrl = "https://soundcloud.com/kim-thomas-620577821/britney-spears-gimme-more-kim-thomas-remix";

  // Sosyal medya ve proje bağlantıların
  const socialLinks = [
    {
      name: 'Olyster AI',
      url: 'https://www.olyster.dedyn.io',
      icon: <LoaderPinwheel size={18} />,
      color: 'hover:border-purple-500/50 hover:text-purple-400',
    },
    {
      name: 'Whodunnit',
      url: 'https://whodunnit.duckdns.org',
      icon: <Search size={18} />,
      color: 'hover:border-red-500/50 hover:text-red-400',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@Olystear',
      icon: <YoutubeIcon size={18} />,
      color: 'hover:border-red-600/50 hover:text-red-500',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/mamicikle',
      icon: <InstagramIcon size={18} />,
      color: 'hover:border-pink-500/50 hover:text-pink-400',
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@m.emindadak',
      icon: <TikTokIcon size={18} />,
      color: 'hover:border-cyan-500/50 hover:text-cyan-400',
    },
  ];

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply || 'Bir hata oluştu.' },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Bağlantı hatası oluştu.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-white flex flex-col items-center p-4 font-mono relative overflow-hidden">
      {/* Arka plan siber kare deseni */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center gap-6 z-10 pt-4 pb-32">
        {/* Tab Menüsü */}
        <div className="flex bg-[#0f172a]/80 border border-blue-900/50 rounded-lg p-1 w-full text-center">
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-1.5 text-sm rounded transition-all flex items-center justify-center gap-2 ${
              tab === 'chat' ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare size={16} /> chat
          </button>
          <button
            onClick={() => setTab('links')}
            className={`flex-1 py-1.5 text-sm rounded transition-all flex items-center justify-center gap-2 ${
              tab === 'links' ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon size={16} /> links
          </button>
        </div>

        {/* Profil İkonu & İsim */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-28 h-28 border-2 border-blue-500/40 rounded-xl overflow-hidden bg-slate-900/90 shadow-lg shadow-blue-500/10 flex items-center justify-center text-blue-400">
            <User size={56} />
          </div>
          <h1 className="text-xl tracking-widest text-slate-200">mami</h1>
        </div>

        {/* Route API Entegreli SoundCloud Oynatıcı */}
        <SoundCloudAudioPlayer trackUrl={trackUrl} />

        {tab === 'chat' && (
          <>
            {/* Mesaj Akışı */}
            <div className="w-full space-y-3 px-1">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`p-3 rounded border backdrop-blur-md text-sm ${
                      msg.role === 'assistant'
                        ? 'w-full bg-blue-950/40 border-blue-800/40 text-blue-100 text-left'
                        : 'bg-slate-900/90 border-slate-700/60 text-slate-200 text-right max-w-[80%]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Yükleme Balonu */}
              {loading && (
                <div className="flex justify-start">
                  <div className="w-full bg-blue-950/40 border border-blue-800/40 text-blue-300 p-3 rounded text-sm flex items-center gap-2">
                    <LoaderPinwheel className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Düşünüyor...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Kutusu */}
            <div className="w-full fixed bottom-12 max-w-md px-4 z-20">
              <div className="relative flex items-center">
                <User className="absolute left-3 text-slate-500" size={18} />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={loading ? 'Thinking...' : 'Ask me anything...'}
                  disabled={loading}
                  className="w-full bg-[#0f172a]/90 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 backdrop-blur-md placeholder:text-slate-500 shadow-xl"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="absolute right-3 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <LoaderPinwheel className="w-[18px] h-[18px] animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {tab === 'links' && (
          <div className="w-full space-y-3 px-1">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-lg text-slate-200 transition-all backdrop-blur-md ${link.color}`}
              >
                <span className="flex items-center gap-3 font-medium">
                  {link.icon}
                  {link.name}
                </span>
                <span className="text-xs text-slate-500">→</span>
              </a>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="w-full fixed bottom-2 text-center text-[10px] text-slate-500/80 px-4 flex items-center justify-center gap-2 pointer-events-auto z-10">
          <span>Powered by <span className="text-blue-400 font-semibold">Gemini </span></span>
          <span>•</span>
          <Link href="/privacy" className="hover:text-slate-300 underline">
            Gizlilik Politikası
          </Link>
        </footer>
      </div>
    </main>
  );
        }
