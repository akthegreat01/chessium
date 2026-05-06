"use client";

import React from 'react';
import HeroSection from './landing/HeroSection';
import AnalyzerPreview from './landing/AnalyzerPreview';
import WhatIsSection from './landing/WhatIsSection';
import ArticlesSection from './landing/ArticlesSection';
import PuzzleSection from './landing/PuzzleSection';
import ChessFactsSection from './landing/ChessFactsSection';
import LeaderboardSection from './landing/LeaderboardSection';
import FAQSection from './landing/FAQSection';
import CTASection from './landing/CTASection';

export default function LandingPage() {
  return (
    <div className="relative w-full overflow-hidden bg-[#050505]">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37] opacity-[0.03] blur-[80px] animate-blob" style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }} />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600 opacity-[0.03] blur-[80px] animate-blob animation-delay-2000" style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-[45%] h-[45%] rounded-full bg-purple-600 opacity-[0.02] blur-[80px] animate-blob animation-delay-4000" style={{ willChange: 'transform', transform: 'translate3d(0,0,0)' }} />
      </div>

      <div className="relative z-10">
        <HeroSection />
        <AnalyzerPreview />
        <WhatIsSection />
        <ArticlesSection />
        <PuzzleSection />
        <ChessFactsSection />
        <LeaderboardSection />
        <FAQSection />
        <CTASection />
      </div>
    </div>
  );
}
