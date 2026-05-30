const { Chess } = require("chess.js");
const g = new Chess();
try {
  g.loadPgn("1. e4 e5");
  console.log("Success", g.history());
} catch(e) {
  console.log("Error:", e);
}
