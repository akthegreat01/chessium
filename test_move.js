const { Chess } = require("chess.js");
const g = new Chess();
try {
  g.move({ from: "e2", to: "e4", promotion: "p" });
  console.log("Success");
} catch(e) {
  console.log("Error:", e.message);
}
