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
    title: "Basic Principles",
    description: "Master the center, develop your pieces, and ensure king safety. The foundation of every grandmaster.",
    icon: "Shield",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    isLocked: false,
    steps: [
      {
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        title: "Control the Center",
        content: "The most important principle in the opening is to fight for the center squares (e4, d4, e5, d5). Pieces in the center control more squares and restrict the opponent.",
        instruction: "Play a pawn to the center to control space.",
        expectedMove: "e4"
      },
      {
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
        title: "Develop your Knights before Bishops",
        content: "Generally, knights are developed before bishops because their optimal squares are usually obvious early on (f3, c3), while bishops need more open lines to decide where to go.",
        instruction: "Develop your kingside knight to control the center.",
        expectedMove: "Nf3"
      },
      {
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        title: "Prepare to Castle",
        content: "King safety is crucial. By developing the kingside pieces, you clear the path to castle your king to safety.",
        instruction: "Develop your light-squared bishop to a strong diagonal.",
        expectedMove: "Bc4"
      }
    ]
  },
  {
    id: "2",
    slug: "tactical-motifs",
    title: "Tactical Motifs",
    description: "Forks, pins, skewers, and discovered attacks. Learn how to win material by force.",
    icon: "Swords",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    isLocked: false,
    steps: [
      {
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
        title: "The Pin",
        content: "A pin occurs when an attacked piece cannot move without exposing a more valuable piece behind it. Absolute pins against the King are devastating.",
        instruction: "Can you spot a pin opportunity?",
        expectedMove: "Bg5"
      },
      {
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p1N1/2B1P3/8/PPPP1PPP/RNBQK2R b KQkq - 3 4",
        title: "The Fork",
        content: "A fork is a double attack, usually by a Knight or Pawn, attacking two valuable pieces simultaneously.",
        instruction: "Black to move. How does White threaten a deadly fork?",
        expectedMove: "d5"
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
    isLocked: true,
    steps: []
  }
];
