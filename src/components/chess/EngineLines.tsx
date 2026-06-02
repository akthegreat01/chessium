"use client";

interface EngineLine {
  eval: {
    cp: number | null;
    mate: number | null;
  };
  moves: string[]; // array of SAN or UCI
  depth?: number;
}

interface EngineLinesProps {
  lines: EngineLine[];
  isThinking?: boolean;
}

export default function EngineLines({ lines, isThinking = false }: EngineLinesProps) {
  if (lines.length === 0) {
    return (
      <div className="bg-[#141416] border border-[#2a2a30] rounded-lg p-4 font-mono text-sm h-32 flex items-center justify-center text-[#6b6b75]">
        {isThinking ? "Engine is thinking..." : "No engine lines available"}
      </div>
    );
  }

  return (
    <div className="bg-[#141416] border border-[#2a2a30] rounded-lg p-3 font-mono text-sm overflow-hidden flex flex-col gap-2 relative">
      {isThinking && (
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#81b64c] animate-pulse-glow" />
          <span className="text-xs text-[#6b6b75]">Calculating</span>
        </div>
      )}

      {lines.map((line, idx) => {
        let scoreStr = "";
        if (line.eval.mate !== null) {
          scoreStr = `M${Math.abs(line.eval.mate)}`;
        } else {
          const cp = line.eval.cp ?? 0;
          scoreStr = (cp > 0 ? "+" : "") + (cp / 100).toFixed(2);
        }

        return (
          <div key={idx} className="flex gap-3 text-sm group">
            <div className={`w-12 font-bold flex-shrink-0 text-right ${
              line.eval.mate !== null || (line.eval.cp && line.eval.cp > 0)
                ? "text-white"
                : "text-[#a0a0a8]"
            }`}>
              {scoreStr}
            </div>
            
            <div className="flex-1 text-[#a0a0a8] truncate hover:text-white transition-colors cursor-default" title={line.moves.join(" ")}>
              {line.depth && <span className="text-[#6b6b75] mr-2">d{line.depth}</span>}
              {line.moves.map((move, i) => (
                <span key={i} className="mr-1.5 inline-block">
                  {move}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
