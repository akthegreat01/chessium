import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, LineChart } from "lucide-react";

export default function PlayMenuPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Training Mode</h1>
        <p className="text-xl text-secondary-foreground font-medium">Practice and analyze with Stockfish.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/play/ai" className="group flex flex-col items-center text-center h-64 p-8 rounded-[32px] bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.25)] relative overflow-hidden">
          <Bot className="w-16 h-16 mb-4 opacity-90" />
          <h2 className="text-3xl font-bold tracking-tight mb-2">Play vs AI</h2>
          <p className="text-primary-foreground/80 font-medium">Practice against Stockfish 16.1</p>
        </Link>
        
        <Link href="/analyze" className="group flex flex-col items-center text-center h-64 p-8 rounded-[32px] bg-surface border border-white/5 hover:bg-surface/80 transition-all shadow-xl shadow-black/20">
          <LineChart className="w-16 h-16 mb-4 text-secondary-foreground group-hover:text-foreground transition-colors" />
          <h2 className="text-3xl font-bold tracking-tight mb-2">Analyze Game</h2>
          <p className="text-secondary-foreground font-medium">Deep analysis & accuracy calculation</p>
        </Link>
      </div>
    </div>
  );
}
