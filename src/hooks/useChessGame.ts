import { useState, useCallback, useMemo } from "react";
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

  const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
    try {
      const g = new Chess(game.fen());
      // Re-apply history to maintain full game context (important for PGN generation)
      g.loadPgn(game.pgn());
      
      const result = g.move(move);
      if (result) {
        triggerUpdate(g);
        return result;
      }
    } catch (e) {
      // Invalid move
      return null;
    }
    return null;
  }, [game, triggerUpdate]);

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

  return {
    game,
    position,
    history,
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
