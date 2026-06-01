import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess, Move } from 'chess.js';

export function useChessGame(initialFen: string = 'start') {
  // We keep a mutable ref for chess.js to calculate moves quickly,
  // but we EXPLICITLY mirror the needed state into React's state.
  const gameRef = useRef<Chess>(new Chess());

  // Explicit React State guaranteed to trigger re-renders
  const [fen, setFen] = useState<string>('start');
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [turn, setTurn] = useState<string>('w');
  const [history, setHistory] = useState<Move[]>([]);

  // Initialize once on mount or when initialFen strictly changes
  useEffect(() => {
    try {
      const g = new Chess();
      if (initialFen !== 'start') g.load(initialFen);
      gameRef.current = g;
      syncState();
    } catch (e) {
      console.error("useChessGame: Invalid initial FEN", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFen]);

  const syncState = useCallback(() => {
    const g = gameRef.current;
    setFen(g.fen());
    setIsGameOver(g.isGameOver());
    setTurn(g.turn());
    setHistory(g.history({ verbose: true }) as Move[]);
  }, []);

  const makeMove = useCallback((moveDetails: { from: string; to: string; promotion?: string }): Move | null => {
    try {
      const move = gameRef.current.move({
        from: moveDetails.from,
        to: moveDetails.to,
        promotion: moveDetails.promotion || 'q',
      });
      if (move) {
        syncState();
        return move;
      }
    } catch (e) {
      // Invalid move
    }
    return null;
  }, [syncState]);

  const loadFen = useCallback((newFen: string) => {
    try {
      const g = new Chess();
      if (newFen !== 'start') g.load(newFen);
      gameRef.current = g;
      syncState();
      return true;
    } catch (e) {
      return false;
    }
  }, [syncState]);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const g = new Chess();
      g.loadPgn(pgn);
      gameRef.current = g;
      syncState();
      return true;
    } catch (e) {
      return false;
    }
  }, [syncState]);

  const resetGame = useCallback(() => {
    gameRef.current = new Chess();
    syncState();
  }, [syncState]);

  const undoMove = useCallback((): Move | null => {
    const move = gameRef.current.undo();
    if (move) {
      syncState();
      return move;
    }
    return null;
  }, [syncState]);

  return {
    game: gameRef.current,
    fen,
    isGameOver,
    turn,
    history,
    makeMove,
    loadFen,
    loadPgn,
    resetGame,
    undoMove,
  };
}
