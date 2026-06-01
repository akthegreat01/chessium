const { Chess } = require('chess.js');

const game = new Chess();
const moves = game.history({ verbose: true });
console.log(moves);

game.move("e4");
const moves2 = game.history({ verbose: true });
console.log(moves2[0].before);
console.log(moves2[0].after);

const tempGame = new Chess(moves2[0].before);
try {
  tempGame.move(moves2[0].san);
  console.log("Move succeeded:", tempGame.fen());
} catch(e) {
  console.error("Move failed:", e);
}
