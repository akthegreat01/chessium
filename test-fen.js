const { Chess } = require('chess.js');

const pgn = "1. e4 e5 2. Nf3 f6 3. Nc3 Bc5 4. d4 exd4 5. Nxd4 Qe7 6. Nf5 Qf7 7. Bf4 Bb4 8. Bxc7 Nc6 9. Qd6 g6";
const game = new Chess();
game.loadPgn(pgn);
const history = game.history({ verbose: true });

const currentIndex = 16; // Move 9 Black is index 17, so 9 White is 16

const tempGame = new Chess();
if (history.length > 0 && currentIndex >= 0) {
  for (let i = 0; i <= currentIndex; i++) {
    try {
      tempGame.move(history[i].san || history[i]);
    } catch (e) {
      console.warn("Failed to apply move to tempGame:", history[i]);
    }
  }
}
console.log("Result FEN:", tempGame.fen());
