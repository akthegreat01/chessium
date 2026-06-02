import { useState, useCallback, useRef, useEffect } from 'react';
import { Chess, Move } from 'chess.js';
import { robustLoadPgn } from '@/lib/chess/pgnParser';

export interface UseChessProps {
  initialFen?: string;
  initialPgn?: string;
}

export function useChess({ initialFen = 'start', initialPgn }: UseChessProps = {}) {
  // 1. Maintain a single mutable Chess instance for O(1) move calculations
  const gameRef = useRef<Chess | null>(null);

  // Lazy Initialization
  if (gameRef.current === null) {
    if (initialPgn) {
      try {
        gameRef.current = robustLoadPgn(initialPgn);
      } catch (e) {
        console.error("Failed to init with PGN, falling back to start.", e);
        gameRef.current = new Chess();
      }
    } else {
      gameRef.current = new Chess();
      if (initialFen !== 'start') {
        try {
          gameRef.current.load(initialFen);
        } catch (e) {
          console.error("Failed to init with FEN, falling back to start.", e);
        }
      }
    }
  }

  // 2. React State perfectly synchronized with the mutable instance
  const [fen, setFen] = useState<string>(() => gameRef.current!.fen());
  const [history, setHistory] = useState<Move[]>(() => gameRef.current!.history({ verbose: true }) as Move[]);
  const [turn, setTurn] = useState<'w' | 'b'>(() => gameRef.current!.turn());
  const [isGameOver, setIsGameOver] = useState<boolean>(() => gameRef.current!.isGameOver());

  // 3. Synchronization Helper
  const syncState = useCallback(() => {
    const game = gameRef.current!;
    setFen(game.fen());
    setHistory(game.history({ verbose: true }) as Move[]);
    setTurn(game.turn());
    setIsGameOver(game.isGameOver());
  }, []);

  // 4. Expose robust actions
  const makeMove = useCallback((moveDetails: { from: string; to: string; promotion?: string } | string): Move | null => {
    try {
      const move = gameRef.current!.move(moveDetails);
      if (move) {
        syncState();
        return move;
      }
    } catch (e) {
      // Invalid move
    }
    return null;
  }, [syncState]);

  const undoMove = useCallback((): Move | null => {
    const move = gameRef.current!.undo();
    if (move) syncState();
    return move;
  }, [syncState]);

  const loadFen = useCallback((newFen: string) => {
    try {
      if (newFen === 'start') {
        gameRef.current!.reset();
      } else {
        gameRef.current!.load(newFen);
      }
      syncState();
      return true;
    } catch (e) {
      return false;
    }
  }, [syncState]);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const loadedGame = robustLoadPgn(pgn);
      // We must copy state into our ref instance
      gameRef.current!.loadPgn(loadedGame.pgn());
      syncState();
      return true;
    } catch (e) {
      return false;
    }
  }, [syncState]);

  const resetGame = useCallback(() => {
    gameRef.current!.reset();
    syncState();
  }, [syncState]);

  return {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    get game() { return gameRef.current as Chess; }, // Expose the raw instance via getter
    fen,
    history,
    turn,
    isGameOver,
    makeMove,
    undoMove,
    loadFen,
    loadPgn,
    resetGame,
    syncState
  };
}
