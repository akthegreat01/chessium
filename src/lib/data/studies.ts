export type StudyStep = {
  fen: string;
  title: string;
  content: string;
  instruction?: string;
  expectedMove?: string; // The move the user must play (e.g. "e4") to proceed
};

export type Study = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  isLocked: boolean;
  steps: StudyStep[];
};

export const studiesData: Study[] = [
  {
    id: "1",
    slug: "basic-principles",
    title: "Basic Principles & The Center",
    description: "Master the center, develop your pieces, and ensure king safety. The foundation of every grandmaster.",
    icon: "Shield",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    isLocked: false,
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        title: "1. Control the Center",
        content: "The most important principle in chess openings is to fight for the central squares (e4, d4, e5, d5). Pieces placed in the center control more of the board and restrict your opponent's options. Pawns are the foot soldiers that stake your initial claim.",
        instruction: "Play your King's Pawn forward two squares to stake a claim in the center.",
        expectedMove: "e4"
      },
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        title: "2. Knights before Bishops",
        content: "Generally, knights are developed before bishops. This is because a knight's optimal square is usually obvious early on (f3 or c3), while a bishop's best placement depends on how the pawn structure develops.",
        instruction: "Develop your kingside knight to attack Black's center pawn.",
        expectedMove: "Nf3"
      },
      {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        title: "3. Prepare King Safety",
        content: "A king stuck in the center is highly vulnerable to attacks. By developing your kingside bishop, you clear the path to castle your king to safety while developing a piece to an active diagonal.",
        instruction: "Develop your light-squared bishop to its most active square, targeting f7.",
        expectedMove: "Bc4"
      },
      {
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        title: "4. Castling",
        content: "Castling is a special move that achieves two goals at once: it tucks your King away into a safe corner behind a wall of pawns, and it brings your Rook out of the corner and into the game.",
        instruction: "Castle kingside to secure your king.",
        expectedMove: "O-O"
      },
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 7 6",
        title: "5. Connecting the Rooks",
        content: "Once you have developed your minor pieces and castled, the final step of the opening is to move your Queen slightly off the back rank. This 'connects' your Rooks, allowing them to coordinate in the center files.",
        instruction: "Move your d-pawn to d3 to open lines for your dark-squared bishop, solidifying your center.",
        expectedMove: "d3"
      }
    ]
  },
  {
    id: "2",
    slug: "tactical-motifs",
    title: "Tactical Motifs & Patterns",
    description: "Forks, pins, skewers, and discovered attacks. Learn how to win material by force.",
    icon: "Swords",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    isLocked: false,
    steps: [
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
        title: "The Absolute Pin",
        content: "A pin occurs when an attacked piece cannot move without exposing a more valuable piece behind it. An 'absolute pin' is when the piece behind is the King—meaning it is literally illegal for the pinned piece to move.",
        instruction: "Can you spot a pin opportunity to paralyze Black's f6 Knight?",
        expectedMove: "Bg5"
      },
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/P1N2N2/1PPP1PPP/R1BQK2R b KQkq - 0 5",
        title: "The Bishop Pair Advantage",
        content: "In open positions, having both Bishops is a significant advantage over a Bishop and a Knight. Here, White attacks Black's Bishop.",
        instruction: "How does Black maintain their Bishop by retreating safely?",
        expectedMove: "Ba5"
      },
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 3 4",
        title: "The Fork",
        content: "A fork is a double attack, usually by a Knight or Pawn, attacking two valuable pieces simultaneously. Here, White's Knight and Bishop gang up on f7, threatening a devastating fork.",
        instruction: "Black is in deep trouble. What is the only move to block the attack on f7?",
        expectedMove: "d5"
      },
      {
        fen: "r1bqkb1r/ppp2ppp/2n2n2/3Pp1N1/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 5",
        title: "The Discovered Attack",
        content: "A discovered attack happens when moving a piece unveils an attack from a piece behind it. It's often highly forcing because the moving piece can create a threat of its own.",
        instruction: "Black's Knight on c6 is attacked by the pawn. Move it to a5 to attack the Bishop.",
        expectedMove: "Na5"
      }
    ]
  },
  {
    id: "3",
    slug: "endgame-essentials",
    title: "Endgame Essentials",
    description: "The opposition, Lucena position, and Philidor position. Convert winning advantages flawlessly.",
    icon: "Crown",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    isLocked: false,
    steps: [
      {
        fen: "8/8/8/8/4k3/4P3/4K3/8 w - - 0 1",
        title: "The Opposition",
        content: "In pawn endgames, 'The Opposition' occurs when Kings face each other with one square between them. The player who does NOT have to move holds the advantage, as the opponent must step aside.",
        instruction: "White to move. Secure the opposition to promote your pawn.",
        expectedMove: "Kd2"
      },
      {
        fen: "8/8/8/4P3/4K3/8/8/4k3 w - - 0 1",
        title: "Key Squares",
        content: "To promote a pawn in a King and Pawn endgame, your King must control the 'key squares' in front of the pawn. If your King reaches the 6th rank in front of your pawn, it's a guaranteed win regardless of whose turn it is.",
        instruction: "Advance your King to take control of the promotion squares.",
        expectedMove: "Kd5"
      }
    ]
  },
  {
    id: "4",
    slug: "opening-traps",
    title: "Devastating Opening Traps",
    description: "Learn how to crush your opponents in under 15 moves with tricky, aggressive gambits.",
    icon: "Swords",
    color: "text-red-500",
    bg: "bg-red-500/10",
    isLocked: false,
    steps: [
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
        title: "The Scholar's Mate Threat",
        content: "A notorious beginner's trap where White threatens checkmate on f7 using the Queen and Bishop. If Black isn't careful, the game is over instantly.",
        instruction: "White threatens mate in 1 on f7. Find the winning move for White.",
        expectedMove: "Qxf7#"
      }
    ]
  }
];
