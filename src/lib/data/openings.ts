export interface OpeningMove {
  move: string;
  fen: string;
  note: string;
}

export interface OpeningData {
  slug: string;
  name: string;
  eco: string;
  movesText: string;
  fen: string;
  description: string;
  historicalContext: string;
  strategicGoals: string;
  moves: OpeningMove[];
}

export const OPENINGS: OpeningData[] = [
  {
    slug: "sicilian-defense",
    name: "Sicilian Defense",
    eco: "B20 - B99",
    movesText: "1. e4 c5",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    description: "The most popular and best-scoring response to White's first move 1.e4.",
    historicalContext: "The Sicilian Defense is one of the oldest and most thoroughly analyzed chess openings in history. It was first recorded in the late 16th century by the Italian chess players Giulio Cesare Polerio and Gioachino Greco. However, it wasn't until the mid-20th century, championed by aggressive world champions like Garry Kasparov and Bobby Fischer, that it cemented its reputation as the ultimate weapon to play for a win with the black pieces. Today, it accounts for nearly 20% of all games played between masters.",
    strategicGoals: "By playing 1...c5, Black immediately unbalances the pawn structure. Unlike 1...e5, which creates a symmetrical center, the Sicilian introduces dynamic tension. Black voluntarily trades a flank pawn (the c-pawn) for White's central d-pawn, granting Black a structural advantage in the center. In return, White typically gains a lead in development and dangerous attacking chances on the Kingside, leading to sharp, double-edged middlegames.",
    moves: [
      { move: "1. e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", note: "White stakes a claim in the center and opens lines for the Queen and Bishop." },
      { move: "1... c5", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2", note: "Black fights for the d4 square immediately, unbalancing the position and creating an asymmetrical pawn structure." },
      { move: "2. Nf3", fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", note: "White develops the Knight to control d4 and e5, preparing to break the center." },
      { move: "2... d6", fen: "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", note: "Black controls e5 and prepares to develop the Queenside." },
    ]
  },
  {
    slug: "ruy-lopez",
    name: "Ruy Lopez",
    eco: "C60 - C99",
    movesText: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    description: "A classical opening emphasizing long-term positional pressure and rapid development.",
    historicalContext: "Named after the 16th-century Spanish priest Ruy López de Segura, who systematically analyzed the opening in his 1561 book 'Libro del Ajedrez'. The Ruy Lopez is arguably the most fundamental chess opening, often referred to as the 'Spanish Game'. It is considered essential learning for players of all levels because it teaches core principles of piece activity, pawn structure, and long-term planning. It remains a staple in World Championship matches to this day.",
    strategicGoals: "The move 3.Bb5 puts immediate pressure on the knight that defends Black's e5 pawn. White's strategic goals involve preparing the d4 pawn break to challenge the center, castling quickly, and creating enduring positional pressure. Black has many defenses (the Berlin, the Morphy Defense, the Marshall Attack), leading to a vast variety of rich pawn structures, typically characterized by closed or semi-closed centers where maneuvering is key.",
    moves: [
      { move: "1. e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", note: "White controls the center." },
      { move: "1... e5", fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2", note: "Black responds symmetrically, staking their own claim." },
      { move: "2. Nf3", fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", note: "White attacks e5 and develops." },
      { move: "2... Nc6", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", note: "Black defends e5 and develops a piece." },
      { move: "3. Bb5", fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", note: "The defining move of the Ruy Lopez, indirectly pressuring e5 by attacking its defender." },
    ]
  },
  {
    slug: "caro-kann-defense",
    name: "Caro-Kann Defense",
    eco: "B10 - B19",
    movesText: "1. e4 c6",
    fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    description: "A solid, resilient opening for Black that aims for a superior endgame structure.",
    historicalContext: "The opening bears the names of Horatio Caro, an English player, and Marcus Kann, an Austrian, who analyzed it in the late 19th century. While initially viewed as somewhat passive compared to the explosive Sicilian Defense, the Caro-Kann has proven to be incredibly robust. It was a favorite weapon of former World Champion Anatoly Karpov, who famously used it to neutralize attacking players by steering games into highly technical, favorable endgames.",
    strategicGoals: "With 1...c6, Black prepares to challenge the center with 2...d5 while maintaining a solid pawn structure. Unlike the French Defense (1...e6), the Caro-Kann allows Black to smoothly develop their light-squared bishop before committing pawns to the center. Black's primary objective is to survive the middlegame with a better pawn structure and leverage that advantage in the endgame.",
    moves: [
      { move: "1. e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", note: "White claims central space." },
      { move: "1... c6", fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", note: "Black prepares the d5 push while keeping the e-file closed and the light-squared bishop's diagonal open." },
      { move: "2. d4", fen: "rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2", note: "White establishes a classical pawn center." },
      { move: "2... d5", fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3", note: "Black strikes at the center immediately." },
    ]
  },
  {
    slug: "french-defense",
    name: "French Defense",
    eco: "C00 - C19",
    movesText: "1. e4 e6",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    description: "A counter-attacking opening leading to complex, blocked pawn structures.",
    historicalContext: "The French Defense gained its name after a correspondence match in 1834 between the cities of London and Paris, where the Parisian players successfully employed 1...e6. It has been championed by legendary players like Mikhail Botvinnik and Viktor Korchnoi. The opening is known for its strategic depth, demanding a strong understanding of closed positions and timely pawn breaks.",
    strategicGoals: "Black's 1...e6 prepares 2...d5 to challenge White's e4 pawn. This often results in a locked pawn structure (White pawns on d4/e5, Black pawns on d5/e6). Black's main problem is their 'bad' light-squared bishop on c8, blocked by its own pawns. In return, Black gets an incredibly solid position and excellent counter-attacking chances, primarily targeting White's pawn chain with breaks like ...c5 and ...f6.",
    moves: [
      { move: "1. e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", note: "White's standard central opening." },
      { move: "1... e6", fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", note: "Black prepares to strike with d5, establishing a solid foundation." },
      { move: "2. d4", fen: "rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2", note: "White seizes full control of the center." },
      { move: "2... d5", fen: "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq d6 0 3", note: "Black immediately challenges White's central dominance." },
    ]
  },
  {
    slug: "italian-game",
    name: "Italian Game",
    eco: "C50 - C59",
    movesText: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    description: "An aggressive opening targeting Black's weakest square, f7, right from the start.",
    historicalContext: "The Italian Game is the oldest recorded chess opening, mentioned in the Göttingen manuscript around 1490. It was heavily analyzed by 16th and 17th-century Italian masters like Greco. For centuries, it was the default way to play chess. While it faded slightly in popularity at the elite level during the 20th century in favor of the Ruy Lopez, modern computer analysis and the 'Giuoco Pianissimo' (Very Quiet Game) variations have brought it roaring back into top-level play.",
    strategicGoals: "The bishop on c4 places immediate pressure on f7, traditionally Black's weakest square since it is defended only by the King. The Italian Game can lead to explosive tactical struggles (like the Evans Gambit or the Fried Liver Attack) or slow, maneuvering positional games (the Giuoco Pianissimo). White aims to prepare the c3-d4 pawn break or build a kingside attack while keeping pieces harmoniously developed.",
    moves: [
      { move: "1. e4", fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", note: "Controlling the center." },
      { move: "1... e5", fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2", note: "Symmetrical central control." },
      { move: "2. Nf3", fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2", note: "Attacking e5." },
      { move: "2... Nc6", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", note: "Defending e5." },
      { move: "3. Bc4", fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3", note: "The Italian bishop actively eyes the vulnerable f7 pawn." },
    ]
  }
];

export function getOpeningBySlug(slug: string): OpeningData | undefined {
  return OPENINGS.find(o => o.slug === slug);
}
