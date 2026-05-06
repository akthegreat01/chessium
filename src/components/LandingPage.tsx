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
  );
}
