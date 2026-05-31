import { useState, useCallback, useMemo } from 'react';
import { Chess, Move } from 'chess.js';

export function useChessGame(initialFen: string = 'start') {
  const [game, setGame] = useState(() => {
    const g = new Chess();
    if (initialFen !== 'start') {
      try {
        g.load(initialFen);
      } catch (e) {
        console.error('Invalid FEN loaded into useChessGame', e);
      }
    }
    return g;
  });

  const fen = useMemo(() => game.fen(), [game]);
  const isGameOver = useMemo(() => game.isGameOver(), [game]);
  const turn = useMemo(() => game.turn(), [game]);
  const history = useMemo(() => game.history({ verbose: true }) as Move[], [game]);

  const makeMove = useCallback((moveDetails: { from: string; to: string; promotion?: string }) => {
    const gameCopy = new Chess(game.fen());
    try {
      const move = gameCopy.move({
        from: moveDetails.from,
        to: moveDetails.to,
        promotion: moveDetails.promotion || 'q',
      });
      if (move) {
        setGame(gameCopy);
        return move;
      }
    } catch (e) {
      // Invalid move
      return null;
    }
    return null;
  }, [game]);

  const loadFen = useCallback((newFen: string) => {
    const gameCopy = new Chess();
    try {
      gameCopy.load(newFen);
      setGame(gameCopy);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const loadPgn = useCallback((pgn: string) => {
    const gameCopy = new Chess();
    try {
      gameCopy.loadPgn(pgn);
      setGame(gameCopy);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const resetGame = useCallback(() => {
    setGame(new Chess());
  }, []);

  const undoMove = useCallback(() => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.undo();
    if (move) {
      setGame(gameCopy);
    }
    return move;
  }, [game]);

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
