"use client";

import { useState } from "react";
import Board from "@/components/chess/Board";
import MoveList from "@/components/chess/MoveList";
import EvalBar from "@/components/chess/EvalBar";
import EvalGraph from "@/components/chess/EvalGraph";
import EngineLines from "@/components/chess/EngineLines";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";

export default function AnalysisPage() {
  const [pgnInput, setPgnInput] = useState("");
  const { game, position, history, makeMove, loadPgn, turn } = useChessGame();
  
  // Stockfish hook (commented out the actual engine usage for now to prevent unnecessary loading, but the structure is here)
  // const { evaluatePosition, isReady } = useStockfish();

  // Mock engine state for UI
  const [evalData] = useState([{ moveNumber: 0, cp: +30, mate: null }, { moveNumber: 1, cp: +45, mate: null }]);
  const [currentLines] = useState([
    { eval: { cp: 45, mate: null }, moves: ["e4", "e5", "Nf3", "Nc6"], depth: 22 },
    { eval: { cp: 30, mate: null }, moves: ["d4", "Nf6", "c4", "e6"], depth: 22 }
  ]);
  const [isThinking] = useState(false);

  // Derive current move index
  const currentMoveIndex = history.length - 1;

  const handlePgnSubmit = () => {
    if (pgnInput.trim()) {
      loadPgn(pgnInput);
      setPgnInput("");
    }
  };

  const handlePieceDrop = (source: string, target: string, piece: string) => {
    const promotion = piece[1].toLowerCase();
    const move = makeMove({
      from: source,
      to: target,
      promotion: promotion === "p" ? undefined : promotion,
    });
    return move !== null;
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
      {/* Left Column: Board & Graph */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        {/* Board Area */}
        <div className="flex gap-4 max-w-[700px] mx-auto w-full aspect-[1/1] relative">
          <div className="h-full">
            <EvalBar centipawns={evalData[currentMoveIndex]?.cp || 0} mateIn={evalData[currentMoveIndex]?.mate || null} orientation="white" />
          </div>
          <div className="flex-1">
            <Board 
              position={position} 
              onPieceDrop={handlePieceDrop} 
            />
          </div>
        </div>

        {/* Evaluation Graph */}
        <div className="max-w-[700px] mx-auto w-full">
          <EvalGraph 
            data={evalData} 
            currentMoveIndex={currentMoveIndex}
            onMoveClick={() => {}} // TODO: set active move
          />
        </div>
      </div>

      {/* Right Column: Controls, Moves, Engine */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 h-full">
        {/* Game Info / Actions */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4 shrink-0">
          <div className="flex gap-2">
            <input 
              value={pgnInput}
              onChange={(e) => setPgnInput(e.target.value)}
              placeholder="Paste PGN here..."
              className="flex-1 bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none"
            />
            <button 
              onClick={handlePgnSubmit}
              className="bg-[#2a2a30] hover:bg-[#3a3a42] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Load
            </button>
          </div>
        </div>

        {/* Engine Lines */}
        <div className="shrink-0">
          <EngineLines lines={currentLines} isThinking={isThinking} />
        </div>

        {/* Move List */}
        <MoveList 
          moves={history.map(m => ({ san: m.san }))} 
          currentMoveIndex={currentMoveIndex}
          onMoveClick={() => {}}
        />

        {/* Controls */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-2 shrink-0 flex justify-center gap-2">
          <button className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
