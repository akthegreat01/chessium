const { Worker } = require('worker_threads');

const worker = new Worker(`
  const { parentPort } = require('worker_threads');
  parentPort.on('message', (msg) => {
    if (msg === 'uci') {
      parentPort.postMessage('uciok');
    } else if (msg === 'isready') {
      parentPort.postMessage('readyok');
    } else if (msg.startsWith('position fen')) {
      // Simulate checkmate
    } else if (msg.startsWith('go depth')) {
      parentPort.postMessage('info depth 0 score mate 0');
      parentPort.postMessage('bestmove (none)');
    }
  });
`, { eval: true });

worker.on('message', (msg) => {
  console.log(msg);
});
worker.postMessage('uci');
