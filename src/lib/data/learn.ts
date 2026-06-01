export interface CourseLesson {
  title: string;
  fen: string;
  theory: string;
}

export interface CourseData {
  slug: string;
  title: string;
  description: string;
  whyThisMatters: string;
  lessons: CourseLesson[];
}

export const COURSES: CourseData[] = [
  {
    slug: "tactics-fundamentals",
    title: "Tactics Fundamentals",
    description: "Learn the core tactical motifs that decide 99% of chess games at the beginner and intermediate level.",
    whyThisMatters: "Recognizing these patterns instantly is the primary difference between a beginner and a master. Grandmasters don't calculate every variation from scratch; they instinctively feel the geometric relationships between pieces across the board. Drilling these tactical patterns builds your 'board vision' so you can spot winning combinations effortlessly in your own games. Tactics are the vocabulary of chess—without them, you cannot speak the language.",
    lessons: [
      { 
        title: "The Fork", 
        fen: "r1b1k2r/ppp2ppp/2n5/3qp3/1b1P4/5N2/PP1BPPPP/R2QKB1R w KQkq - 0 8", 
        theory: "A fork is a tactic where a single piece attacks two or more enemy pieces simultaneously. Because the opponent can only defend or move one piece per turn, the other piece is typically lost. Knights and Queens are particularly notorious for devastating forks because of how they move." 
      },
      { 
        title: "The Pin", 
        fen: "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8", 
        theory: "A pin occurs when an attacked piece cannot move without exposing a more valuable piece behind it. Absolute pins involve the King (meaning the pinned piece legally cannot move), while relative pins involve other high-value pieces like the Queen. Pins paralyze the opponent's pieces." 
      },
      { 
        title: "The Skewer", 
        fen: "8/8/8/8/3k4/1R6/2K5/8 w - - 0 1", 
        theory: "A skewer is often described as a 'reverse pin'. A valuable piece is attacked, forcing it to move and exposing a less valuable (but still hanging) piece behind it. Rooks and Bishops are excellent at executing skewers along open files and long diagonals." 
      },
    ]
  },
  {
    slug: "endgame-mastery",
    title: "Endgame Mastery",
    description: "Convert advantages into wins by mastering essential endgame theory and technique.",
    whyThisMatters: "The legendary José Raúl Capablanca famously said, 'In order to improve your game, you must study the endgame before everything else.' Endgames require precise calculation rather than vague principles. Knowing basic checkmates, pawn promotion rules, and theoretical draws (like the Philidor position) ensures you won't throw away a won game or lose a drawn one. Mastery here turns good middlegames into guaranteed points on the scoreboard.",
    lessons: [
      { 
        title: "King and Pawn vs King", 
        fen: "8/8/8/8/4k3/4P3/4K3/8 w - - 0 1", 
        theory: "The most fundamental of all endgames. The concepts of 'opposition' (kings facing each other with one square between them) and 'outflanking' determine whether the pawn promotes or the game is drawn. If the defending king gets in front of the pawn, it's usually a draw." 
      },
      { 
        title: "The Lucena Position", 
        fen: "8/8/8/8/8/6K1/4R3/3k4 w - - 0 1", 
        theory: "The Lucena Position is the most important winning rook endgame. White must build a 'bridge' with their rook to shield their king from endless checks, allowing the pawn to promote safely. Memorizing this technique is mandatory for tournament players." 
      },
      { 
        title: "The Philidor Position", 
        fen: "8/8/8/8/8/4k3/4r3/3K4 b - - 0 1", 
        theory: "The Philidor Position is the essential drawing technique in rook endgames. The defender keeps their rook on the 3rd (or 6th) rank to prevent the attacking king from advancing. Once the pawn advances, the rook drops to the 1st (or 8th) rank to deliver unstoppable checks from behind." 
      },
    ]
  },
  {
    slug: "opening-principles",
    title: "Opening Principles",
    description: "Learn how to survive the first 15 moves by adhering to fundamental opening rules.",
    whyThisMatters: "Memorizing specific openings is useless if you don't understand the 'why' behind the moves. Opening principles act as a compass when you face an unfamiliar opening. By focusing on rapid development, central control, and king safety, you guarantee yourself a playable middlegame. Violating these principles—such as moving the same piece twice or leaving your king in the center—is the fastest way to lose miniature games.",
    lessons: [
      { 
        title: "Control the Center", 
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1", 
        theory: "The center of the board (d4, e4, d5, e5) is the high ground in chess. Pieces placed here control more squares and can quickly pivot to attack either flank. Your first moves should always aim to occupy or control these critical squares with pawns and minor pieces." 
      },
      { 
        title: "Develop Minor Pieces", 
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", 
        theory: "Knights and Bishops must be brought into the game quickly. A common rule of thumb is 'Knights before Bishops', because Knights generally have obvious best squares (like f3 and c3), while Bishop placements often depend on how the pawn structure evolves." 
      },
      { 
        title: "King Safety (Castling)", 
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQ1RK1 b kq - 0 5", 
        theory: "The King is extremely vulnerable in the center of the board where files are likely to open. Castling solves two problems at once: it tucks the King away behind a protective wall of pawns, and it brings a Rook out of the corner and into the center of the action." 
      },
    ]
  },
  {
    slug: "positional-play",
    title: "Positional Play",
    description: "Understand the long-term, structural factors that dictate where pieces belong.",
    whyThisMatters: "While tactics are short-term operations to win material or give checkmate, positional play is about improving the quality of your position over time. It's the art of creating microscopic advantages—a better pawn structure, a stronger bishop, an outpost for a knight. When grandmasters play, the game is often decided by these subtle positional factors. Understanding positional play turns you from a hopeful tactician into a complete chess strategist.",
    lessons: [
      { 
        title: "Pawn Structures", 
        fen: "rnbqkbnr/pp2pppp/3p4/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3", 
        theory: "Pawns are the soul of chess. Their fixed nature dictates the flow of the game. Doubled pawns, isolated pawns, and backward pawns are usually weaknesses because they are hard to defend. Conversely, a connected passed pawn is a massive asset. Evaluate trades based on how they impact the pawn structure." 
      },
      { 
        title: "Outposts", 
        fen: "r1bq1rk1/1pp2ppp/p1np1n2/2b1p3/2B1P3/2PP1N2/PP3PPP/RNBQR1K1 w - - 0 8", 
        theory: "An outpost is a square protected by your own pawn that cannot be attacked by an enemy pawn. Knights thrive on outposts, especially in the center of the board (ranks 4, 5, and 6), where they become dominant, unremovable tentacles radiating power." 
      },
      { 
        title: "Good vs Bad Bishops", 
        fen: "8/8/8/8/3k4/1R6/2K5/8 w - - 0 1", 
        theory: "A 'bad' bishop is one whose mobility is severely restricted by its own pawns. If your pawns are fixed on light squares, your light-squared bishop will be bad. A 'good' bishop has open diagonals and operates on the opposite color complex as its own central pawns. Trading a bad bishop for a good one is a classic positional victory." 
      },
    ]
  }
];

export function getCourseBySlug(slug: string): CourseData | undefined {
  return COURSES.find(c => c.slug === slug);
}
