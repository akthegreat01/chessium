export interface ChessOpening {
  slug: string;
  name: string;
  eco: string;
  fen: string;
  moves: string;
  description: string;
  continuations: string[];
}

export const openingsData: ChessOpening[] = [
  {
    slug: "sicilian-defense",
    name: "Sicilian Defense",
    eco: "B20",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: "1. e4 c5",
    description: "The Sicilian Defense is the most popular and best-scoring response to White's first move 1.e4. It creates an asymmetrical pawn structure, leading to complex, double-edged positions.",
    continuations: ["Nf3 (Open Sicilian)", "Nc3 (Closed Sicilian)", "c3 (Alapin Variation)"]
  },
  {
    slug: "french-defense",
    name: "French Defense",
    eco: "C00",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: "1. e4 e6",
    description: "The French Defense is a solid and resilient opening. Black immediately challenges White's control of the center with 2...d5, leading to closed and strategic struggles.",
    continuations: ["d4 d5 e5 (Advance Variation)", "d4 d5 Nd2 (Tarrasch Variation)", "d4 d5 Nc3 (Classical Variation)"]
  },
  {
    slug: "ruy-lopez",
    name: "Ruy Lopez",
    eco: "C60",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    description: "Also known as the Spanish Game, the Ruy Lopez is one of the oldest and most thoroughly analyzed openings in chess. It immediately pressures the knight defending Black's central pawn.",
    continuations: ["a6 (Morphy Defense)", "Nf6 (Berlin Defense)", "d6 (Steinitz Defense)"]
  },
  {
    slug: "italian-game",
    name: "Italian Game",
    eco: "C50",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    description: "The Italian Game is a classical opening where White develops the bishop to an active diagonal, aiming at Black's vulnerable f7 pawn while controlling the center.",
    continuations: ["Bc5 (Giuoco Piano)", "Nf6 (Two Knights Defense)"]
  },
  {
    slug: "caro-kann-defense",
    name: "Caro-Kann Defense",
    eco: "B10",
    fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    moves: "1. e4 c6",
    description: "The Caro-Kann Defense is a robust and resilient opening. Black prepares to challenge the center with d5, similar to the French Defense, but without blocking the light-squared bishop.",
    continuations: ["d4 d5 e5 (Advance Variation)", "d4 d5 exd5 cxd5 (Exchange Variation)"]
  },
  {
    slug: "queens-gambit",
    name: "Queen's Gambit",
    eco: "D06",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    moves: "1. d4 d5 2. c4",
    description: "The Queen's Gambit is one of the most prestigious and historically significant openings. White offers a wing pawn to gain control of the center and create active piece play.",
    continuations: ["e6 (Queen's Gambit Declined)", "dxc4 (Queen's Gambit Accepted)"]
  },
  {
    slug: "english-opening",
    name: "English Opening",
    eco: "A10",
    fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1",
    moves: "1. c4",
    description: "The English Opening is a flexible, flank opening. By advancing the c-pawn, White controls the d5 square without committing the central d- or e-pawns, leading to complex positional struggles.",
    continuations: ["e5 (Reversed Sicilian)", "Nf6 (Anglo-Indian Defense)"]
  }
];
