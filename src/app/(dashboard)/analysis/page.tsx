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

export default function AnalysisPage() {
  const [pgnInput, setPgnInput] = useState("");
  const [importTab, setImportTab] = useState<"pgn" | "chesscom" | "lichess">("pgn");
  const [usernameInput, setUsernameInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { game, position, history, historyFens, makeMove, loadPgn, turn } = useChessGame();
  
  const { evaluatePosition, isReady, sendCommand, onMessage } = useStockfish();

  const [evalData, setEvalData] = useState<{moveNumber: number, cp: number, mate: number | null}[]>([]);
  const [currentLines, setCurrentLines] = useState<{eval: {cp: number, mate: number | null}, moves: string[], depth: number}[]>([]);
  const [isThinking, setIsThinking] = useState(false);

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
              position={historyFens[currentMoveIndex + 1] || position} 
              onPieceDrop={handlePieceDrop} 
            />
          </div>
        </div>

        {/* Evaluation Graph */}
        <div className="max-w-[700px] mx-auto w-full">
          <EvalGraph 
            data={evalData} 
            currentMoveIndex={currentMoveIndex}
            onMoveClick={setCurrentMoveIndex}
          />
        </div>
      </div>

      {/* Right Column: Controls, Moves, Engine */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col gap-4 h-full">
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
