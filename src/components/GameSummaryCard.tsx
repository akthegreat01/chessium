"use client";

import { useRef, useState } from 'react';
import { useChessStore } from '@/lib/chessStore';
import { Download, Share2, X, Trophy, Target, Zap, Star } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameSummaryCard({ onClose }: { onClose: () => void }) {
  const { analysisResult, history, game } = useChessStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  if (!analysisResult) return null;

  const downloadImage = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, quality: 1.0 });
      const link = document.createElement('a');
      link.download = `chessium-review-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setLoading(false);
    }
  };

  const headers = game.header();
  const whitePlayer = headers.White || 'White';
  const blackPlayer = headers.Black || 'Black';
  const result = headers.Result || '*';

  const stats = [
    { label: 'Brilliant', value: analysisResult.counts.brilliant, color: 'text-[#1cb0f6]', icon: Zap },
    { label: 'Great', value: analysisResult.counts.great, color: 'text-[#5c8bb0]', icon: Star },
    { label: 'Best', value: analysisResult.counts.best, color: 'text-[#81b64c]', icon: Trophy },
    { label: 'Blunders', value: analysisResult.counts.blunder, color: 'text-[#fa412d]', icon: Target },
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative flex flex-col gap-4 max-w-lg w-full"
      >
        {/* The Card to Capture */}
        <div 
          ref={cardRef}
          className="bg-[#0f1013] rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-8 flex flex-col gap-8 relative"
          style={{ width: '100%', aspectRatio: '4/5' }}
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />

          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-black">C</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Chessium</h1>
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Game Review Summary</p>
          </div>

          {/* Players & Score */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white/[0.03] rounded-2xl p-4 border border-white/5">
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-black text-white truncate w-32 text-center uppercase tracking-tight">{whitePlayer}</span>
                <span className="text-[9px] text-gray-500 font-bold">WHITE</span>
              </div>
              <div className="px-4 flex flex-col items-center">
                 <div className="text-xl font-black text-white bg-white/10 px-3 py-1 rounded-lg border border-white/10">{result}</div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-xs font-black text-white truncate w-32 text-center uppercase tracking-tight">{blackPlayer}</span>
                <span className="text-[9px] text-gray-500 font-bold">BLACK</span>
              </div>
            </div>
          </div>

          {/* Accuracy Ring */}
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64" cy="64" r="58"
                  fill="none" stroke="currentColor"
                  strokeWidth="8" className="text-white/5"
                />
                <circle
                  cx="64" cy="64" r="58"
                  fill="none" stroke="currentColor"
                  strokeWidth="8" strokeDasharray={364}
                  strokeDashoffset={364 - (364 * analysisResult.accuracy) / 100}
                  strokeLinecap="round"
                  className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{analysisResult.accuracy}%</span>
                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Accuracy</span>
              </div>
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/5 flex items-center gap-3">
                <div className={`p-1.5 rounded-lg bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</span>
                  <span className="text-sm font-black text-white">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/5">
             <p className="text-[10px] text-gray-600 font-medium">Analyzed at <span className="text-white">chessium.ai</span></p>
          </div>
        </div>

        {/* Action Buttons (Not Captured) */}
        <div className="flex gap-3">
          <button 
            onClick={downloadImage}
            disabled={loading}
            className="flex-1 bg-white text-black h-12 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
            Save Card
          </button>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center border border-white/10 transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
