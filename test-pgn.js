const { Chess } = require('chess.js');
async function test() {
  const res = await fetch('https://api.chess.com/pub/player/akshath2008/games/2026/05');
  const data = await res.json();
  const game = data.games[0];
  const pgn = game.pgn;
  console.log("Raw PGN length:", pgn.length);
  
  const cleanPgnString = (raw) => {
    return raw
      .replace(/\{[^}]*\}/g, '')       // Remove all {comments} including {[%clk ...]}
      .replace(/;[^\n]*/g, '')          // Remove semicolon comments
      .replace(/\d+\.{3}/g, '')         // Remove move-number ellipsis like "1..."
      .replace(/\$\d+/g, '')            // Remove NAGs (Numeric Annotation Glyphs) like $1
      .replace(/[ \t]+/g, ' ')          // Collapse spaces/tabs but keep newlines
      .trim();
  };

  const c = new Chess();
  try {
    c.loadPgn(pgn);
    console.log("Tier 1 success");
  } catch (e) {
    console.log("Tier 1 failed:", e.message);
    try {
      c.loadPgn(cleanPgnString(pgn));
      console.log("Tier 2 success");
    } catch (e2) {
      console.log("Tier 2 failed:", e2.message);
      try {
        const rawMoves = cleanPgnString(pgn.replace(/\[.*?\]/g, ''));
        c.loadPgn(rawMoves.trim());
        console.log("Tier 3 success");
      } catch (e3) {
        console.log("Tier 3 failed:", e3.message);
      }
    }
  }
}
test();
