const { Chess } = require('chess.js');
const fs = require('fs');

const file = fs.readFileSync('src/lib/chess/openings.ts', 'utf8');
const openingsMatch = file.match(/const OPENINGS: Opening\[\] = (\[[\s\S]*?\]);/);
if (openingsMatch) {
  const openings = eval(openingsMatch[1]);
  for (const op of openings) {
    const chess = new Chess();
    const sans = op.moves.split(/\s+/).filter(t => !t.includes('.'));
    for (const san of sans) {
      try {
        chess.move(san);
      } catch (e) {
        console.error("Invalid move in", op.name, ":", san);
      }
    }
  }
  console.log("Done checking openings");
}
