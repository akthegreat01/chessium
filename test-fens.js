const { Chess } = require("chess.js");
const fens = [
"r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
"4k3/R7/4K3/8/8/8/8/8 w - - 0 1",
"rnbqkbnr/ppppp2p/8/5pp1/4P2P/8/PPPP1PP1/RNBQKBNR w KQkq - 0 3",
"r1bq2r1/b4pk1/p1pp1p2/1p2pP2/1P2P1PB/3P4/1PPQ2P1/R3K2R w - - 0 1",
"5rk1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
"rnbq1rk1/pppp1ppp/8/4P3/2B1n3/8/PPP2PPP/RNBQK2R w KQ - 1 7",
"r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 5",
"8/8/8/8/8/1k6/1r6/R2K4 w - - 0 1",
"8/8/8/8/4k3/4p3/8/4K3 w - - 0 1"
];
let errors = 0;
for (const fen of fens) {
  try {
    const chess = new Chess();
    chess.load(fen);
  } catch(e) {
    console.error("Failed to load FEN:", fen, e.message);
    errors++;
  }
}
console.log("Total errors:", errors);
