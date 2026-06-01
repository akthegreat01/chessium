import { useState, useCallback, useMemo, useRef } from 'react';
import { Chess, Move } from 'chess.js';

function createGame(initialFen: string): Chess {
  const g = new Chess();
  if (initialFen !== 'start') {
    try {
      g.load(initialFen);
    } catch (e) {
      console.error('Invalid FEN loaded into useChessGame', e);
    }
  }
  return g;
}

export function useChessGame(initialFen: string = 'start') {
  // Single Chess instance as source of truth, stored in a ref.
  // A version counter triggers React re-renders.
  const gameRef = useRef<Chess | null>(null);
  if (gameRef.current === null) {
    gameRef.current = createGame(initialFen);
  }

  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion(v => v + 1), []);

  // Derived values — recalculate when version changes
  const game = gameRef.current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fen = useMemo(() => game.fen(), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isGameOver = useMemo(() => game.isGameOver(), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const turn = useMemo(() => game.turn(), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const history = useMemo(() => game.history({ verbose: true }) as Move[], [version]);

  const makeMove = useCallback((moveDetails: { from: string; to: string; promotion?: string }): Move | null => {
    try {
      const move = gameRef.current!.move({
        from: moveDetails.from,
        to: moveDetails.to,
        promotion: moveDetails.promotion || 'q',
      });
      if (move) {
        bump();
        return move;
      }
    } catch (e) {
      // Invalid move
    }
    return null;
  }, [bump]);

  const loadFen = useCallback((newFen: string) => {
    try {
      const g = new Chess();
      g.load(newFen);
      gameRef.current = g;
      bump();
      return true;
    } catch (e) {
      return false;
    }
  }, [bump]);

  const loadPgn = useCallback((pgn: string) => {
    try {
      const g = new Chess();
      g.loadPgn(pgn);
      gameRef.current = g;
      bump();
      return true;
    } catch (e) {
      return false;
    }
  }, [bump]);

  const resetGame = useCallback(() => {
    gameRef.current = new Chess();
    bump();
  }, [bump]);

  const undoMove = useCallback((): Move | null => {
    const move = gameRef.current!.undo();
    if (move) {
      bump();
      return move;
    }
    return null;
  }, [bump]);

  return {
    game,
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
