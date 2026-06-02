const { Chess } = require("chess.js");
const fen = "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4";
try {
  const chess = new Chess();
  chess.load(fen);
  console.log("Success:", chess.fen());
} catch(e) {
  console.log("Error:", e.message);
}
