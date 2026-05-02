import { Sparkles, Cpu, Zap, Shield, Globe, BarChart3, Target, Heart, ChevronRight, Crown } from 'lucide-react';

export default function AboutPage() {
  const features = [
    { icon: Cpu, title: "Stockfish NNUE", desc: "Powered by the world's strongest open-source chess engine, running entirely in your browser via WebAssembly." },
    { icon: Zap, title: "Instant Analysis", desc: "Sub-second move evaluations with configurable depth. No server round-trips, no waiting." },
    { icon: BarChart3, title: "CAPS Accuracy", desc: "Professional accuracy scoring using the same centipawn loss model trusted by Chess.com." },
    { icon: Shield, title: "100% Private", desc: "All computation happens locally. Your games never leave your device. Zero tracking." },
    { icon: Globe, title: "Import Anywhere", desc: "Fetch games directly from Chess.com or Lichess, or paste any PGN/FEN string." },
    { icon: Sparkles, title: "Smart Classification", desc: "Every move is classified as Brilliant, Best, Mistake, or Blunder with on-board iconography." },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 text-center overflow-hidden">
        {/* Gold ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.06) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto mt-8 flex flex-col items-center">
          {/* Creator Badge */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-10 rounded-full" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.6))' }} />
            <span className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: '#d4af37', textShadow: '0 0 20px rgba(212,175,55,0.3)' }}>
              Built by Akshath Kataria
            </span>
            <div className="h-px w-10 rounded-full" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.6))' }} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase text-xs font-black" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37', boxShadow: '0 0 20px rgba(212,175,55,0.1)' }}>
            <Crown className="w-3.5 h-3.5" />
            Chessium
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight leading-tight drop-shadow-2xl" style={{ letterSpacing: '-0.02em' }}>
            Not always the{' '}
            <span style={{ background: 'linear-gradient(135deg, #e8c84a 0%, #d4af37 40%, #b8962e 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              obvious move
            </span>
            <br className="hidden md:block" />
            is the best.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Chessium is a professional-grade, locally-computed analysis platform. By combining the raw power of Stockfish 16.1 WebAssembly with an uncompromising, distraction-free aesthetic, it brings absolute clarity to the beautiful game.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-10 md:gap-20 mb-16">
            {[
              { value: "3600+", label: "ELO Strength" },
              { value: "0ms", label: "Server Latency" },
              { value: "∞", label: "Games Analyzed" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1.5">
                <span className="text-3xl md:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>{stat.value}</span>
                <span className="text-xs uppercase tracking-widest font-bold" style={{ color: 'rgba(212,175,55,0.5)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20 w-full relative z-10">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-center mb-8" style={{ color: 'rgba(212,175,55,0.4)' }}>What Makes Chessium Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-panel p-6 rounded-2xl group transition-all duration-300" style={{ cursor: 'default' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-all group-hover:scale-110" style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.2)' }}>
                <f.icon className="w-6 h-6" style={{ color: '#d4af37' }} />
              </div>
              <h3 className="font-black text-white text-base mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Card */}
      <div className="max-w-4xl mx-auto px-4 pb-20 w-full relative z-10">
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.12)', boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 40px rgba(212,175,55,0.04)' }}>
          {/* Gold shimmer bg */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.03) 0%, transparent 60%)' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border" style={{ background: 'rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.2)', boxShadow: '0 0 30px rgba(212,175,55,0.1)' }}>
              ♟
            </div>
            <div className="flex-1">
              <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'rgba(212,175,55,0.5)' }}>Created by</div>
              <h3 className="text-2xl font-black text-white mb-2" style={{ letterSpacing: '-0.01em' }}>Akshath Kataria</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-lg">
                Passionate chess player and developer dedicated to making grandmaster-level analysis accessible to everyone. Built Chessium to bridge the gap between raw engine power and beautiful, intuitive design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-32 w-full relative z-10 text-center">
        <div className="glass-panel p-10 rounded-3xl relative overflow-hidden group">
          <div className="absolute inset-0 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%)', opacity: 0 }} />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4 relative z-10" style={{ letterSpacing: '-0.01em' }}>Help Keep Chessium Free</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10 font-medium leading-relaxed">
            Developing and maintaining a high-performance chess engine is a labor of love. 
            If you find value in Chessium, consider supporting its continued growth.
          </p>
          <a 
            href="/support"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl relative z-10"
            style={{ background: 'linear-gradient(135deg, #d4af37 0%, #b8962e 100%)', color: '#0a0a0a', boxShadow: '0 4px 24px rgba(212,175,55,0.35)' }}
          >
            <Heart className="w-4 h-4 fill-current" />
            Support Project
          </a>
        </div>
      </div>
    </div>
  );
}
