"use client";

import { useEffect, useRef } from "react";
import MoveIcon from "./MoveIcon";
import { MoveClassification } from "@/types/chess";

interface Move {
  san: string;
  classification?: MoveClassification;
}

interface MovePair {
  moveNumber: number;
  white: Move;
  black?: Move;
}

interface MoveListProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export default function MoveList({ moves, currentMoveIndex, onMoveClick }: MoveListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (White / Black)
  const movePairs: MovePair[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  // Auto-scroll to current move
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector(".bg-white\\/10");
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentMoveIndex]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[#141416] border border-[#2a2a30] rounded-lg p-2 font-mono text-sm"
    >
      {movePairs.map((pair, idx) => {
        const whiteIdx = idx * 2;
        const blackIdx = whiteIdx + 1;

        return (
          <div
            key={pair.moveNumber}
            className={`flex items-center rounded-md px-2 py-1 ${
              Math.floor(currentMoveIndex / 2) === idx ? "bg-white/5" : ""
            }`}
          >
            <div className="w-10 text-[#6b6b75]">{pair.moveNumber}.</div>

            {/* White Move */}
            <button
              onClick={() => onMoveClick(whiteIdx)}
              className={`flex-1 flex items-center justify-between px-2 py-1 rounded transition-colors ${
                currentMoveIndex === whiteIdx
                  ? "bg-[#81b64c]/20 text-[#81b64c] font-bold"
                  : "text-[#a0a0a8] hover:bg-white/5"
              }`}
            >
              <span>{pair.white.san}</span>
              <MoveIcon classification={pair.white.classification} />
            </button>

            {/* Black Move */}
            <div className="flex-1">
              {pair.black && (
                <button
                  onClick={() => onMoveClick(blackIdx)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors ${
                    currentMoveIndex === blackIdx
                      ? "bg-[#81b64c]/20 text-[#81b64c] font-bold"
                      : "text-[#a0a0a8] hover:bg-white/5"
                  }`}
                >
                  <span>{pair.black.san}</span>
                  <MoveIcon classification={pair.black.classification} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
