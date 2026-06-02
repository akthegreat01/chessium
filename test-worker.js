const { Worker } = require('worker_threads');
const path = require('path');

const workerPath = path.resolve('./public/stockfish/stockfish.js');
const worker = new Worker(workerPath);

worker.on('message', (msg) => {
  console.log("[SF]", msg);
});

worker.postMessage("uci");
setTimeout(() => {
  worker.postMessage("ucinewgame");
  worker.postMessage("position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  worker.postMessage("go depth 14");
}, 500);

setTimeout(() => {
  console.log("SENDING STOP...");
  worker.postMessage("stop");
  
  worker.postMessage("ucinewgame");
  worker.postMessage("position fen rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1");
  worker.postMessage("go depth 14");
}, 1000);

setTimeout(() => {
  process.exit(0);
}, 3000);
