"use client";

import { useState } from 'react';
import { useChessStore, BOT_PERSONALITIES, BotPersonality } from '@/lib/chessStore';
import { X, User, Crown, MonitorPlay, Zap, ArrowRight, Activity, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PawnIcon = ({ color }: { color: 'white' | 'black' }) => (
  <svg viewBox="0 0 45 45" className="w-10 h-10 drop-shadow-lg">
    <path
      d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      fill={color === 'white' ? '#f9f9f9' : '#1f1f1f'}
      stroke={color === 'white' ? '#444' : '#000'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function PlayBotModal({ onClose }: { onClose: () => void }) {
  const { startAIGame } = useChessStore();
  const [selectedBot, setSelectedBot] = useState<BotPersonality>(BOT_PERSONALITIES[3]);
  const [color, setColor] = useState<'w' | 'b'>('w');

  const handleStart = () => {
    startAIGame(selectedBot, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto md:overflow-visible"
      >
        {/* Left Sidebar: Select Bot */}
        <div className="w-full md:w-[45%] bg-black/40 border-r border-white/5 flex flex-col md:max-h-[80vh]">
          <div className="p-4 border-b border-white/5 flex items-center gap-2 sticky top-0 bg-[#08090a] z-10">
            <MonitorPlay className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-white text-lg">Choose Opponent</h2>
          </div>
          
          <div className="flex-1 md:overflow-y-auto custom-scrollbar p-2 space-y-1">
            {BOT_PERSONALITIES.map(bot => (
              <button
                key={bot.id}
                onClick={() => setSelectedBot(bot)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  selectedBot.id === bot.id 
                    ? 'bg-blue-500/20 border border-blue-500/40 shadow-inner' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="text-3xl filter drop-shadow-md">{bot.avatar}</div>
                <div className="flex flex-col">
                  <span className={`font-bold ${selectedBot.id === bot.id ? 'text-blue-400' : 'text-gray-200'}`}>
                    {bot.name}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">ELO {bot.elo}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content: Bot Details & Start */}
        <div className="flex-1 p-4 md:p-8 flex flex-col relative">
          <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors z-20">
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center mt-4 md:mt-8 mb-4 md:mb-6">
            <div className="text-6xl md:text-8xl filter drop-shadow-2xl mb-2 md:mb-4 animate-bounce-slow">
              {selectedBot.avatar}
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{selectedBot.name}</h3>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-gray-300">{selectedBot.elo} ELO</span>
            </div>
          </div>

          <p className="text-gray-400 text-center max-w-md mx-auto mb-6 md:mb-8 text-sm md:text-lg italic px-4">
            "{selectedBot.description}"
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full mb-8">
            <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/5">
              <div className={`p-2 rounded-lg ${
                selectedBot.style === 'aggressive' ? 'bg-red-500/20 text-red-400' :
                selectedBot.style === 'positional' ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {selectedBot.style === 'aggressive' ? <Zap className="w-4 h-4" /> :
                 selectedBot.style === 'positional' ? <ShieldAlert className="w-4 h-4" /> :
                 <Activity className="w-4 h-4" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Playstyle</span>
                <span className="text-sm font-semibold text-gray-200 capitalize">{selectedBot.style}</span>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setColor('w')}
                className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all ${
                  color === 'w' ? 'border-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-300 rounded flex items-center justify-center shadow-lg mb-2 border border-white/20">
                  <PawnIcon color="white" />
                </div>
                <span className="text-xs font-bold text-gray-300">Play White</span>
              </button>
              <button
                onClick={() => setColor('b')}
                className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 transition-all ${
                  color === 'b' ? 'border-gray-500 bg-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)]' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center shadow-lg mb-2 border border-white/10">
                  <PawnIcon color="black" />
                </div>
                <span className="text-xs font-bold text-gray-300">Play Black</span>
              </button>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xl rounded-xl shadow-[0_6px_0_#1d4ed8] active:translate-y-[6px] active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              Choose {selectedBot.name} <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
