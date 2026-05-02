export interface Opening {
  name: string;
  pgn: string;
  fen: string;
}

export const OPENINGS: Opening[] = [
  { name: "Sicilian Defense", pgn: "1. e4 c5", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2" },
  { name: "French Defense", pgn: "1. e4 e6", fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2" },
  { name: "Ruy Lopez", pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5", fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" },
  { name: "Caro-Kann Defense", pgn: "1. e4 c6", fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2" },
  { name: "Italian Game", pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3" },
  { name: "Queen's Gambit", pgn: "1. d4 d5 2. c4", fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2" },
  { name: "King's Indian Defense", pgn: "1. d4 Nf6 2. c4 g6", fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3" },
  { name: "Scandinavian Defense", pgn: "1. e4 d5", fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2" },
  { name: "English Opening", pgn: "1. c4", fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1" },
  { name: "Reti Opening", pgn: "1. Nf3", fen: "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1" },
  { name: "Scotch Game", pgn: "1. e4 e5 2. Nf3 Nc6 3. d4", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3 0 3" },
  { name: "London System", pgn: "1. d4 d5 2. Bf4", fen: "rnbqkbnr/ppp1pppp/8/3p4/5B2/3P4/PP2PPPP/RN1QKBNR b KQkq - 1 2" },
];

export function getOpeningName(fen: string): string | null {
  // Simple check: compare the FEN (first few parts)
  const normalizedFen = fen.split(' ').slice(0, 3).join(' ');
  for (const opening of OPENINGS) {
    if (opening.fen.startsWith(normalizedFen)) {
      return opening.name;
    }
  }
  return null;
}
