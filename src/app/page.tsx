"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useChessStore } from "@/lib/chessStore";
import { RotateCw, Copy, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCcw, Check, Undo2 } from 'lucide-react';
import PlayerBar from "@/components/PlayerBar";

const Chessboard = dynamic(() => import("@/components/Chessboard"), { ssr: false });
const EvaluationBar = dynamic(() => import("@/components/EvaluationBar"), { ssr: false });
const MoveList = dynamic(() => import("@/components/MoveList"), { ssr: false });
const GameImport = dynamic(() => import("@/components/GameImport"), { ssr: false });
const GameReview = dynamic(() => import("@/components/GameReview"), { ssr: false });
const SettingsPanel = dynamic(() => import("@/components/SettingsPanel"), { ssr: false });
const GameHistoryPanel = dynamic(() => import("@/components/GameHistoryPanel"), { ssr: false });
const TrainMistakesLauncher = dynamic(() => import("@/components/TrainMistakesLauncher"), { ssr: false });
const SidebarAd = dynamic(() => import("@/components/SidebarAd"), { ssr: false });

export default function Home() {
  const {
    loadSavedGames, goBack, goForward, goToMove, resetGame,
    history, flipBoard, toggleSound, fen, game,
    showHintMove, hideHint, showHint, currentMoveIndex, boardFlipped,
    analysisResult, restoreMainLine, mainLineHistory,
  } = useChessStore();

  const [fenCopied, setFenCopied] = useState(false);

  useEffect(() => {
    loadSavedGames();
  }, [loadSavedGames]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); goBack(); break;
        case "ArrowRight": e.preventDefault(); goForward(); break;
        case "Home": e.preventDefault(); goToMove(-1); break;
        case "End": e.preventDefault(); goToMove(history.length - 1); break;
        case "f": case "F": flipBoard(); break;
        case "s": case "S": toggleSound(); break;
        case "h": case "H": showHint ? hideHint() : showHintMove(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goBack, goForward, goToMove, flipBoard, toggleSound, showHintMove, hideHint, showHint, history.length]);

  const copyFen = () => {
    navigator.clipboard.writeText(fen);
    setFenCopied(true);
    setTimeout(() => setFenCopied(false), 1500);
  };

  const downloadPgn = () => {
    const blob = new Blob([game.pgn()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `chessium_${Date.now()}.pgn`; a.click();
    URL.revokeObjectURL(url);
  };

  const topColor = boardFlipped ? 'w' : 'b';
  const bottomColor = boardFlipped ? 'b' : 'w';

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 p-2 md:p-4 max-w-[1780px] mx-auto w-full lg:h-[calc(100vh-56px)] overflow-y-auto lg:overflow-visible">
      
      {/* Left Ad Sidebar - Only on large screens */}
      <div className="hidden 2xl:block">
        <SidebarAd side="left" />
      </div>

      {/* Center: Board Column */}
      <div className="flex flex-col shrink-0 w-full lg:w-auto justify-center" style={{ maxWidth: 'min(100%, calc(100vh - 240px), 720px)' }}>
        {/* Top Player */}
        <PlayerBar color={topColor} />

        {/* Board row: eval bar + board */}
        <div className="flex gap-2 my-1">
          <div className="hidden md:block shrink-0">
            <EvaluationBar />
          </div>
          <div className="board-container flex-1 aspect-square">
            <Chessboard />
          </div>
        </div>

        {/* Bottom Player */}
        <PlayerBar color={bottomColor} />

        {/* Board toolbar */}
        <div className="flex items-center justify-between mt-1 px-0.5">
          <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.05]">
            <button onClick={() => goToMove(-1)} disabled={currentMoveIndex === -1}
              className="p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95" title="First (Home)">
              <ChevronsLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button onClick={goBack} disabled={currentMoveIndex === -1}
              className="p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95" title="Back (←)">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button onClick={goForward} disabled={currentMoveIndex === history.length - 1}
              className="p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95" title="Forward (→)">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button onClick={() => goToMove(history.length - 1)} disabled={currentMoveIndex === history.length - 1}
              className="p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95" title="Last (End)">
              <ChevronsRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.05]">
            {mainLineHistory && (
              <button onClick={restoreMainLine}
                className="p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group" title="Restore Main Line">
                <Undo2 className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              </button>
            )}
            <button onClick={flipBoard}
              className="p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group" title="Flip Board (F)">
              <RotateCw className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button onClick={copyFen}
              className="p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group" title="Copy FEN">
              {fenCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />}
            </button>
            <button onClick={downloadPgn}
              className="p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group" title="Download PGN">
              <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <button onClick={resetGame}
              className="p-2 rounded-md hover:bg-white/10 transition-all active:scale-95 group" title="New Game">
              <RefreshCcw className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <div className="w-px h-5 bg-white/[0.08] mx-0.5" />
            <SettingsPanel />
          </div>
        </div>
      </div>

      {/* Right: Side Panel */}
      <div className="flex-none w-full lg:w-[420px] lg:max-w-[420px] lg:overflow-y-auto custom-scrollbar flex flex-col gap-3 pb-4">
        {history.length === 0 ? (
          <>
            <div className="glass-panel p-5 slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-sm">
                  <span className="text-blue-500 text-lg">♛</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Engine Insights</h2>
                  <p className="text-[10px] text-gray-500 font-medium">Grandmaster-level Stockfish NNUE</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Deep-dive into your play with the world's strongest engine. Import games instantly or start exploring positions manually.
              </p>
            </div>
            <TrainMistakesLauncher />
            <GameImport />
            <GameHistoryPanel />
          </>
        ) : (
          <>
            <GameReview />
            <MoveList />
            <GameHistoryPanel />
            <GameImport />
          </>
        )}
      </div>

      {/* Right Ad Sidebar - Only on large screens */}
      <div className="hidden xl:block">
        <SidebarAd side="right" />
      </div>
    </div>
  );
}
