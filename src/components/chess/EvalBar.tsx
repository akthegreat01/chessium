"use client";

interface EvalBarProps {
  centipawns: number | null;
  mateIn: number | null;
  orientation?: "white" | "black";
}

export default function EvalBar({ centipawns, mateIn, orientation = "white" }: EvalBarProps) {
  let whitePercent: number;
  let displayText: string;

  if (mateIn !== null) {
    whitePercent = mateIn > 0 ? 100 : 0;
    displayText = `M${Math.abs(mateIn)}`;
  } else {
    const cp = centipawns ?? 0;
    whitePercent = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);
    displayText = (cp >= 0 ? "+" : "") + (cp / 100).toFixed(1);
  }

  const isFlipped = orientation === "black";

  return (
    <div className="relative w-8 h-full rounded-xl overflow-hidden border border-[#2a2a30] bg-zinc-800 flex flex-col justify-end shadow-inner">
      {/* Black section is the background */}
      
      {/* White section */}
      <div
        className="absolute w-full bg-white transition-all duration-300 ease-in-out"
        style={{
          height: `${isFlipped ? 100 - whitePercent : whitePercent}%`,
          bottom: isFlipped ? "auto" : 0,
          top: isFlipped ? 0 : "auto",
        }}
      />
      
      {/* Score label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className={`text-[10px] font-bold z-10 ${
            whitePercent > 50 ? "text-zinc-800" : "text-white"
          }`}
          style={{
            transform: isFlipped ? "rotate(180deg)" : "none",
          }}
        >
          {displayText}
        </span>
      </div>
    </div>
  );
}
