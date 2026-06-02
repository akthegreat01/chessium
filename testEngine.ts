import { ChessEngine } from './src/lib/analyzer/engine';
import { Chess } from 'chess.js';

async function run() {
  const engine = new ChessEngine();
  const game = new Chess();
  
  // Need to mock the worker for Node.js
  // Let's just use the stockfish binary directly or use a mock worker
}
run();
