"use client";

import React, { useState } from "react";

export default function CyberProfilePage() {
  const [activeTab, setActiveTab] = useState<"chat" | "links" | "gift">("chat");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages((prev) => [...prev, inputMsg]);
    setInputMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-blue-100 flex flex-col items-center justify-between p-4 font-mono relative overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Arka plan siber ızgara deseni */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
          backgroundSize: '20px 20px, 40px 40px, 40px 40px'
        }}
      />

      <div className="w-full max-w-md flex flex-col items-center z-10 space-y-6 pt-4">
        {/* Üst Sekme Menüsü */}
        <nav className="w-full bg-blue-950/40 backdrop-blur-md border border-blue-800/40 rounded-sm p-1 flex justify-between shadow-lg shadow-blue-950/50">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 text-center text-sm transition-all rounded-sm ${
              activeTab === "chat"
                ? "bg-blue-600/30 text-white font-bold border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-blue-300/60 hover:text-blue-200"
            }`}
          >
            chat
          </button>
          <button
            onClick={() => setActiveTab("links")}
            className={`flex-1 py-2 text-center text-sm transition-all rounded-sm ${
              activeTab === "links"
                ? "bg-blue-600/30 text-white font-bold border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-blue-300/60 hover:text-blue-200"
            }`}
          >
            links
          </button>
          <button
            onClick={() => setActiveTab("gift")}
            className={`flex-1 py-2 text-center text-sm transition-all rounded-sm ${
              activeTab === "gift"
                ? "bg-blue-600/30 text-white font-bold border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                : "text-blue-300/60 hover:text-blue-200"
            }`}
          >
            gift
          </button>
        </nav>

        {/* Profil Alanı */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-blue-500 rounded-sm blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
            <img
              src="https://via.placeholder.com/150" 
              alt="Avatar"
              className="relative w-32 h-32 object-cover rounded-sm border border-blue-500/40 shadow-inner"
            />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-white">MAMİ</h1>
        </div>

        {/* Sekme İçerikleri */}
        {activeTab === "chat" && (
          <div className="w-full space-y-4">
            {/* Karşılama Kartı */}
            <div className="w-full bg-blue-950/30 border border-blue-800/40 p-4 rounded-sm text-center shadow-lg backdrop-blur-sm">
              <p className="text-sm text-blue-200 leading-relaxed">
                Im Mami. Ask me anything!
              </p>
            </div>

            {/* Gönderilen Mesajlar Listesi */}
            <div className="w-full space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-blue-900/20 border border-blue-800/30 p-2.5 rounded-sm text-xs text-blue-100 break-words"
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="w-full space-y-2">
            <a href="#" className="block w-full bg-blue-950/30 border border-blue-800/40 p-3 rounded-sm text-center text-xs hover:bg-blue-900/40 transition">
              Twitter / X
            </a>
            <a href="#" className="block w-full bg-blue-950/30 border border-blue-800/40 p-3 rounded-sm text-center text-xs hover:bg-blue-900/40 transition">
              GitHub
            </a>
          </div>
        )}

        {activeTab === "gift" && (
          <div className="w-full bg-blue-950/30 border border-blue-800/40 p-4 rounded-sm text-center text-xs">
            Send support or gifts via crypto address.
          </div>
        )}
      </div>

      {/* Alt Chat Girdisi */}
      {activeTab === "chat" && (
        <form onSubmit={handleSend} className="w-full max-w-md z-10 my-4">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="ask me anything..."
            className="w-full bg-blue-950/20 border border-blue-900/60 rounded-sm px-4 py-3 text-sm text-blue-100 placeholder-blue-400/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 backdrop-blur-md transition-all"
          />
        </form>
      )}
    </div>
  );
              }

