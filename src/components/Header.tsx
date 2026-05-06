"use client";

import Link from 'next/link';
import { Keyboard, Trophy, Flame, Menu, X, Star, Zap, BookOpen, Puzzle, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUserStore, getRankFromLevel } from '@/lib/userStore';
import dynamic from 'next/dynamic';

const AchievementsPanel = dynamic(() => import('./AchievementsPanel'), { ssr: false });

export default function Header() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { level, xp, streak, dailyStreak } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate XP progress percentage
  const nextLevelXp = Math.round(Math.pow(level / 1, 1 / 0.7) * 100);
  const currentLevelXp = Math.round(Math.pow((level - 1) / 1, 1 / 0.7) * 100);
  const levelProgress = Math.max(0, Math.min(100, ((xp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100));
  const rank = getRankFromLevel(level);

  return (
    <header 
      className={`w-full border-b bg-[#0a0a0a]/92 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'border-white/[0.06] shadow-lg shadow-black/20' : 'border-white/[0.04]'}`} 
      style={{ height: 'var(--header-h, 56px)' }}
    >
      {/* Subtle gold accent line at very top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.3)] to-transparent" />
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="transition-transform group-hover:scale-105 flex items-center justify-center drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" className="w-7 h-7 md:w-8 md:h-8 fill-[#d4af37] drop-shadow-md">
              <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
              <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base md:text-lg tracking-tight text-white leading-none" style={{ letterSpacing: '-0.01em' }}>
              Underpromotion
            </span>
            <span className="hidden md:block text-[9px] font-medium tracking-tight mt-0.5 uppercase" style={{ color: 'rgba(212,175,55,0.5)', letterSpacing: '0.05em' }}>
              Beyond Evaluation
            </span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <Link href="/analysis" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 font-medium flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Analysis
          </Link>
          <Link href="/learn" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 font-medium flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Learn
          </Link>
          <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 font-medium">
            About
          </Link>
          <Link href="/support" className="text-sm transition-colors px-3 py-1.5 rounded-lg font-semibold" style={{ color: 'rgba(212,175,55,0.8)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#d4af37', e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,175,55,0.8)', e.currentTarget.style.background = 'transparent')}
          >
            ♥ Support
          </Link>
          
          <div className="w-px h-5 bg-white/10 mx-2" />
          
          {mounted && (
            <div className="flex items-center gap-2">
              {/* Level & XP Badge */}
              <div className="flex items-center gap-0 bg-white/[0.03] rounded-lg border border-white/[0.05] overflow-hidden">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-r border-white/[0.06]">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center border" style={{ background: 'rgba(212,175,55,0.15)', borderColor: 'rgba(212,175,55,0.25)' }}>
                    <Zap className="w-3 h-3" style={{ color: '#d4af37' }} />
                  </div>
                  <span className="text-[11px] font-black text-white">Lv.{level}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-r border-white/[0.06]">
                  <Star className="w-3 h-3" style={{ color: 'rgba(212,175,55,0.7)' }} fill="rgba(212,175,55,0.7)" />
                  <span className="text-[10px] font-bold text-gray-400 tabular-nums">{xp}</span>
                  {/* Mini level progress - gold */}
                  <div className="w-12 h-1 bg-white/[0.06] rounded-full overflow-hidden ml-0.5">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${levelProgress}%`, background: 'linear-gradient(to right, #d4af37, #e8c84a)' }} />
                  </div>
                </div>
                {dailyStreak > 0 && (
                  <div className="flex items-center gap-1 px-2.5 py-1.5 text-orange-500/90 border-r border-white/[0.06]">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[11px] font-black">{dailyStreak}</span>
                  </div>
                )}
                
                {/* Rank Badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r ${rank.color} bg-opacity-20`}>
                  <Trophy className="w-3.5 h-3.5 text-white drop-shadow-sm" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider drop-shadow-sm">{rank.name}</span>
                </div>
              </div>

              {/* Achievements */}
              <AchievementsPanel />
            </div>
          )}

          <button 
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-500 hover:text-gray-300 relative ml-1"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {showShortcuts && (
            <>
              <div className="fixed inset-0 z-[90]" onClick={() => setShowShortcuts(false)} />
              <div className="absolute right-4 top-14 z-[100] glass-panel p-4 w-64 scale-in">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Keyboard className="w-3.5 h-3.5 text-blue-500" />
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

        {/* Mobile: Stats + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <div className="flex items-center gap-1.5 bg-white/[0.03] px-2 py-1 rounded-md border border-white/[0.05] text-[10px]">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="font-bold text-gray-300">Lv{level}</span>
              {dailyStreak > 0 && (
                <>
                  <Flame className="w-3 h-3 text-orange-500 fill-current" />
                  <span className="font-bold text-orange-400">{dailyStreak}</span>
                </>
              )}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0b0e]/98 backdrop-blur-xl border-b border-white/[0.04] slide-up z-40">
          <div className="flex flex-col p-4 gap-1">
            <Link href="/analysis" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors font-medium">
              Analysis
            </Link>
            <Link href="/learn" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors font-medium">
              Learn Chess
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors font-medium">
              About
            </Link>
            <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors font-medium">
              Support
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-300 hover:text-white py-3 px-4 rounded-lg hover:bg-white/5 transition-colors font-medium">
              Contact
            </Link>
            <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-1">
              <Link href="/privacy" onClick={() => setMobileMenuOpen(false)} className="text-xs text-gray-500 hover:text-white py-2 px-4 rounded-lg hover:bg-white/5 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" onClick={() => setMobileMenuOpen(false)} className="text-xs text-gray-500 hover:text-white py-2 px-4 rounded-lg hover:bg-white/5 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
