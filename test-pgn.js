const { Chess } = require('chess.js');
const chess = new Chess();
const ok = chess.loadPgn("1. e4 e5 2. Bc4 Bc5 3. Qh5 Nf6 4. Qxf7#");
console.log("Loaded:", ok);
console.log("History:", chess.history());
