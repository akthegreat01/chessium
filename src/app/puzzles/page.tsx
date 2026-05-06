import { Metadata } from 'next';
import PuzzleSection from '@/components/landing/PuzzleSection';
import Link from 'next/link';
import { ArrowLeft, Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chess Puzzles — Underpromotion',
  description: 'Sharpen your tactical vision with our curated daily chess puzzles. Find brilliant moves, devastating sacrifices, and underpromotions.',
};

export default function PuzzlesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-12 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#d4af37] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
        
        {/* We reuse the awesome PuzzleSection component here */}
        <div className="-mt-16">
          <PuzzleSection />
        </div>

        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.05] text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-white font-bold mb-2">Tactical Vision</h3>
            <p className="text-gray-400 text-sm">Puzzles train your brain to recognize complex patterns instantly during live games.</p>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl border border-white/[0.05] text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔥
            </div>
            <h3 className="text-white font-bold mb-2">Daily Streaks</h3>
            <p className="text-gray-400 text-sm">Consistency is key. Build your streak by solving at least one puzzle correctly every day.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/[0.05] text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              ♞
            </div>
            <h3 className="text-white font-bold mb-2">Underpromotions</h3>
            <p className="text-gray-400 text-sm">Special emphasis on rare tactical motifs that most other puzzle trainers miss.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
