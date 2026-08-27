'use client';

import { useState } from 'react';
import { User, Send, Bot, MessageSquare, Link, Gift } from 'lucide-react';

export default function Home() {
  const [tab, setTab] = useState<'chat' | 'links' >('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
    { role: 'assistant', text: "I'm Mami. Ask me anything!" },
  ]);
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen bg-[#020617] text-white flex flex-col items-center p-4 font-mono relative overflow-hidden">
      {/* Arka plan siber kare deseni */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center gap-6 z-10 pt-4 pb-24">
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
            <Link size={16} /> links
          </button>
          <button
            onClick={() => setTab('gift')}
            className={`flex-1 py-1.5 text-sm rounded transition-all flex items-center justify-center gap-2 ${
              tab === 'gift' ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift size={16} /> gift
          </button>
        </div>

        {tab === 'chat' && (
          <>
            {/* Profil İkonu / Avatar Alanı */}
            <div className="relative">
              <div className="w-28 h-28 border-2 border-blue-500/40 rounded-xl overflow-hidden bg-slate-900/90 shadow-lg shadow-blue-500/10 flex items-center justify-center text-blue-400">
                <User size={56} />
              </div>
            </div>

            {/* İsim */}
            <h1 className="text-xl tracking-widest text-slate-200">kuzey</h1>

            {/* Mesaj Akışı */}
            <div className="w-full space-y-3 max-h-[45vh] overflow-y-auto px-1">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded border backdrop-blur-md text-sm ${
                    msg.role === 'assistant'
                      ? 'bg-blue-950/40 border-blue-800/40 text-blue-100 text-center'
                      : 'bg-slate-900/80 border-slate-700/50 text-slate-200 text-right'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* İkonlu Input Kutusu */}
            <div className="w-full fixed bottom-6 max-w-md px-4 z-20">
              <div className="relative flex items-center">
                <User className="absolute left-3 text-slate-500" size={18} />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={loading ? 'Düşünüyor...' : 'ask me anything...'}
                  disabled={loading}
                  className="w-full bg-[#0f172a]/90 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 backdrop-blur-md placeholder:text-slate-500 shadow-xl"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="absolute right-3 text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
