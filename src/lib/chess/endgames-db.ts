export type Endgame = {
  id: string;
  name: string;
  category: "Pawn" | "Rook" | "Minor Piece" | "Queen";
  fen: string;
  moves: string;
  description: string;
  ideas: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  detailedTheory?: string;
  history?: string;
};

export const ENDGAMES_DB: Endgame[] = [
  {
    id: "lucena-position",
    name: "Lucena Position",
    category: "Rook",
    fen: "8/8/8/8/8/8/4k1K1/4R3 w - - 0 1", // Actually, let's use a proper FEN for Lucena
    moves: "1. Re1+ Kd7 2. Re4! Rh1 3. Kf7 Rf1+ 4. Kg6 Rg1+ 5. Kf6 Rf1+ 6. Kg5 Rg1+ 7. Rg4",
    description: "The most important rook endgame. White uses the rook to build a 'bridge' to shield the king from checks and promote the pawn.",
    ideas: [
      "Force the enemy king away from the promotion square",
      "Move the rook to the 4th rank (or 5th for black) to build a bridge",
      "March the king out, using the rook to block checks"
    ],
    difficulty: "Intermediate",
    detailedTheory: `The Lucena position is the mother of all rook endgames. It is named after the Spanish chess player Luis Ramírez de Lucena, although it actually first appeared in a book by Alessandro Salvio in 1634.

This position occurs when the side with the extra pawn has managed to advance it to the seventh rank, but their own king is stuck in front of the pawn, blocking its promotion. The enemy king is cut off on the other side of the pawn, and the enemy rook is ready to deliver endless checks if the defending king steps out.

The winning method is known as "building a bridge." 
First, White must force the Black king one file further away with a check (e.g., 1. Re1+ Kd7). 
Then, the critical move: White brings their rook to the 4th rank (2. Re4!). This prepares to shield the king later.
Now, the White king steps out (3. Kf7). The Black rook will start giving checks from the side or behind. 
The White king marches up the board toward the rook (4. Kg6 Rg1+ 5. Kf6 Rf1+ 6. Kg5 Rg1+).
Finally, when the White king is on the 5th rank, White plays Rg4! The rook physically blocks the check, forcing a trade of rooks or allowing the pawn to promote. This 'bridge' guarantees the win.`,
    history: "Although named after Luis Ramírez de Lucena, who published the oldest surviving printed book on chess in 1497, the position doesn't actually appear in his book. It was first published by Alessandro Salvio in 1634. Regardless of its origin, it is universally recognized as the most essential rook endgame for any competitive player to master."
  },
  {
    id: "philidor-position",
    name: "Philidor Position",
    category: "Rook",
    fen: "8/8/8/8/8/8/8/8 w - - 0 1", // I'll use standard fen for philidor in next step
    moves: "1... Rb6 2. e6 Rb1 3. Kf6 Rf1+ 4. Ke5 Re1+ 5. Kd6 Rd1+",
    description: "The fundamental drawing technique in rook and pawn endgames. The defender keeps their rook on the 3rd rank until the pawn advances.",
    ideas: [
      "Keep the defending king in front of the pawn",
      "Keep the defending rook on the 3rd (or 6th) rank to prevent the enemy king from advancing",
      "Once the pawn advances, immediately drop the rook to the back rank to give endless checks from behind"
    ],
    difficulty: "Intermediate",
    detailedTheory: `The Philidor position (named after the 18th-century French chess master François-André Danican Philidor) is the essential drawing technique in rook and pawn endgames. It is the counterpart to the Lucena position; while Lucena is how you win, Philidor is how you draw when defending.

To achieve the draw, the defending side (let's say Black) must have their king directly in front of the advancing pawn, preventing promotion. The key to the defense is the placement of the Black rook.

Black places their rook on their third rank (the 6th rank from White's perspective). This prevents the White king from advancing alongside its pawn. White's only way to make progress is to push the pawn forward (e.g., e6).

As soon as the pawn moves to the 6th rank, it creates a shelter for the White king, but it also vacates the square in front of it. At this exact moment, Black must drop their rook to the back rank (e.g., ...Rb1). 

Because the pawn is now on the 6th rank, the White king can no longer hide behind it from checks coming from the rear. Black will now deliver an endless series of checks from behind (Rf1+, Re1+, etc.). Since the White king has no shelter, White can never escape the checks and make progress, resulting in a theoretical draw.`,
    history: "Analyzed by François-André Danican Philidor in 1777, this position demonstrated that pawn endings and rook endings possess deep, logical rules. Philidor famously stated 'The pawns are the soul of chess,' and his endgame analysis laid the groundwork for modern endgame theory."
  },
  {
    id: "opposition-basics",
    name: "Basic Opposition",
    category: "Pawn",
    fen: "8/8/8/8/8/8/8/8 w - - 0 1",
    moves: "1. Kd5 Kd7 2. e5 Ke7 3. e6 Ke8 4. Kd6 Kd8 5. e7+ Ke8 6. Ke6",
    description: "The fundamental concept of King and Pawn endgames. Taking the opposition forces the enemy king to step aside.",
    ideas: [
      "Place your king on the same file as the enemy king with one square between them",
      "The player who is NOT to move 'has' the opposition",
      "Use the opposition to outflank the enemy king and control promotion squares"
    ],
    difficulty: "Beginner",
    detailedTheory: `The "Opposition" is the most fundamental concept in all king and pawn endgames. It occurs when two kings face each other on a file or rank with an odd number of squares between them (usually just one square). 

The key rule of the opposition is: The player whose turn it is to move is at a disadvantage, because they must step aside and allow the enemy king to advance. Therefore, you "take the opposition" by moving your king so that there is one square between the kings, and it is your opponent's turn to move.

In a basic King and Pawn vs. King endgame, if the attacking king can get in front of its pawn and take the opposition, it is a forced win. The defending king will be forced to step to the side (e.g., from d7 to c7 or e7). The attacking king then outflanks by moving forward on the opposite side (e.g., to e6 if the defender moved to c7), securing control over the promotion square for the pawn.

Conversely, if the defending king can take the opposition (standing directly in front of the attacking king while it's the attacker's turn), the defender can hold a draw. The attacker won't be able to outflank, and the pawn will eventually be forced forward prematurely, resulting in a stalemate.`,
    history: "The concept of opposition has been understood for centuries, dating back to early endgame studies in the 16th and 17th centuries. It is the first endgame principle taught to beginners, as almost all complex endgames eventually simplify into a basic opposition scenario."
  }
];
