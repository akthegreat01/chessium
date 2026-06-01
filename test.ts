import { Chess } from 'chess.js';
import { puzzles } from './src/lib/puzzles/data';

puzzles.forEach(p => {
  try {
    const c = new Chess(p.fen);
    console.log("OK", p.id);
  } catch (e: any) {
    console.log("FAIL", p.id, e.message);
  }
});
