export interface Puzzle {
  id: string;
  fen: string;
  moves: string[];
  rating: number;
  theme: string;
}

export const puzzles: Puzzle[] = [
  { id: "p1", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4", moves: ["Qxf7#"], rating: 800, theme: "Mate in 1" },
  { id: "p2", fen: "r1b1k2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PqP/RNBQKR2 w Qkq - 0 6", moves: ["Bxf7+", "Kxf7", "Nxe5+"], rating: 1400, theme: "Tactical Sequence" },
  { id: "p3", fen: "6k1/1p3ppp/p7/8/1P6/P7/2r2PPP/3R2K1 w - - 0 1", moves: ["Rd8#"], rating: 900, theme: "Back Rank Mate" },
  { id: "p4", fen: "r1b1k2r/ppp2ppp/2n5/3qp3/1b1P4/5N2/PP1BPPPP/R2QKB1R w KQkq - 0 8", moves: ["Bxb4", "Nxb4", "Qa4+"], rating: 1200, theme: "Fork" },
  { id: "p5", fen: "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8", moves: ["Bg5"], rating: 1100, theme: "Pin" },
  { id: "p6", fen: "5k2/R7/5K2/8/8/8/8/8 w - - 0 1", moves: ["Ra8#"], rating: 800, theme: "Mate in 1" },
  { id: "p7", fen: "r2qk2r/ppp1bppp/2n2n2/3p4/3P2b1/2NB1N2/PPP2PPP/R1BQ1RK1 b kq - 0 8", moves: ["Nxd4", "Bxh2+", "Kxh2", "Bxd1"], rating: 1500, theme: "Discovered Attack" },
  { id: "p8", fen: "4r1k1/pp3ppp/2p5/8/3P4/6P1/PP3P1P/3R2K1 b - - 0 21", moves: ["Re2"], rating: 1100, theme: "Rook to the 7th" },
  { id: "p9", fen: "r4rk1/ppp2ppp/2nb4/3qp3/3P4/4PN2/PP1B1PPP/R2Q1RK1 w - - 0 12", moves: ["dxe5", "Nxe5", "Nxe5"], rating: 1300, theme: "Simplification" },
  { id: "p10", fen: "8/8/8/8/3k4/1R6/2K5/8 w - - 0 1", moves: ["Rb4+", "Kc3", "Rb3"], rating: 1000, theme: "Skewer" },
  { id: "p11", fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1", moves: ["Ra8#"], rating: 850, theme: "Back Rank Mate" },
  { id: "p12", fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 5", moves: ["Ng5", "O-O", "Nxf7"], rating: 1400, theme: "Fried Liver Attack Idea" },
  { id: "p13", fen: "r1b2rk1/pp1n1ppp/1q2p3/2bpP3/5P2/2N2N2/PPP3PP/1R1QKB1R b K - 0 11", moves: ["Bf2+", "Ke2", "Qe3#"], rating: 1500, theme: "Mate in 2" },
  { id: "p14", fen: "4r1k1/5ppp/8/8/8/8/3Q1PPP/6K1 w - - 0 1", moves: ["Qe3", "Rxe3", "fxe3"], rating: 1200, theme: "Deflection" },
  { id: "p15", fen: "rnbq1rk1/pppp1ppp/8/4P3/2B1n3/8/PPP2PPP/RNBQK2R w KQ - 1 7", moves: ["Qd5", "Nxf2", "O-O"], rating: 1350, theme: "Double Attack" },
  { id: "p16", fen: "r1b1k2r/pp2bppp/2n1pn2/q1pp4/3P4/2N1PN2/PPP1BPPP/R1BQ1RK1 w kq - 4 8", moves: ["Bd2", "O-O", "Nxd5"], rating: 1450, theme: "Discovered Attack" },
  { id: "p17", fen: "r3k2r/ppp2ppp/2n1bn2/2b1p3/2B1P3/2N2N2/PPP2PPP/R1BR2K1 b kq - 6 9", moves: ["Bxc4"], rating: 1000, theme: "Hanging Piece" },
  { id: "p18", fen: "rn1qk2r/ppp1bppp/4bn2/3p4/3P4/2N2N2/PPP1BPPP/R1BQK2R w KQkq - 4 7", moves: ["O-O", "O-O", "Re1"], rating: 1100, theme: "Development" },
  { id: "p19", fen: "r2qk2r/1pp1bppp/p1n1bn2/3p4/3P4/2N1BN2/PPP1BPPP/R2Q1RK1 b kq - 5 9", moves: ["O-O"], rating: 900, theme: "Castle" },
  { id: "p20", fen: "3r2k1/1p3ppp/8/8/8/8/1P3PPP/R5K1 w - - 0 1", moves: ["Kf1", "Kf8", "Ke2"], rating: 1200, theme: "Endgame Centralization" },
  { id: "p21", fen: "6k1/R7/8/8/8/8/1r6/6K1 b - - 0 1", moves: ["Rb1+", "Kf2", "Rb2+"], rating: 1150, theme: "Perpetual Check" },
  { id: "p22", fen: "8/p7/1p6/1K6/8/8/8/1k6 w - - 0 1", moves: ["Ka6", "Kxa7", "Kxb6"], rating: 1300, theme: "Pawn Endgame" },
  { id: "p23", fen: "rnbqkb1r/pp3ppp/2p2n2/3p4/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 6", moves: ["Bd3", "Bd6", "O-O"], rating: 1050, theme: "Opening" },
  { id: "p24", fen: "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQ1RK1 b kq - 0 6", moves: ["dxc3", "Nxc3", "d6"], rating: 1250, theme: "Italian Game" },
  { id: "p25", fen: "r1bq1rk1/ppp2ppp/2n2n2/3pp3/2B1P3/2P2N2/PPP2PPP/R1BQR1K1 w - - 0 8", moves: ["exd5", "Nxd5", "Nxe5"], rating: 1400, theme: "Center Tension" },
  { id: "p26", fen: "5rk1/5ppp/8/8/8/8/3Q1PPP/3R2K1 w - - 0 1", moves: ["Qd7", "Rfe8", "Qxe8+"], rating: 1350, theme: "Back Rank Weakness" },
  { id: "p27", fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4", moves: ["Qxf7#"], rating: 800, theme: "Scholar's Mate" },
  { id: "p28", fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4", moves: ["Kxf7"], rating: 900, theme: "Blunder Punish" },
  { id: "p29", fen: "r2qk2r/ppp1bppp/2n1bn2/3p2B1/3P4/2N2N2/PPP1BPPP/R2Q1RK1 w kq - 4 9", moves: ["Re1", "O-O", "Bd3"], rating: 1100, theme: "Positional Play" },
  { id: "p30", fen: "r3k2r/1pp1bppp/p1n1bn2/3p2B1/3P4/2N2N2/PPP1BPPP/R2QR1K1 b kq - 5 10", moves: ["h6", "Bh4", "O-O"], rating: 1150, theme: "Prophylaxis" },
  { id: "p31", fen: "r4rk1/1pp1bppp/p1n1bn2/3p2B1/3P4/2N2N2/PPP1BPPP/R2QR1K1 w - - 0 11", moves: ["a3", "Rfe8", "Bd3"], rating: 1200, theme: "Positional Play" },
  { id: "p32", fen: "r3r1k1/1pp1bppp/p1n1bn2/3p2B1/3P4/2NB1N2/PPP2PPP/R2QR1K1 b - - 1 11", moves: ["h6", "Bxf6", "Bxf6"], rating: 1250, theme: "Bishop Pair" },
  { id: "p33", fen: "r3r1k1/1pp2ppp/p1n1bb2/3p4/3P4/2NB1N2/PPP2PPP/R2QR1K1 w - - 0 12", moves: ["Ne5", "Nxd4", "Bxh7+"], rating: 1550, theme: "Greek Gift" },
  { id: "p34", fen: "r3r1k1/1pp2ppp/p1n1bb2/3pN3/3P4/2NB4/PPP2PPP/R2QR1K1 b - - 1 12", moves: ["Nxd4", "Bxh7+", "Kxh7"], rating: 1450, theme: "Tactics" },
  { id: "p35", fen: "r3r1k1/1pp2ppk/p1n1bb2/3pN3/3P4/2NB4/PPP2PPP/R2QR1K1 w - - 0 13", moves: ["Qh5+", "Kg8", "Qh7+"], rating: 1600, theme: "Mating Net" }
];

export function getDailyPuzzle(): Puzzle {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  return puzzles[dayOfYear % puzzles.length];
}
