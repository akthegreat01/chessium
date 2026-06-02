import { useState, useCallback, useMemo, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Chess, Move } from "chess.js";

export function useChessGame(initialPgn?: string) {
  const [game, setGame] = useState(() => {
    const c = new Chess();
    if (initialPgn) {
      try {
        c.loadPgn(initialPgn);
      } catch (e) {
        console.error("Invalid PGN provided to useChessGame", e);
      }
    }
    return c;
  });

  const [position, setPosition] = useState(game.fen());
  const [history, setHistory] = useState<Move[]>(game.history({ verbose: true }));

  // Helper to trigger re-renders by creating a new Chess instance with the same state
  const triggerUpdate = useCallback((newGame: Chess) => {
    setPosition(newGame.fen());
    setHistory(newGame.history({ verbose: true }));
    setGame(newGame);
  }, []);

  const [moveAudio, setMoveAudio] = useState<HTMLAudioElement | null>(null);
  const [captureAudio, setCaptureAudio] = useState<HTMLAudioElement | null>(null);
  
  const { settings } = useSettings();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMoveAudio(new Audio("/sounds/move.ogg"));
      setCaptureAudio(new Audio("/sounds/capture.ogg"));
    }
  }, []);

  const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const g = new Chess(game.fen());
      // Re-apply history to maintain full game context (important for PGN generation)
      g.loadPgn(game.pgn());
      
      const result = g.move(move);
      if (result) {
        if (settings.soundEnabled) {
          if (result.captured && captureAudio) {
            captureAudio.currentTime = 0;
            captureAudio.play().catch(e => console.log("Audio play failed:", e));
          } else if (moveAudio) {
            moveAudio.currentTime = 0;
            moveAudio.play().catch(e => console.log("Audio play failed:", e));
          }
        }
        triggerUpdate(g);
        return result;
      }
    } catch (e) {
      // Invalid move
      return null;
    }
    return null;
  }, [game, triggerUpdate, captureAudio, moveAudio]);

  const undoMove = useCallback(() => {
    const g = new Chess();
    g.loadPgn(game.pgn());
    const move = g.undo();
    if (move) {
      triggerUpdate(g);
    }
    return move;
  }, [game, triggerUpdate]);

  const resetGame = useCallback(() => {
    const g = new Chess();
    triggerUpdate(g);
  }, [triggerUpdate]);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const g = new Chess();
      g.loadPgn(pgn);
      triggerUpdate(g);
      return true;
    } catch (e) {
      return false;
    }
  }, [triggerUpdate]);

  const isCheck = useMemo(() => game.isCheck(), [position]);
  const isCheckmate = useMemo(() => game.isCheckmate(), [position]);
  const isDraw = useMemo(() => game.isDraw(), [position]);
  const isGameOver = useMemo(() => game.isGameOver(), [position]);
  const turn = useMemo(() => game.turn(), [position]);

  const historyFens = useMemo(() => {
    const tempChess = new Chess();
    // Default initial position or whatever the game started with if it's a puzzle?
    // Actually, `game.header()` might have a FEN, but let's just initialize it carefully:
    // If it's a puzzle, the initial board state isn't the standard starting FEN.
    // Instead of rebuilding the game from moves, we can just use `game.history()`? No, chess.js doesn't give FENs per move easily.
    // A better approach for `historyFens`:
    // It's safer to just load the same PGN into a fresh instance, but we need the initial FEN if it exists.
    // Actually, if we use tempChess.loadPgn(game.pgn()), it will just be at the end.
    // Let's get the moves and starting FEN.
    
    // Check if there is a custom starting FEN
    const initialFen = game.history().length > 0 ? (
       // It's tricky to get the starting FEN of a loaded PGN from chess.js directly, but we can reset and see if it was standard.
       // The easiest way is to parse the headers.
       game.header()?.FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    ) : game.fen();

    try {
      tempChess.load(initialFen);
    } catch {
      // Fallback
    }

    const fens = [tempChess.fen()];
    const moves = game.history();
    for (const m of moves) {
      tempChess.move(m);
      fens.push(tempChess.fen());
    }
    return fens;
  }, [position]);

  return {
    game,
    position,
    history,
    historyFens,
    makeMove,
    undoMove,
    resetGame,
    loadPgn,
    isCheck,
    isCheckmate,
    isDraw,
    isGameOver,
    turn,
    pgn: game.pgn()
  };
}
