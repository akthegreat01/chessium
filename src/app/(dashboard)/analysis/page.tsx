"use client";

import { useState, useEffect, useRef } from "react";
import Board from "@/components/chess/Board";
import MoveList from "@/components/chess/MoveList";
import EvalBar from "@/components/chess/EvalBar";
import EvalGraph from "@/components/chess/EvalGraph";
import EngineLines from "@/components/chess/EngineLines";
import { useChessGame } from "@/hooks/useChessGame";
import { useStockfish } from "@/hooks/useStockfish";
import AdSlot from "@/components/ui/AdSlot";
import { analyzeGame } from "@/lib/chess/analysis";
import { getEngine } from "@/lib/chess/engine";
import type { GameAnalysis } from "@/types/chess";

export default function AnalysisPage() {
  const [pgnInput, setPgnInput] = useState("");
  const [importTab, setImportTab] = useState<"pgn" | "chesscom" | "lichess">("pgn");
  const [sidebarTab, setSidebarTab] = useState<"engine" | "review">("engine");
  const [usernameInput, setUsernameInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  
  const { game, position, history, historyFens, makeMove, loadPgn, turn } = useChessGame();
  
  const { evaluatePosition, isReady, sendCommand, onMessage } = useStockfish();

  const [evalData, setEvalData] = useState<{moveNumber: number, cp: number, mate: number | null}[]>([]);
  const [currentLines, setCurrentLines] = useState<{eval: {cp: number, mate: number | null}, moves: string[], depth: number}[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Full Game Analysis State
  const [gameAnalysis, setGameAnalysis] = useState<GameAnalysis | null>(null);
  const [isAnalyzingGame, setIsAnalyzingGame] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Navigation State
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const prevHistoryLengthRef = useRef(history.length);
  
  // Sync currentMoveIndex when history changes (new moves or new game loaded)
  useEffect(() => {
    if (history.length !== prevHistoryLengthRef.current) {
      setCurrentMoveIndex(history.length - 1);
      prevHistoryLengthRef.current = history.length;
    }
  }, [history.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentMoveIndex(prev => Math.max(-1, prev - 1));
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentMoveIndex(prev => Math.min(history.length - 1, prev + 1));
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history.length]);

  // Check for game review from Play page
  useEffect(() => {
    const reviewPgn = localStorage.getItem("chessium_review_pgn");
    if (reviewPgn) {
      loadPgn(reviewPgn);
      localStorage.removeItem("chessium_review_pgn");
    }
  }, [loadPgn]);

  // Parse eval from PGN on load
  useEffect(() => {
    const rawPgn = game.pgn();
    const newEvalData: typeof evalData = [];
    
    // Naive parse of [%eval cp,depth] or [%eval #mate,depth] from PGN
    let moveCounter = -1; // -1 for starting position (if we had one)
    // Actually simpler: we can just clear it and let the engine fill it in
    // But if we want to parse it, we can. Let's just clear it for now when history changes from scratch.
    if (history.length <= 1) {
      setEvalData([]);
    }
  }, [history.length]);

  // Real-time engine evaluation for current position
  useEffect(() => {
    if (!isReady) return;

    setIsThinking(true);
    const fen = historyFens[currentMoveIndex + 1] || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    
    // Listen for live updates
    const cleanup = onMessage("analysis-live", (line) => {
      if (line.includes("info depth")) {
        const depthMatch = line.match(/depth (\d+)/);
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const pvMatch = line.match(/ pv (.*)/);
        
        if (depthMatch && (cpMatch || mateMatch) && pvMatch) {
          const depth = parseInt(depthMatch[1], 10);
          const cp = cpMatch ? parseInt(cpMatch[1], 10) : 0;
          const mate = mateMatch ? parseInt(mateMatch[1], 10) : null;
          const pv = pvMatch[1].trim().split(" ");
          
          setCurrentLines([{ eval: { cp, mate }, moves: pv, depth }]);
          
          // Update graph data live
          setEvalData(prev => {
            const newData = [...prev];
            const existingIndex = newData.findIndex(d => d.moveNumber === currentMoveIndex);
            const entry = { moveNumber: currentMoveIndex, cp, mate };
            if (existingIndex >= 0) {
              newData[existingIndex] = entry;
            } else {
              newData.push(entry);
            }
            return newData.sort((a, b) => a.moveNumber - b.moveNumber);
          });
        }
      }
    });

    // Start engine analysis
    sendCommand("stop");
    sendCommand(`position fen ${fen}`);
    sendCommand("go depth 18"); // analyze to depth 18

    return () => {
      cleanup();
    };
  }, [currentMoveIndex, isReady, historyFens, sendCommand, onMessage]);

  const handleRunAnalysis = async () => {
    if (history.length <= 1) {
      alert("Load a game to analyze first.");
      return;
    }
    
    setIsAnalyzingGame(true);
    setAnalysisProgress(0);
    setSidebarTab("review");

    try {
      const engine = getEngine();
      const result = await analyzeGame(game.pgn(), engine, {
        depth: 14, // Reduced depth for faster browser processing
        onProgress: (current, total) => {
          setAnalysisProgress(Math.round((current / total) * 100));
        }
      });
      setGameAnalysis(result);
    } catch (err) {
      console.error("Analysis Error:", err);
      alert("Failed to analyze the game.");
    } finally {
      setIsAnalyzingGame(false);
    }
  };

  const handlePgnSubmit = () => {
    if (pgnInput.trim()) {
      loadPgn(pgnInput);
      setPgnInput("");
    }
  };

  const handleImport = async () => {
    if (importTab === "pgn") {
      handlePgnSubmit();
      return;
    }

    if (!usernameInput.trim()) return;

    setIsImporting(true);
    try {
      if (importTab === "chesscom") {
        const archivesRes = await fetch(`https://api.chess.com/pub/player/${usernameInput}/games/archives`);
        const archivesData = await archivesRes.json();
        if (archivesData.archives && archivesData.archives.length > 0) {
          const latestArchiveUrl = archivesData.archives[archivesData.archives.length - 1];
          const gamesRes = await fetch(latestArchiveUrl);
          const gamesData = await gamesRes.json();
          if (gamesData.games && gamesData.games.length > 0) {
            const latestGame = gamesData.games[gamesData.games.length - 1];
            if (latestGame.pgn) {
              loadPgn(latestGame.pgn);
              setUsernameInput("");
            } else {
              alert("No PGN found in the latest game.");
            }
          } else {
            alert("No games found in the latest archive.");
          }
        } else {
          alert("No game archives found for this user.");
        }
      } else if (importTab === "lichess") {
        const res = await fetch(`https://lichess.org/api/games/user/${usernameInput}?max=1&pgnInJson=false`);
        const pgn = await res.text();
        if (pgn.trim()) {
          loadPgn(pgn);
          setUsernameInput("");
        } else {
          alert("No games found for this user.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to import game. Please check the username and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  // Extracted header information
  const whitePlayer = game.header()?.White || "White";
  const blackPlayer = game.header()?.Black || "Black";
  const whiteElo = game.header()?.WhiteElo || "";
  const blackElo = game.header()?.BlackElo || "";

  // Move handling
  const handlePieceDrop = (source: string, target: string, piece: string) => {
    // Prevent moving if we are viewing past history
    if (currentMoveIndex !== history.length - 1) return false;

    const promotion = piece[1].toLowerCase();
    const move = makeMove({
      from: source,
      to: target,
      promotion: promotion === "p" ? undefined : promotion,
    });
    return move !== null;
  };

  // Build classification icon overlay if analysis exists
  const customSquareStyles: Record<string, React.CSSProperties> = {};
  if (gameAnalysis && currentMoveIndex >= 0) {
    const moveStats = gameAnalysis.moves[currentMoveIndex];
    if (moveStats && history[currentMoveIndex]) {
      const targetSquare = history[currentMoveIndex].to;
      let color = "";
      let text = "";
      switch (moveStats.classification) {
        case "brilliant": color = "#26C281"; text = "!!"; break;
        case "great": color = "#5B8BBD"; text = "!"; break;
        case "best": color = "#81b64c"; text = "★"; break;
        case "excellent": color = "#9fcc6b"; text = "👍"; break;
        case "good": color = "#96bc4b"; text = "✓"; break;
        case "inaccuracy": color = "#F3CA20"; text = "?!"; break;
        case "mistake": color = "#E58E26"; text = "?"; break;
        case "blunder": color = "#FF3838"; text = "??"; break;
        case "missed_win": color = "#FF3838"; text = "✕"; break;
      }

      if (color) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/><text x="12" y="16" font-family="Arial" font-size="10" font-weight="bold" fill="white" text-anchor="middle">${text}</text></svg>`;
        const dataUri = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
        customSquareStyles[targetSquare] = {
          backgroundImage: dataUri,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top -5px right -5px",
          backgroundSize: "28px",
          zIndex: 10
        };
      }
    }
  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
      {/* Left Column: Board & Graph */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px]">
        {/* Board Area */}
        <div className="flex gap-4 max-w-[700px] mx-auto w-full aspect-[1/1] relative">
          <div className="h-full">
            <EvalBar centipawns={evalData[currentMoveIndex]?.cp || 0} mateIn={evalData[currentMoveIndex]?.mate || null} orientation="white" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {/* Top Player (Black by default if board is white-oriented) */}
            <div className="flex items-center gap-3 px-2 py-2 mb-1 bg-[#141416] rounded-t-lg border border-[#2a2a30] border-b-0">
              <div className="w-8 h-8 rounded-md bg-[#2a2a30] flex items-center justify-center text-sm font-bold text-white shadow-inner">{blackPlayer.charAt(0)}</div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm leading-tight">{blackPlayer}</span>
                {blackElo && <span className="text-[#a0a0a8] text-xs font-mono">{blackElo}</span>}
              </div>
            </div>

            <div className="flex-1 rounded-sm overflow-hidden border-x border-[#2a2a30]">
              <Board 
                position={historyFens[currentMoveIndex + 1] || position} 
                onPieceDrop={handlePieceDrop} 
                customSquareStyles={customSquareStyles}
              />
            </div>

            {/* Bottom Player (White by default) */}
            <div className="flex items-center gap-3 px-2 py-2 mt-1 bg-[#141416] rounded-b-lg border border-[#2a2a30] border-t-0">
              <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-sm font-bold text-[#0a0a0b] shadow-inner">{whitePlayer.charAt(0)}</div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-sm leading-tight">{whitePlayer}</span>
                {whiteElo && <span className="text-[#a0a0a8] text-xs font-mono">{whiteElo}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Controls, Moves, Engine */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 h-full">
        {/* Sidebar Tabs */}
        <div className="flex gap-4 border-b border-[#2a2a30] shrink-0">
          <button 
            onClick={() => setSidebarTab("engine")}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${sidebarTab === "engine" ? "text-[#81b64c] border-[#81b64c]" : "text-[#a0a0a8] border-transparent hover:text-white"}`}
          >
            Engine & Moves
          </button>
          <button 
            onClick={() => setSidebarTab("review")}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${sidebarTab === "review" ? "text-[#81b64c] border-[#81b64c]" : "text-[#a0a0a8] border-transparent hover:text-white"}`}
          >
            Game Review
          </button>
        </div>

        {sidebarTab === "engine" ? (
          <>
            {/* Game Info / Actions */}
            <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4 shrink-0">
          <div className="flex gap-4 mb-4 border-b border-[#2a2a30] pb-2">
            <button 
              onClick={() => setImportTab("pgn")}
              className={`text-sm font-medium ${importTab === "pgn" ? "text-[#81b64c]" : "text-[#a0a0a8] hover:text-white"}`}
            >
              PGN
            </button>
            <button 
              onClick={() => setImportTab("chesscom")}
              className={`text-sm font-medium ${importTab === "chesscom" ? "text-[#81b64c]" : "text-[#a0a0a8] hover:text-white"}`}
            >
              Chess.com
            </button>
            <button 
              onClick={() => setImportTab("lichess")}
              className={`text-sm font-medium ${importTab === "lichess" ? "text-[#81b64c]" : "text-[#a0a0a8] hover:text-white"}`}
            >
              Lichess
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {importTab === "pgn" ? (
              <textarea 
                value={pgnInput}
                onChange={(e) => setPgnInput(e.target.value)}
                placeholder="Paste PGN here..."
                rows={3}
                className="w-full bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none resize-none"
              />
            ) : (
              <input 
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={`Enter ${importTab === "chesscom" ? "Chess.com" : "Lichess"} username`}
                className="w-full bg-[#0a0a0b] border border-[#2a2a30] rounded-lg px-3 py-2 text-sm text-white focus:border-[#81b64c] outline-none"
              />
            )}
            
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className="w-full bg-[#81b64c] hover:bg-[#9fcc6b] disabled:bg-[#2a2a30] disabled:text-[#6b6b75] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {isImporting ? "Loading..." : importTab === "pgn" ? "Load PGN" : "Fetch Latest Game"}
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
              onMoveClick={setCurrentMoveIndex}
            />
          </>
        ) : (
          <div className="flex flex-col gap-4 h-full overflow-y-auto">
            {isAnalyzingGame ? (
              <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4">
                <div className="text-white font-bold text-lg">Analyzing Game...</div>
                <div className="w-full bg-[#2a2a30] rounded-full h-2.5">
                  <div className="bg-[#81b64c] h-2.5 rounded-full transition-all duration-300" style={{ width: `${analysisProgress}%` }}></div>
                </div>
                <div className="text-[#a0a0a8] text-sm">{analysisProgress}% Complete</div>
              </div>
            ) : gameAnalysis ? (
              <>
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#141416] border border-[#2a2a30] rounded-xl p-4 flex flex-col items-center">
                    <div className="text-[#a0a0a8] text-xs font-semibold uppercase tracking-wider mb-1">White Accuracy</div>
                    <div className="text-3xl font-bold text-white">{gameAnalysis.whiteAccuracy}%</div>
                  </div>
                  <div className="flex-1 bg-[#141416] border border-[#2a2a30] rounded-xl p-4 flex flex-col items-center">
                    <div className="text-[#a0a0a8] text-xs font-semibold uppercase tracking-wider mb-1">Black Accuracy</div>
                    <div className="text-3xl font-bold text-white">{gameAnalysis.blackAccuracy}%</div>
                  </div>
                </div>

                <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4">
                  <h3 className="text-white font-bold mb-4">Evaluation Graph</h3>
                  <EvalGraph 
                    data={evalData} 
                    currentMoveIndex={currentMoveIndex}
                    onMoveClick={setCurrentMoveIndex}
                  />
                </div>

                <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4">
                  <h3 className="text-white font-bold mb-3">Move Classifications</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#26C281] font-semibold">Brilliant</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.brilliant + gameAnalysis.blackSummary.brilliant}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#5B8BBD] font-semibold">Great</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.great + gameAnalysis.blackSummary.great}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#81b64c] font-semibold">Best</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.best + gameAnalysis.blackSummary.best}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#9fcc6b] font-semibold">Excellent</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.excellent + gameAnalysis.blackSummary.excellent}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#F3CA20] font-semibold">Inaccuracy</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.inaccuracy + gameAnalysis.blackSummary.inaccuracy}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#E58E26] font-semibold">Mistake</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.mistake + gameAnalysis.blackSummary.mistake}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#FF3838] font-semibold">Blunder</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.blunder + gameAnalysis.blackSummary.blunder}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#1a1a1f] rounded-lg">
                      <span className="text-[#FF3838] font-semibold">Missed Win</span>
                      <span className="text-white">{gameAnalysis.whiteSummary.missed_win + gameAnalysis.blackSummary.missed_win}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-[#1a1a1f] rounded-full flex items-center justify-center text-[#81b64c]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Game Review</h3>
                  <p className="text-[#a0a0a8] text-sm">Analyze your game to get accuracy scores and find brilliant moves, mistakes, and blunders.</p>
                </div>
                <button 
                  onClick={handleRunAnalysis}
                  className="bg-[#81b64c] hover:bg-[#9fcc6b] text-white px-6 py-3 rounded-xl font-bold transition-colors w-full mt-2"
                >
                  Run Full Analysis
                </button>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-2 shrink-0 flex justify-center gap-2">
          <button onClick={() => setCurrentMoveIndex(-1)} className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          </button>
          <button onClick={() => setCurrentMoveIndex(prev => Math.max(-1, prev - 1))} className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button onClick={() => setCurrentMoveIndex(prev => Math.min(history.length - 1, prev + 1))} className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <button onClick={() => setCurrentMoveIndex(history.length - 1)} className="p-2.5 rounded-lg hover:bg-[#2a2a30] text-[#a0a0a8] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        <div className="mt-auto pt-2 shrink-0">
          <AdSlot slot="analysis-bottom" />
        </div>
      </div>
    </div>
  );
}
