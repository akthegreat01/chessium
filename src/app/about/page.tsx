import { Sparkles, Cpu, Zap, Shield, Globe, BarChart3, Hexagon, Target, Crown } from 'lucide-react';

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
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/[0.1] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/[0.08] blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto mt-8 flex flex-col items-center">
          {/* Creator Badge - First thing users see */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500/50" />
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase tracking-[0.3em]">
              Built by Akshath Kataria
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-blue-500/50" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black mb-8 tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Hexagon className="w-3.5 h-3.5" />
            Underpromotion
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight leading-tight drop-shadow-2xl">
            Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Human Intuition</span><br className="hidden md:block" />
            Meets Engine Perfection
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Underpromotion is a professional-grade, locally-computed analysis platform. By combining the raw power of Stockfish 16.1 WebAssembly with an uncompromising, distraction-free aesthetic, it brings absolute clarity to the beautiful game.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-16">
            {[
              { value: "3600+", label: "ELO Strength" },
              { value: "0ms", label: "Server Latency" },
              { value: "∞", label: "Games Analyzed" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-gray-500 tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-20 w-full relative z-10">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] text-center mb-8">What Makes Underpromotion Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-panel p-6 rounded-2xl group hover:border-blue-500/30 hover:bg-white/5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:border-blue-500/40 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all">
                <f.icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
