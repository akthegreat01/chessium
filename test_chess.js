const { Chess } = require("chess.js");
const g = new Chess();
try {
  const move = g.move({ from: "e2", to: "e4", promotion: "q" });
  console.log("Move succeeded:", move);
} catch (e) {
  console.error("Move failed:", e);
}
