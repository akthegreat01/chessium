export type Opening = {
  eco: string;
  name: string;
  moves: string;
  fen: string;
  category: "e4" | "d4" | "other";
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  ideas: string[];
};

export const OPENINGS_DB: Opening[] = [
  {
    eco: "C60",
    name: "Ruy Lopez",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    category: "e4",
    description: "The Ruy Lopez, also known as the Spanish Game, is one of the oldest and most popular chess openings. White develops the bishop to b5 to put pressure on the knight on c6, which defends the e5 pawn.",
    difficulty: "Intermediate",
    ideas: [
      "Control the center with e4",
      "Develop knights and bishops quickly",
      "Put pressure on Black's pawn structure",
      "Prepare to castle kingside"
    ]
  },
  {
    eco: "C50",
    name: "Italian Game",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    category: "e4",
    description: "The Italian Game is a fundamental e4 opening. White develops the bishop to c4 to eye the vulnerable f7 square. It often leads to open, tactical positions or slow positional maneuvering (Giuoco Pianissimo).",
    difficulty: "Beginner",
    ideas: [
      "Target the weak f7 pawn",
      "Rapid kingside development",
      "Control the center with c3 and d4 (often)"
    ]
  },
  {
    eco: "B20",
    name: "Sicilian Defense",
    moves: "1. e4 c5",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    category: "e4",
    description: "The Sicilian Defense is Black's most popular and aggressive response to 1. e4. Black fights for the center from the flank with the c-pawn, leading to asymmetrical and highly tactical positions.",
    difficulty: "Advanced",
    ideas: [
      "Create an asymmetrical pawn structure",
      "Fight for the center (d4 square) with the c-pawn",
      "Prepare for a sharp middlegame battle"
    ]
  },
  {
    eco: "D02",
    name: "London System",
    moves: "1. d4 d5 2. Bf4",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2",
    category: "d4",
    description: "The London System is a solid and reliable opening for White. White develops the dark-squared bishop to f4 early, establishing a strong, hard-to-break pawn pyramid in the center.",
    difficulty: "Beginner",
    ideas: [
      "Solid pawn structure (c3-d4-e3)",
      "Safe and consistent piece placement",
      "Avoids deep theoretical preparation"
    ]
  },
  {
    eco: "D06",
    name: "Queen's Gambit",
    moves: "1. d4 d5 2. c4",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
    category: "d4",
    description: "The Queen's Gambit is one of the oldest known chess openings. White offers the c-pawn to deflect Black's central d-pawn, aiming to dominate the center with e2-e4.",
    difficulty: "Intermediate",
    ideas: [
      "Challenge Black's central control immediately",
      "Gain a space advantage",
      "Develop pieces rapidly behind the central pawn mass"
    ]
  },
  {
    eco: "A00",
    name: "English Opening",
    moves: "1. c4",
    fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1",
    category: "other",
    description: "The English Opening is a flank opening where White fights for the center from the side, similar to the Sicilian Defense in reverse. It leads to highly strategic and flexible positions.",
    difficulty: "Advanced",
    ideas: [
      "Control d5 from the flank",
      "Delay central pawn commitments",
      "Often transposes into d4 openings"
    ]
  }
];
