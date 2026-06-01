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

  const game = gameRef.current!;

  // 2. React State perfectly synchronized with the mutable instance
  const [fen, setFen] = useState<string>(game.fen());
  const [history, setHistory] = useState<Move[]>(game.history({ verbose: true }) as Move[]);
  const [turn, setTurn] = useState<'w' | 'b'>(game.turn());
  const [isGameOver, setIsGameOver] = useState<boolean>(game.isGameOver());

  // 3. Synchronization Helper
  const syncState = useCallback(() => {
    setFen(game.fen());
    setHistory(game.history({ verbose: true }) as Move[]);
    setTurn(game.turn());
    setIsGameOver(game.isGameOver());
  }, [game]);

  // 4. Expose robust actions
  const makeMove = useCallback((moveDetails: { from: string; to: string; promotion?: string } | string): Move | null => {
    try {
      const move = game.move(moveDetails);
      if (move) {
        syncState();
        return move;
      }
    } catch (e) {
      // Invalid move
    }
    return null;
  }, [game, syncState]);

  const undoMove = useCallback((): Move | null => {
    const move = game.undo();
    if (move) syncState();
    return move;
  }, [game, syncState]);

  const loadFen = useCallback((newFen: string) => {
    try {
      if (newFen === 'start') {
        game.reset();
      } else {
        game.load(newFen);
      }
      syncState();
      return true;
    } catch (e) {
      return false;
    }
  }, [game, syncState]);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const loadedGame = robustLoadPgn(pgn);
      // We must copy state into our ref instance
      game.loadPgn(loadedGame.pgn());
      syncState();
      return true;
    } catch (e) {
      return false;
    }
  }, [game, syncState]);

  const resetGame = useCallback(() => {
    game.reset();
    syncState();
  }, [game, syncState]);

  return {
    game, // Expose the raw instance for advanced reads (do NOT mutate directly)
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
