const { Chess } = require('chess.js');
const chess = new Chess();
chess.loadPgn('1. e4 e5 2. Nf3 Nc6');
const history = chess.history();
console.log(history);
const chess2 = new Chess();
for (const san of history) {
  chess2.move(san);
}
console.log('Success');
