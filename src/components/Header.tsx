"use client";

import Link from 'next/link';
import { Keyboard, Trophy, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/userStore';

export default function Header() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { level, xp, streak } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="w-full border-b border-white/[0.04] bg-[#0a0b0e]/90 backdrop-blur-xl sticky top-0 z-50" style={{ height: 'var(--header-h, 56px)' }}>
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/30 transition-all group-hover:scale-105 flex items-center justify-center w-8 h-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" className="w-5 h-5 fill-white">
              <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
              <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg tracking-tight text-white leading-none">
              Chessium
            </span>
            <span className="hidden md:block text-[9px] text-gray-400 font-medium tracking-tight mt-1 opacity-70 uppercase">
              The best move is not always obvious
            </span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-1">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            Analysis
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            About
          </Link>
          <Link href="/support" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            Support
          </Link>
          
          <div className="w-px h-5 bg-white/10 mx-2" />
          
          {mounted && (
            <div className="flex items-center gap-2 mr-3 group cursor-default">
              <div className="flex items-center gap-2 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.05] hover:bg-white/[0.06] transition-colors">
                <div className="flex items-center gap-1.5 border-r border-white/10 pr-2 mr-0.5">
                  <Trophy className="w-3 h-3 text-yellow-500/80" />
                  <span className="text-[11px] font-bold text-gray-300">Level {level}</span>
                </div>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{xp} XP</span>
                {streak > 0 && (
                  <div className="flex items-center gap-1 ml-1 pl-2 border-l border-white/10 text-orange-500/90">
                    <Flame className="w-3 h-3 fill-current" />
                    <span className="text-[11px] font-bold">{streak}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-gray-300 relative"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {showShortcuts && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setShowShortcuts(false)} />
              <div className="absolute right-4 top-14 z-[100] glass-panel p-4 w-64 slide-up">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-green-500" />
                  Shortcuts
                </h3>
                <div className="flex flex-col gap-2 text-xs">
                  {[
                    ['←  →', 'Navigate moves'],
                    ['Home / End', 'First / Last move'],
                    ['F', 'Flip board'],
                    ['S', 'Toggle sound'],
                    ['H', 'Show hint'],
                  ].map(([key, desc]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-400">{desc}</span>
                      <kbd className="bg-white/5 border border-white/10 text-gray-300 px-1.5 py-0.5 rounded text-[10px] font-mono">{key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
