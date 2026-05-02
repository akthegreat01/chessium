"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useChessStore } from "@/lib/chessStore";
import { useUserStore } from "@/lib/userStore";
import { RotateCw, Copy, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCcw, Check, Undo2, Share2 } from 'lucide-react';
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
const LiveEnginePanel = dynamic(() => import("@/components/LiveEnginePanel"), { ssr: false });
const NotificationToast = dynamic(() => import("@/components/NotificationToast"), { ssr: false });
const CelebrationOverlay = dynamic(() => import("@/components/CelebrationOverlay"), { ssr: false });

export default function Home() {
  const { 
    fen, game, history, currentMoveIndex,
    resetGame, flipBoard, toggleSound,
    boardFlipped, analysisResult, mainLineHistory, restoreMainLine,
    zenMode, toggleZenMode, showHintMove, hideHint, showHint, goToMove, goBack, goForward, loadSavedGames,
    botMessage, playingAI
  } = useChessStore();

  const { checkDailyStreak } = useUserStore();

  const [fenCopied, setFenCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    loadSavedGames();
    checkDailyStreak();
  }, [loadSavedGames, checkDailyStreak]);

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

  const shareGame = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1500);
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

  // Move count display
  const moveDisplay = useMemo(() => {
    if (history.length === 0) return null;
    const moveNum = Math.floor(currentMoveIndex / 2) + 1;
    const isWhite = currentMoveIndex % 2 === 0;
    return `Move ${moveNum}${isWhite ? '.' : '...'}`;
  }, [currentMoveIndex, history.length]);

  return (
    <>
      <NotificationToast />
      <CelebrationOverlay />
      <div className={`flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-4 p-2 md:p-4 lg:p-6 transition-all duration-500 ${zenMode ? 'items-center justify-center' : ''}`}>
        
        {/* Left Ad Sidebar - Only on large screens */}
        {!zenMode && (
          <div className="hidden xl:block">
            <SidebarAd side="left" />
          </div>
        )}

        {/* Center: Board Column */}
        <div className={`flex flex-col shrink-0 w-full mx-auto lg:mx-0 justify-start ${zenMode ? 'items-center pt-8' : 'lg:pt-2'}`} style={{ width: '100%', maxWidth: 'min(100%, calc(100vh - 180px), 800px)' }}>
          
          {/* Top Player */}
          <PlayerBar color={topColor} isTop />

          {/* Board row: eval bar + board */}
          <div className="flex gap-1.5 my-0.5 w-full">
            <div className="hidden md:block shrink-0">
              <EvaluationBar />
            </div>
            <div className="relative flex-1 aspect-square w-full">
              <Chessboard />
            </div>
          </div>

          {/* Bottom Player */}
          <PlayerBar color={bottomColor} />

          {/* Board toolbar */}
          <div className="flex items-center justify-between mt-1.5 px-0.5 gap-2 w-full">
            {/* Navigation Controls */}
            <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.05]">
              <button onClick={() => goToMove(-1)} disabled={currentMoveIndex === -1}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-90" title="First (Home)">
                <ChevronsLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={goBack} disabled={currentMoveIndex === -1}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-90" title="Back (←)">
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>

              {/* Current move indicator */}
              {moveDisplay && (
                <span className="text-[10px] text-gray-500 font-mono px-1.5 select-none hidden sm:inline">{moveDisplay}</span>
              )}

              <button onClick={goForward} disabled={currentMoveIndex === history.length - 1}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-90" title="Forward (→)">
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={() => goToMove(history.length - 1)} disabled={currentMoveIndex === history.length - 1}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 disabled:opacity-20 transition-all active:scale-90" title="Last (End)">
                <ChevronsRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.05]">
              {mainLineHistory && (
                <button onClick={restoreMainLine}
                  className="p-1.5 md:p-2 rounded-md hover:bg-white/10 transition-all active:scale-90 group" title="Restore Main Line">
                  <Undo2 className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </button>
              )}
              <button onClick={flipBoard}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 transition-all active:scale-90 group" title="Flip Board (F)">
                <RotateCw className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <button onClick={copyFen}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 transition-all active:scale-90 group" title="Copy FEN">
                {fenCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />}
              </button>
              <button onClick={downloadPgn}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 transition-all active:scale-90 group" title="Download PGN">
                <Download className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <button onClick={shareGame}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 transition-all active:scale-90 group" title="Share">
                {linkCopied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />}
              </button>
              <div className="w-px h-5 bg-white/[0.08] mx-0.5 hidden sm:block" />
              <button onClick={toggleZenMode}
                className={`p-1.5 md:p-2 rounded-md transition-all active:scale-90 group ${zenMode ? 'bg-purple-500/20' : 'hover:bg-white/10'}`} title="Zen Mode">
                <span className={`w-4 h-4 text-center font-bold ${zenMode ? 'text-purple-400' : 'text-gray-400 group-hover:text-white'}`}>Z</span>
              </button>
              <div className="w-px h-5 bg-white/[0.08] mx-0.5 hidden sm:block" />
              <button onClick={resetGame}
                className="p-1.5 md:p-2 rounded-md hover:bg-white/10 transition-all active:scale-90 group" title="New Game">
                <RefreshCcw className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </button>
              <div className="w-px h-5 bg-white/[0.08] mx-0.5 hidden sm:block" />
              <SettingsPanel />
            </div>
          </div>
        </div>

        {/* Right: Side Panel */}
        {!zenMode && (
          <div className="flex-none w-full lg:w-[360px] lg:max-w-[360px] lg:h-[calc(100vh-100px)] lg:overflow-y-auto custom-scrollbar flex flex-col gap-2 pb-4">
            {history.length === 0 ? (
              <>
                <div className="glass-panel p-2 flex flex-col gap-1.5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10">
                      <span className="text-blue-400 text-sm">♛</span>
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-white uppercase tracking-wider">Engine Insights</h2>
                      <p className="text-[9px] text-gray-500 font-medium">Grandmaster-level Stockfish NNUE</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug font-medium">
                    Deep-dive into your play with the world&apos;s strongest engine. Import games instantly or start exploring positions manually.
                  </p>
                </div>
                <TrainMistakesLauncher />
                <LiveEnginePanel />
                <GameImport />
                <GameHistoryPanel />
              </>
            ) : (
              <>
                <div className="shrink-0 isolate">
                  <GameReview />
                </div>
                <div className="flex-1 min-h-0 isolate">
                  <MoveList />
                </div>
                <div className="shrink-0 isolate">
                  <LiveEnginePanel />
                </div>
                <div className="shrink-0 isolate">
                  <GameHistoryPanel />
                </div>
                <div className="shrink-0 isolate">
                  <GameImport />
                </div>
              </>
            <div className="mt-auto pt-4 flex justify-center">
              <a 
                href="/support" 
                className="text-[10px] text-gray-600 hover:text-blue-400 transition-colors uppercase tracking-widest font-black flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
                Support Chessium
              </a>
            </div>
          </div>
        )}

        {/* Right Ad Sidebar - Only on large screens */}
        {!zenMode && (
          <div className="hidden xl:block">
            <SidebarAd side="right" />
          </div>
        )}
      </div>
    </>
  );
}
