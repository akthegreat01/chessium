import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess, Move } from 'chess.js';

export function useChessGame(initialFen: string = 'start') {
  // Lazily initialize the chess.js instance with the correct FEN
  const gameRef = useRef<Chess | null>(null);
  if (gameRef.current === null) {
    const g = new Chess();
    if (initialFen !== 'start') {
      try { g.load(initialFen); } catch (e) { console.error(e); }
    }
    gameRef.current = g;
  }

  // Explicit React State guaranteed to trigger re-renders
  const [fen, setFen] = useState<string>(gameRef.current.fen());
  const [isGameOver, setIsGameOver] = useState<boolean>(gameRef.current.isGameOver());
  const [turn, setTurn] = useState<string>(gameRef.current.turn());
  const [history, setHistory] = useState<Move[]>(gameRef.current.history({ verbose: true }) as Move[]);

  const syncState = useCallback(() => {
    const g = gameRef.current!;
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
