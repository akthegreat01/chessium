const { Chess } = require('chess.js');
const g = new Chess();
g.move('e4');
g.move('e5');
const history = g.history({verbose: true});
let currentIndex = -1;

function getCurrentFen(history, currentIndex) {
    if (history.length === 0) return "empty";
    const startingFen = history[0].before || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    if (currentIndex === -1) return startingFen;
    const tempGame = new Chess(startingFen);
    for (let i = 0; i <= currentIndex; i++) {
      try {
        tempGame.move(history[i].san || history[i]);
      } catch (e) {
        return history[currentIndex]?.after || startingFen;
      }
    }
    return tempGame.fen();
}

console.log("Index -1:", getCurrentFen(history, -1));
console.log("Index 0:", getCurrentFen(history, 0));
console.log("Index 1:", getCurrentFen(history, 1));
