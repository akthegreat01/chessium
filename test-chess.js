const { Chess } = require("chess.js");
const pgn = "e4 c5 Bc4 Nc6 a4 Ne5 Ba2 d6 f4 Bg4 Ne2 Ng6 h3 Nxf4 hxg4 Nxg2+ Kf1 Nf6 Kxg2 Nxg4 Nf4 Ne5 d4 cxd4 Qxd4 e6 Nc3 Qg5+ Kf2 Ng4+ Kf1 Be7 Rg1 Nh2+ Kf2";
const moves = pgn.split(" ");
const chess = new Chess();
for (let i = 0; i < 34; i++) {
  try {
    chess.move(moves[i]);
  } catch(e) {
    console.error("Failed on move", i, moves[i], e.message);
    break;
  }
}
console.log("Final FEN:", chess.fen());
