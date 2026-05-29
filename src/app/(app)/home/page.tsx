import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot, LineChart, Puzzle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="p-8 md:p-16 max-w-6xl mx-auto space-y-16">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Training Overview</h1>
        <div className="flex gap-8 text-secondary-foreground font-medium text-lg">
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-wider text-secondary-foreground/60 mb-1">AI Rating</span>
            <span className="text-foreground text-2xl">1400</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-wider text-secondary-foreground/60 mb-1">Puzzle Rating</span>
            <span className="text-foreground text-2xl">1850</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm uppercase tracking-wider text-secondary-foreground/60 mb-1">Accuracy Avg</span>
            <span className="text-foreground text-2xl">84.2%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/play/ai" className="group flex flex-col justify-between h-48 p-6 rounded-[24px] bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgba(212,175,55,0.15)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.25)] relative overflow-hidden">
          <Bot className="w-8 h-8 opacity-80" />
          <div className="text-2xl font-semibold tracking-tight">Play vs AI</div>
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10">
            <Bot className="w-48 h-48" />
          </div>
        </Link>
        
        <Link href="/analyze" className="group flex flex-col justify-between h-48 p-6 rounded-[24px] bg-surface border border-white/5 hover:bg-surface/80 transition-all shadow-sm">
          <LineChart className="w-8 h-8 text-primary opacity-80" />
          <div className="text-2xl font-semibold tracking-tight">Analyze Game</div>
        </Link>
        
        <Link href="/puzzles" className="group flex flex-col justify-between h-48 p-6 rounded-[24px] bg-surface border border-white/5 hover:bg-surface/80 transition-all shadow-sm">
          <Puzzle className="w-8 h-8 text-primary opacity-80" />
          <div className="text-2xl font-semibold tracking-tight">Puzzles</div>
        </Link>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Daily Challenge</h2>
        <div className="bg-surface border border-white/5 rounded-[32px] p-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
          <div className="w-full md:w-56 aspect-square bg-background/50 rounded-2xl flex items-center justify-center text-secondary-foreground border border-white/5">
            <span className="font-mono text-sm opacity-50">[Board]</span>
          </div>
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Daily Puzzle
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Tactical Strike</h3>
            <p className="text-secondary-foreground text-lg max-w-md">
              White to move and win material. Test your tactical vision.
            </p>
            <Button size="lg" className="rounded-full mt-4 bg-foreground text-background hover:bg-foreground/90 font-medium px-8">
              Solve Now
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-6 pb-20">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Analyses</h2>
        <div className="space-y-4">
          <AnalysisRow opponent="Stockfish Level 4" opening="Ruy Lopez" accuracy="88.2%" time="2h ago" />
          <AnalysisRow opponent="Stockfish Level 3" opening="Sicilian Defense" accuracy="92.1%" time="1d ago" />
          <AnalysisRow opponent="Imported PGN" opening="Queen's Gambit" accuracy="76.4%" time="3d ago" />
        </div>
      </section>
    </div>
  );
}

function AnalysisRow({ opponent, opening, accuracy, time }: { opponent: string, opening: string, accuracy: string, time: string }) {
  const accNum = parseFloat(accuracy);
  const accColor = accNum > 90 ? "text-success" : accNum > 80 ? "text-primary" : "text-warning";
  
  return (
    <div className="flex items-center justify-between p-6 rounded-[24px] bg-surface border border-white/5 hover:bg-surface/80 transition-colors shadow-sm">
      <div className="flex items-center gap-6">
        <div className={`font-bold w-16 text-xl tracking-tight ${accColor}`}>{accuracy}</div>
        <div>
          <div className="font-semibold text-lg">{opponent}</div>
          <div className="text-sm text-secondary-foreground font-medium">{opening}</div>
        </div>
      </div>
      <div className="text-sm text-secondary-foreground font-medium">
        {time}
      </div>
    </div>
  );
}
