const { Chess } = require('chess.js');
const pgn = "e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 d5 Bb5 Ne4 Nxd4 Bd7 Bxc6 bxc6 O-O Be7 f3 Nc5 Nd2 O-O N2b3 Ne6 Be3 c5 Nxe6 fxe6 Nxc5 c6 Qd2 Bc8 a4 Rf5 Kh1 Rxe5 Bd4 Rh5 Qe2 Bxc5 Bxc5 Qh4 Bd6 Bd7 Qf2 Qg5 Qg3 Qh6 Rae1 Re8 Bf4 Qf6 Be5 Qh6 Bf4 Qf6 Be5 Qf7 Bd4 Rh6 Bxa7 Rg6 Qf2 e5 f4 e4 Be3 Qf5 Kg1 Ree6 Rd1 Rh6 c4 Reg6 cxd5 cxd5 Qd2 Be6 Qa5";

const chess = new Chess();
const loaded = chess.loadPgn(pgn);
console.log("Loaded with loadPgn:", loaded);

const chess2 = new Chess();
const moves = pgn.split(" ");
for (let move of moves) {
  try {
    chess2.move(move);
  } catch (e) {
    console.log("Failed on", move, e);
    break;
  }
}
console.log("Loaded with split:", chess2.history().length);
