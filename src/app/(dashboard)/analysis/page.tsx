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
import { playMoveSound } from "@/lib/audio";
import { useSettings } from "@/contexts/SettingsContext";
import { createClient } from "@/lib/supabase/client";
import type { GameAnalysis } from "@/types/chess";

export default function AnalysisPage() {
  const [pgnInput, setPgnInput] = useState("");
  const [importTab, setImportTab] = useState<"pgn" | "chesscom" | "lichess">("pgn");
  const [sidebarTab, setSidebarTab] = useState<"engine" | "review">("engine");
  const [usernameInput, setUsernameInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  
  const { game, position, history, historyFens, makeMove, branchMove, loadPgn, turn } = useChessGame();
  const { settings, updateSetting } = useSettings();
  
  const { evaluatePosition, isReady, sendCommand, onMessage } = useStockfish();

  const [evalData, setEvalData] = useState<{moveNumber: number, cp: number, mate: number | null}[]>([]);
  const [moveFrom, setMoveFrom] = useState<string | null>(null);
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({});
  const [currentLines, setCurrentLines] = useState<{eval: {cp: number, mate: number | null}, moves: string[], depth: number}[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [visualOrientation, setVisualOrientation] = useState<"white" | "black">("white");

  useEffect(() => {
    // Sync usernames from database to local storage for a seamless experience across devices
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("profiles").select("chess_com_username, lichess_username").eq("id", user.id).single()
          .then(({ data }) => {
            if (data) {
              if (data.chess_com_username) localStorage.setItem("chessium_chesscom_user", data.chess_com_username);
              if (data.lichess_username) localStorage.setItem("chessium_lichess_user", data.lichess_username);
              
              // Prefill input if it matches the current tab
              if (importTab === "chesscom" && data.chess_com_username) setUsernameInput(data.chess_com_username);
              if (importTab === "lichess" && data.lichess_username) setUsernameInput(data.lichess_username);
            }
          });
      }
    });
    
    // Always try to load from local storage immediately for the current tab
    const localUser = localStorage.getItem(`chessium_${importTab}_user`);
    if (localUser) {
      setUsernameInput(localUser);
    }
  }, [importTab]);

  // Full Game Analysis State
  const [gameAnalysis, setGameAnalysis] = useState<GameAnalysis | null>(null);
  const [isAnalyzingGame, setIsAnalyzingGame] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Navigation State
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const prevHistoryLengthRef = useRef(history.length);
  const [shouldAutoAnalyze, setShouldAutoAnalyze] = useState(false);
  
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
      setShouldAutoAnalyze(true);
    }
  }, [loadPgn]);

  // Play sound on move change
  useEffect(() => {
    if (currentMoveIndex >= 0 && history[currentMoveIndex]) {
      const san = history[currentMoveIndex].san;
      playMoveSound(san.includes('x'), settings.soundEnabled);
    }
  }, [currentMoveIndex, history, settings.soundEnabled]);

  // Auto-analyze when flag is set and game is loaded
  useEffect(() => {
    if (shouldAutoAnalyze && history.length > 1 && !isAnalyzingGame && isReady) {
      setShouldAutoAnalyze(false);
      handleRunAnalysis();
    }
  }, [shouldAutoAnalyze, history.length, isAnalyzingGame, isReady]);

  // Load PGN from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pgnParam = urlParams.get("pgn");
    if (pgnParam) {
      loadPgn(pgnParam);
      // Clean up URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
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

    setCurrentLines([]); // Clear old lines immediately to prevent stuck arrow!
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
        depth: 12, // Reduced depth for faster browser processing
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
      setShouldAutoAnalyze(true);
    }
  };

  const handleImport = async () => {
    if (importTab === "pgn") {
      handlePgnSubmit();
      return;
    }

    const savedUser = localStorage.getItem(`chessium_${importTab}_user`);
    let username = usernameInput.trim() || savedUser;

    if (!username) {
      const promptRes = window.prompt(`Enter your ${importTab === 'chesscom' ? 'Chess.com' : 'Lichess'} username:`);
      if (!promptRes) return;
      username = promptRes;
    }
    
    // Always save the username (whether from input or prompt)
    localStorage.setItem(`chessium_${importTab}_user`, username);
    
    // Save to database so they don't have to enter it again on other devices
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const updateData = importTab === 'chesscom' ? { chess_com_username: username } : { lichess_username: username };
        const metaUsername = user.user_metadata?.username || user.email?.split('@')[0] || 'Unknown';
        
        // Use upsert in case the profile doesn't exist (e.g. if the DB trigger failed during signup)
        supabase.from("profiles").upsert({
          id: user.id,
          username: metaUsername,
          ...updateData
        }).then();
      }
    });

    setIsImporting(true);
    try {
      if (importTab === "chesscom") {
        const archivesRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
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
              setShouldAutoAnalyze(true);
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
        const res = await fetch(`https://lichess.org/api/games/user/${username}?max=1&pgnInJson=false`);
        const pgn = await res.text();
        if (pgn.trim()) {
          loadPgn(pgn);
          setUsernameInput("");
          setShouldAutoAnalyze(true);
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
    if (isAnalyzingGame) return false;
    
    const isPawn = piece[1]?.toLowerCase() === "p";
    const isBackRank = target[1] === "8" || target[1] === "1";
    const promotion = (isPawn && isBackRank) ? "q" : undefined;

    const moveParams = {
      from: source,
      to: target,
      promotion: promotion,
    };

    const move = currentMoveIndex === history.length - 1 
      ? makeMove(moveParams)
      : branchMove(moveParams, currentMoveIndex);
    
    if (move) {
      setCurrentMoveIndex(prev => prev + 1);
      setGameAnalysis(null); // clear full analysis since line changed
      return true;
    }
    return false;
  };

  const onSquareClick = (square: string) => {
    if (isAnalyzingGame) return;

    const currentChess = currentMoveIndex === history.length - 1 
      ? game 
      : (() => {
          const temp = new (game.constructor as any)();
          const initialFen = history.length > 0 ? (game.header()?.FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") : game.fen();
          try { temp.load(initialFen); } catch {}
          for (let i = 0; i <= currentMoveIndex; i++) {
            if (history[i]) temp.move(history[i]);
          }
          return temp;
        })();

    if (!moveFrom) {
      const piece = currentChess.get(square as any);
      const currentTurn = currentChess.turn();
      if (piece && piece.color === currentTurn) {
        const moves = currentChess.moves({ square: square as any, verbose: true });
        if (moves.length === 0) return;

        setMoveFrom(square);
        
        const newOptionSquares: Record<string, any> = {};
        moves.forEach((m: any) => {
          const targetPiece = currentChess.get(m.to as any);
          newOptionSquares[m.to] = {
            background:
              targetPiece && targetPiece.color !== piece.color
                ? "radial-gradient(circle, rgba(0,0,0,.4) 85%, transparent 85%)"
                : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)",
            borderRadius: "50%"
          };
        });
        newOptionSquares[square] = {
          background: "rgba(255, 255, 0, 0.4)",
        };
        setOptionSquares(newOptionSquares);
      }
      return;
    }

    const moves = currentMoveIndex === history.length - 1 
      ? game.moves({ square: moveFrom as any, verbose: true })
      : (() => {
          // Temporarily load the history up to currentMoveIndex to get valid moves
          const tempChess = new (game.constructor as any)();
          const initialFen = history.length > 0 ? (game.header()?.FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") : game.fen();
          try { tempChess.load(initialFen); } catch {}
          for (let i = 0; i <= currentMoveIndex; i++) {
            if (history[i]) tempChess.move(history[i]);
          }
          return tempChess.moves({ square: moveFrom as any, verbose: true });
        })();

    const foundMove = moves.find((m: any) => m.to === square);

    if (foundMove) {
      const moveParams = {
        from: moveFrom,
        to: square,
        promotion: foundMove.promotion,
      };

      const move = currentMoveIndex === history.length - 1 
        ? makeMove(moveParams)
        : branchMove(moveParams, currentMoveIndex);

      if (move) {
        setCurrentMoveIndex(prev => prev + 1);
        setGameAnalysis(null);
      }
      setMoveFrom(null);
      setOptionSquares({});
      return;
    }

    const piece = game.get(square as any);
    if (piece && piece.color === turn && square !== moveFrom) {
      const newMoves = game.moves({ square: square as any, verbose: true });
      if (newMoves.length === 0) {
        setMoveFrom(null);
        setOptionSquares({});
        return;
      }
      setMoveFrom(square);
      
      const newOptionSquares: Record<string, any> = {};
      newMoves.forEach((m) => {
        const targetPiece = game.get(m.to as any);
        newOptionSquares[m.to] = {
          background:
            targetPiece && targetPiece.color !== piece.color
              ? "radial-gradient(circle, rgba(0,0,0,.4) 85%, transparent 85%)"
              : "radial-gradient(circle, rgba(0,0,0,.4) 25%, transparent 25%)",
            borderRadius: "50%"
        };
      });
      newOptionSquares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };
      setOptionSquares(newOptionSquares);
    } else {
      setMoveFrom(null);
      setOptionSquares({});
    }
  };

  // Build classification icon overlay if analysis exists
  const customSquareStyles: Record<string, React.CSSProperties> = { ...optionSquares };
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
          ...customSquareStyles[targetSquare],
          backgroundImage: dataUri,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top -5px right -5px",
          backgroundSize: "28px",
          zIndex: 10
        };
      }
    }
  }

  // Compute graph data (use gameAnalysis if available, else live evalData)
  const computedEvalData = gameAnalysis && gameAnalysis.moves.length > 0
    ? [
        { moveNumber: -1, cp: gameAnalysis.moves[0].evalBefore.cp, mate: gameAnalysis.moves[0].evalBefore.mate },
        ...gameAnalysis.moves.map((m, i) => ({
          moveNumber: i,
          cp: m.evalAfter.cp,
          mate: m.evalAfter.mate
        }))
      ]
    : evalData;

  const currentEval = computedEvalData.find(d => d.moveNumber === currentMoveIndex);

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
      {/* Left Column: Board & Graph */}
      <div className="flex-1 flex flex-col gap-4 min-w-[300px] min-h-0 items-center justify-center">
        {/* Board Area - Responsive width constrained by viewport height to prevent scrolling */}
        <div className="w-full flex flex-col" style={{ maxWidth: 'min(700px, calc(100vh - 14rem))' }}>
          
          {/* Toolbar */}
          <div className="flex items-center justify-end gap-2 px-2 mb-2">
            <select 
              value={settings.boardTheme}
              onChange={(e) => updateSetting('boardTheme', e.target.value as any)}
              className="bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#81b64c]"
            >
              <option value="green">Green</option>
              <option value="classic">Classic</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="neon">Neon</option>
            </select>
            <button 
              onClick={() => setVisualOrientation(prev => prev === "white" ? "black" : "white")}
              className="bg-[#141416] border border-[#2a2a30] text-[#a0a0a8] hover:text-white rounded-lg p-1 transition-colors"
              title="Flip Board"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* Top Player (Black by default if board is white-oriented) */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-8 h-8 bg-[#2a2a30] rounded-md flex items-center justify-center text-sm font-bold shadow-sm">
              {visualOrientation === "white" ? "B" : "W"}
            </div>
            <div className="font-semibold text-white">
              {visualOrientation === "white" ? blackPlayer : whitePlayer}
              {(visualOrientation === "white" ? blackElo : whiteElo) && <span className="ml-2 text-[#a0a0a8] text-sm font-normal">({visualOrientation === "white" ? blackElo : whiteElo})</span>}
            </div>
          </div>

          {/* EvalBar & Board Row */}
          <div className="flex gap-3 sm:gap-4 w-full">
            <div className="shrink-0 w-6 sm:w-8 h-auto flex flex-col">
              <EvalBar centipawns={currentEval?.cp || 0} mateIn={currentEval?.mate || null} orientation={visualOrientation} />
            </div>
            <div className="flex-1 min-w-0">
              <Board 
                position={historyFens[currentMoveIndex + 1] || position} 
                onPieceDrop={currentMoveIndex === history.length - 1 ? handlePieceDrop : undefined}
                onSquareClick={currentMoveIndex === history.length - 1 ? onSquareClick : undefined}
                customSquareStyles={customSquareStyles}
                customArrows={(() => {
                  if (!settings.showBestMoveArrow) return [];
                  
                  // If we have full game analysis, get the best move for the *current* board state
                  // The current board state is before move (currentMoveIndex + 1)
                  if (gameAnalysis && gameAnalysis.moves[currentMoveIndex + 1]?.bestMove) {
                    const bm = gameAnalysis.moves[currentMoveIndex + 1].bestMove;
                    return [[bm.substring(0, 2), bm.substring(2, 4), "rgba(129, 182, 76, 0.7)"]];
                  }
                  
                  // Otherwise, if the live engine is running, use its best move
                  if (currentLines.length > 0 && currentLines[0].moves.length > 0) {
                    const bm = currentLines[0].moves[0];
                    return [[bm.substring(0, 2), bm.substring(2, 4), "rgba(129, 182, 76, 0.7)"]];
                  }
                  
                  return [];
                })()}
                boardOrientation={visualOrientation}
                theme={settings.boardTheme}
              />
            </div>
          </div>

          {/* Bottom Player (White by default) */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-sm font-bold text-black shadow-sm">
              {visualOrientation === "white" ? "W" : "B"}
            </div>
            <div className="font-semibold text-white">
              {visualOrientation === "white" ? whitePlayer : blackPlayer}
              {(visualOrientation === "white" ? whiteElo : blackElo) && <span className="ml-2 text-[#a0a0a8] text-sm font-normal">({visualOrientation === "white" ? whiteElo : blackElo})</span>}
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
                    data={computedEvalData} 
                    currentMoveIndex={currentMoveIndex}
                    onMoveClick={setCurrentMoveIndex}
                  />
                </div>

                <div className="bg-[#141416] border border-[#2a2a30] rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-white font-bold">Move Classifications</h3>
                    <div className="flex gap-4 text-xs font-semibold text-[#a0a0a8]">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-white rounded-sm"></div>White</div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-black border border-[#2a2a30] rounded-sm"></div>Black</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-sm">
                    {[
                      { key: 'brilliant', label: 'Brilliant', color: '#26C281' },
                      { key: 'great', label: 'Great', color: '#5B8BBD' },
                      { key: 'best', label: 'Best', color: '#81b64c' },
                      { key: 'excellent', label: 'Excellent', color: '#9fcc6b' },
                      { key: 'good', label: 'Good', color: '#96bc4b' },
                      { key: 'inaccuracy', label: 'Inaccuracy', color: '#F3CA20' },
                      { key: 'mistake', label: 'Mistake', color: '#E58E26' },
                      { key: 'blunder', label: 'Blunder', color: '#FF3838' },
                      { key: 'missed_win', label: 'Missed Win', color: '#FF3838' },
                    ].map(({ key, label, color }) => (
                      <div key={key} className="flex items-center p-2 bg-[#1a1a1f] rounded-lg">
                        <div className="flex-1 font-semibold" style={{ color }}>{label}</div>
                        <div className="flex gap-4 w-24 justify-end pr-2">
                          <span className="w-8 text-center text-white font-medium bg-white/5 rounded py-0.5">{(gameAnalysis.whiteSummary as any)[key]}</span>
                          <span className="w-8 text-center text-[#a0a0a8] font-medium bg-black/50 rounded border border-[#2a2a30] py-0.5">{(gameAnalysis.blackSummary as any)[key]}</span>
                        </div>
                      </div>
                    ))}
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
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set("pgn", game.pgn());
                      navigator.clipboard.writeText(url.toString());
                      alert("Share link copied to clipboard!");
                    }}
                    className="flex-1 py-3 text-sm font-bold text-white border border-[#2a2a30] hover:bg-[#1a1a1f] rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button
                    onClick={() => {
                      loadPgn("");
                      setGameAnalysis(null);
                    }}
                    className="flex-1 py-3 text-sm font-bold text-[#ca3431] border border-[#ca3431]/30 hover:bg-[#ca3431]/10 rounded-xl transition-colors shadow-sm"
                  >
                    New Game
                  </button>
                </div>
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
