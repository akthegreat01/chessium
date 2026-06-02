const { Chess } = require('chess.js');
const c = new Chess();
c.loadPgn('e4 e5 Nf3 Nc6 d4 exd4 Bc4 Nf6 e5 d5 Bb5 Ne4 Nxd4 Bd7 Bxc6 bxc6 O-O Be7 f3 Nc5 Nd2 O-O N2b3 Ne6 Be3 c5 Nxe6 fxe6 Nxc5 c6 Qd2 Bc8 a4 Rf5 Kh1 Rxe5 Bd4 Rh5 Qe2 Bxc5 Bxc5 Qh4 Bd6 Bd7 Qf2 Qg5 Qg3 Qh6 Rae1 Re8 Bf4 Qf6 Be5 Qh6 Bf4 Qf6 Be5 Qf7 Bd4 Rh4 Bxa7 Rxa4 Bc5 Rc4 Qd6 Rxc2 b4 h5 Re5 g6 Rg5 Kh7 h4 Rc4 Bf2 Kh6 Be3 Kh7 Bf2 Rc4 Kg1 Bc8 Re1 Qf4 Qxc6 Rf8 Bc5 Qd2 Rge5 Rf6 Qxc8 d4 Qd7+ Kh6 R5e2 Qf4 Re4 Qd2 Qd8 Kg7 Bd6 Rf5 R4e2 Qc3 Qd7+ Rf7 Qxe6 d3 Be5+ Kh6 Bxc3 dxe2 Qxc4');
const m = "f7f6";
try {
  c.move(m);
  console.log("Success with string!");
} catch(e) {
  console.log("Failed with string:", e.message);
  const obj = { from: m.substring(0,2), to: m.substring(2,4), promotion: m[4] };
  try {
    c.move(obj);
    console.log("Success with object!", c.fen());
  } catch(e) {
    console.log("Failed with object:", e.message);
  }
}
