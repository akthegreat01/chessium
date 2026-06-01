import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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

  const gameRef = useRef(game);
  
  // Keep ref in sync
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  const makeMove = useCallback((moveDetails: { from: string; to: string; promotion?: string }) => {
    const gameCopy = new Chess(gameRef.current.fen());
    try {
      const move = gameCopy.move({
        from: moveDetails.from,
        to: moveDetails.to,
        promotion: moveDetails.promotion || 'q',
      });
      if (move) {
        gameRef.current = gameCopy; // Update ref synchronously
        setGame(gameCopy);          // Trigger react render
        return move;
      }
    } catch (e) {
      // Invalid move
    }
    return null;
  }, []);

  const loadFen = useCallback((newFen: string) => {
    const gameCopy = new Chess();
    try {
      gameCopy.load(newFen);
      gameRef.current = gameCopy;
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
      gameRef.current = gameCopy;
      setGame(gameCopy);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    gameRef.current = newGame;
    setGame(newGame);
  }, []);

  const undoMove = useCallback(() => {
    const gameCopy = new Chess(gameRef.current.fen());
    const move = gameCopy.undo();
    if (move) {
      gameRef.current = gameCopy; // Update ref synchronously
      setGame(gameCopy);          // Trigger react render
      return move;
    }
    return null;
  }, []);

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
