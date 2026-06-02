export type PuzzleData = {
  id: string;
  fen: string;
  solution: string[];
  rating: number;
  themes: string[];
};

export const PUZZLES_DB: Record<string, PuzzleData[]> = {
  "Mate in 1": [
    {
      id: "mate_1_1",
      fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4",
      solution: ["f3f7"],
      rating: 800,
      themes: ["Mate in 1", "Scholar's Mate"]
    },
    {
      id: "mate_1_2",
      fen: "4k3/R7/4K3/8/8/8/8/8 w - - 0 1",
      solution: ["a7a8"],
      rating: 900,
      themes: ["Mate in 1", "Endgame"]
    },
    {
      id: "mate_1_3",
      fen: "rnbqkbnr/ppppp2p/8/5pp1/4P2P/8/PPPP1PP1/RNBQKBNR w KQkq - 0 3",
      solution: ["d1h5"],
      rating: 600,
      themes: ["Mate in 1", "Fool's Mate"]
    }
  ],
  "Mate in 2": [
    {
      id: "mate_2_1",
      fen: "r1bq2r1/b4pk1/p1pp1p2/1p2pP2/1P2P1PB/3P4/1PPQ2P1/R3K2R w - - 0 1",
      solution: ["d2h6", "g7h6", "h4f6"],
      rating: 1400,
      themes: ["Mate in 2", "Sacrifice"]
    },
    {
      id: "mate_2_2",
      fen: "5rk1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
      solution: ["a1a8", "f8a8"],
      rating: 1100,
      themes: ["Mate in 2", "Back Rank Mate"]
    }
  ],
  "Fork": [
    {
      id: "fork_1",
      fen: "rnbq1rk1/pppp1ppp/8/4P3/2B1n3/8/PPP2PPP/RNBQK2R w KQ - 1 7",
      solution: ["d1d5", "e4g5", "d5a8"],
      rating: 1100,
      themes: ["Fork"]
    }
  ],
  "Pin": [
    {
      id: "pin_1",
      fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1b2P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 5",
      solution: ["c3d5", "f6d5", "e4d5"],
      rating: 1300,
      themes: ["Pin"]
    }
  ],
  "Skewer": [
    {
      id: "skewer_1",
      fen: "8/8/8/8/8/1k6/1r6/R2K4 w - - 0 1",
      solution: ["a1a8", "b2b1", "d1d2"],
      rating: 1200,
      themes: ["Skewer"]
    }
  ],
  "Endgame": [
    {
      id: "endgame_1",
      fen: "8/8/8/8/4k3/4p3/8/4K3 w - - 0 1",
      solution: ["e1e2", "e4d4", "e2e1"],
      rating: 1500,
      themes: ["Endgame"]
    }
  ]
};

// Helper to pick a random puzzle from a theme
export function getRandomPuzzle(theme: string): PuzzleData | null {
  const puzzles = PUZZLES_DB[theme];
  if (!puzzles || puzzles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

// Helper to get a random puzzle from ALL themes
export function getAnyRandomPuzzle(): PuzzleData | null {
  const allThemes = Object.values(PUZZLES_DB).flat();
  if (allThemes.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * allThemes.length);
  return allThemes[randomIndex];
}
