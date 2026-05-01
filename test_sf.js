const Worker = require('worker_threads').Worker;
const path = require('path');
const sf = new Worker(path.join(__dirname, 'public/stockfish.js'));
sf.on('message', (msg) => {
  console.log('SF:', msg);
  if (msg.includes('bestmove')) process.exit(0);
});
sf.postMessage('uci');
setTimeout(() => {
  sf.postMessage('position fen 4k3/4Q3/4K3/8/8/8/8/8 b - - 0 1');
  sf.postMessage('go movetime 500');
}, 500);
