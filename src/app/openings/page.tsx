import { Metadata } from 'next';
import { OPENINGS } from '@/lib/openings';
import Link from 'next/link';
import { Book, Play, ArrowRight } from 'lucide-react';
import ArticleBoard from '@/components/ArticleBoard';

export const metadata: Metadata = {
  title: 'Chess Openings Explorer — Underpromotion',
  description: 'Explore and learn the most popular chess openings, from the Sicilian Defense to the Queen\'s Gambit. Master the first phase of the game.',
};

export default function OpeningsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
            <Book className="w-3 h-3" /> Opening Explorer
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
            Master the <span className="text-gradient-gold">Openings</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            The opening sets the tone for the entire game. Browse through the most essential openings, learn their ideas, and analyze the resulting positions.
          </p>
        </div>

        {/* Grid of Openings */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {OPENINGS.map((opening) => (
            <div key={opening.name} className="glass-panel p-6 rounded-2xl border border-white/[0.05] group hover:border-[#d4af37]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors">{opening.name}</h2>
                  <p className="text-sm font-mono text-gray-500 mt-1">{opening.pgn}</p>
                </div>
              </div>
              
              <div className="pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                <ArticleBoard fen={opening.fen} />
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Link href={`/analysis?fen=${encodeURIComponent(opening.fen)}`} className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 hover:text-white transition-colors">
                  <Play className="w-4 h-4" /> Analyze
                </Link>
                <Link href="/learn" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                  Learn More <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center p-12 rounded-3xl bg-gradient-to-br from-[#d4af37]/10 to-transparent border border-[#d4af37]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#d4af37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-3xl font-black text-white mb-4 relative z-10">Test Your Prep</h3>
          <p className="text-gray-400 text-lg mb-8 relative z-10 max-w-xl mx-auto">
            Take your opening repertoire to the next level by playing against our Grandmaster-strength Stockfish engine.
          </p>
          <Link href="/analysis" className="btn-primary px-8 py-4 rounded-xl text-sm uppercase tracking-[0.15em] font-black inline-flex items-center gap-2 relative z-10 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            Start Playing <Play className="w-4 h-4 fill-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
