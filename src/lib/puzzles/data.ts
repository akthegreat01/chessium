export interface Puzzle {
  id: string;
  fen: string;
  moves: string[]; // sequence of correct moves in SAN (Standard Algebraic Notation)
  rating: number;
  theme: string;
}

export const puzzles: Puzzle[] = [
  {
    id: "p1",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4", 
    moves: ["Qxf7#"], 
    rating: 800,
    theme: "Mate in 1"
  },
  {
    id: "p2",
    fen: "r1b1k2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PqP/RNBQKR2 w Qkq - 0 6",
    moves: ["Bxf7+", "Kxf7", "Nxe5+"],
    rating: 1400,
    theme: "Tactical Sequence"
  }
];

export function getDailyPuzzle(): Puzzle {
  // Simple logic to rotate puzzle based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return puzzles[dayOfYear % puzzles.length];
}
