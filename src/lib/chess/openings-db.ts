export type Opening = {
  eco: string;
  name: string;
  category: "e4" | "d4" | "other";
  moves: string;
  fen: string;
  description: string;
  ideas: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  detailedTheory?: string;
  history?: string;
};

export const OPENINGS_DB: Opening[] = [
  {
    eco: "C50",
    name: "Italian Game",
    category: "e4",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    description: "One of the oldest recorded chess openings, focusing on rapid development and controlling the center while eyeing the vulnerable f7 square.",
    ideas: [
      "Develop the bishop to an active square (c4)",
      "Prepare for kingside castling quickly",
      "Control the center with the e4 pawn",
      "Put early pressure on Black's f7 square"
    ],
    difficulty: "Beginner",
    detailedTheory: `The Italian Game is a family of chess openings beginning with the moves 1.e4 e5 2.Nf3 Nc6 3.Bc4. It is one of the oldest recorded chess openings; it appears in the Göttingen manuscript and was developed by players such as Damiano and Polerio in the 16th century, and later by Greco in 1620.

The opening is defined by the development of the bishop to c4 (the "Italian Bishop"), where it attacks Black's vulnerable f7 square. It is a very natural and logical opening, adhering strictly to classical opening principles: it controls the center, develops a minor piece to an active square, and prepares for early castling.

Modern theory of the Italian Game often revolves around the Giuoco Piano (3...Bc5) and the Two Knights Defense (3...Nf6). In the Giuoco Piano, White has a choice between the slow, positional Giuoco Pianissimo (4.d3) and the aggressive Evans Gambit (4.b4). In recent years, the Giuoco Pianissimo has seen a massive resurgence at the elite level, as grandmasters have found new, subtle ways to maneuver in the resulting complex, closed positions.

Black's main alternatives on move 3 are the Two Knights Defense (3...Nf6), which often leads to sharp, tactical struggles if White plays the aggressive 4.Ng5, and the solid but somewhat passive Hungarian Defense (3...Be7).

Overall, the Italian Game offers a rich playground for players of all levels, ranging from basic tactical themes suitable for beginners to profound positional maneuvering practiced by World Champions.`,
    history: "The Italian Game dates back to the 15th century, making it one of the oldest known chess openings. It gained massive popularity during the Romantic era of chess in the 19th century, where players like Paul Morphy and Adolf Anderssen used it to launch brilliant, sacrificial attacks. While it was somewhat overshadowed by the Ruy Lopez in the 20th century, it has experienced a major revival in modern elite chess, championed by players like Magnus Carlsen and Wesley So."
  },
  {
    eco: "C60",
    name: "Ruy Lopez",
    category: "e4",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    description: "A fundamentally sound opening that immediately pressures Black's e5 pawn defender and leads to rich, strategic middlegames.",
    ideas: [
      "Pressure the knight on c6, which defends the e5 pawn",
      "Prepare to castle quickly",
      "Control the center with pieces and pawns",
      "Create long-term positional pressure"
    ],
    difficulty: "Intermediate",
    detailedTheory: `The Ruy Lopez, also known as the Spanish Opening, is one of the most popular and highly regarded chess openings. It begins with the moves 1.e4 e5 2.Nf3 Nc6 3.Bb5. It is named after the 16th-century Spanish priest Ruy López de Segura.

The primary strategic idea behind 3.Bb5 is to attack the knight on c6, which is the key defender of Black's e5 pawn. While White does not usually threaten to win the pawn immediately (since 4.Bxc6 dxc6 5.Nxe5 can be met by 5...Qd4, regaining the pawn), the bishop on b5 exerts strong long-term pressure on Black's position.

The Ruy Lopez is renowned for its immense strategic depth and complexity. It can lead to a wide variety of pawn structures and middlegame types, ranging from slow, maneuvering battles in the Closed Ruy Lopez (3...a6 4.Ba4 Nf6 5.O-O Be7) to sharp, tactical skirmishes in the Open Ruy Lopez (5...Nxe4) and the Marshall Attack.

Black has many ways to respond to the Ruy Lopez. The most common and robust response is the Morphy Defense (3...a6), putting immediate question to the bishop. Other popular choices include the Berlin Defense (3...Nf6), known for its solid, drawish endgame, and the Schliemann Defense (3...f5), an aggressive gambit.

Mastery of the Ruy Lopez is often considered essential for any aspiring chess player, as it teaches fundamental concepts of piece coordination, pawn structure, and long-term planning.`,
    history: "Named after Ruy López de Segura, a 16th-century Spanish priest who published a book on chess in 1561. The opening became a staple of classical chess in the late 19th and early 20th centuries, championed by World Champions Wilhelm Steinitz and Emanuel Lasker. It remains a cornerstone of opening theory and is played frequently at all levels of competition, from club tournaments to World Championship matches."
  },
  {
    eco: "B00",
    name: "Sicilian Defense",
    category: "e4",
    moves: "1. e4 c5",
    fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    description: "Black's most popular and combative response to 1.e4, fighting for the center with a flank pawn to create asymmetric, dynamic positions.",
    ideas: [
      "Control the d4 square with the c-pawn",
      "Create an asymmetrical pawn structure",
      "Prepare for complex, tactical battles",
      "Play for a win as Black rather than equality"
    ],
    difficulty: "Advanced",
    detailedTheory: `The Sicilian Defense (1.e4 c5) is the most popular and best-scoring response to White's first move 1.e4. Unlike symmetrical defenses like 1...e5, the Sicilian immediately unbalances the position, leading to complex and dynamic play where both sides have winning chances.

By playing 1...c5, Black aims to control the central d4 square with a flank pawn. In the main lines (the Open Sicilian), White will eventually play d2-d4 and exchange their central d-pawn for Black's c-pawn (e.g., 2.Nf3 d6 3.d4 cxd4 4.Nxd4). This exchange gives Black a central pawn majority (e- and d-pawns vs. White's e-pawn) and a semi-open c-file, which are long-term positional advantages. In return, White gets a space advantage, rapid piece development, and attacking chances.

The Sicilian is an enormous opening complex with many distinct variations, including:
- The Najdorf Variation (5...a6): The most popular and deeply analyzed line, played by Fischer and Kasparov. It is highly flexible and prepares queenside expansion.
- The Dragon Variation (5...g6): Black fianchettos their bishop on g7, aiming for intense tactical battles, often involving opposite-side castling.
- The Sveshnikov Variation (5...e5): A dynamic line where Black accepts a backward d-pawn and a weak d5 square in exchange for active piece play and central control.

The Sicilian requires extensive theoretical knowledge and sharp tactical skills, making it a favorite among ambitious players seeking to fight for a win with the black pieces.`,
    history: "The Sicilian Defense has a rich history, evolving from an obscure sideline in the 19th century to the most dominant defense to 1.e4 in the modern era. Its popularity surged in the mid-20th century, heavily influenced by Soviet grandmasters and World Champions like Bobby Fischer and Garry Kasparov, who used it as their primary weapon to win crucial games."
  },
  {
    eco: "D02",
    name: "London System",
    category: "d4",
    moves: "1. d4 d5 2. Bf4",
    fen: "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq - 1 2",
    description: "A solid, universal opening setup for White that can be played against almost any Black defense.",
    ideas: [
      "Develop the dark-squared bishop early to f4",
      "Build a solid pawn triangle with d4, e3, and c3",
      "Control the e5 square",
      "Avoid sharp, theoretical opening battles"
    ],
    difficulty: "Beginner",
    detailedTheory: `The London System is a popular and solid opening setup for White, typically characterized by the moves 1.d4, followed by developing the dark-squared bishop to f4, and building a pawn structure with pawns on d4, e3, and c3.

Unlike many traditional openings where White must adapt to Black's specific defenses (such as the King's Indian Defense or the Nimzo-Indian), the London System is a "system" opening. This means White can often play the same basic setup regardless of how Black responds. This makes the London incredibly practical, especially for club players who want to avoid memorizing vast amounts of opening theory.

The typical development scheme for White involves:
1. Playing d4 to control the center.
2. Developing the bishop to f4 to control important central squares (especially e5).
3. Playing e3 to solidify the d4 pawn and prepare to develop the light-squared bishop (usually to d3 or e2).
4. Playing c3 to further bolster the center and provide a retreat square for the f4 bishop (on c2 or h2).
5. Developing the knights to f3 and d2.

While historically considered a somewhat passive and drawish opening, the London System has evolved. Modern players, including World Champion Magnus Carlsen, have demonstrated that the London contains hidden attacking potential. If Black plays carelessly, White can launch powerful kingside attacks, often involving bringing a knight to e5 and advancing the h-pawn.`,
    history: "The London System gets its name from the 1922 London tournament, where it was played by several leading masters, including José Raúl Capablanca and Alexander Alekhine. For decades, it was considered a boring, unambitious choice, primarily used to secure a draw. However, in the 21st century, it has experienced a massive surge in popularity at all levels, transformed by modern engines and top grandmasters into a dangerous and flexible weapon."
  }
  , {
    eco: "C00",
    name: "French Defense",
    category: "e4",
    moves: "1. e4 e6",
    fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    description: "A solid, counter-attacking opening for Black, fighting for the center with d5.",
    ideas: ["Challenge e4 with d5", "Attack the white center with c5"],
    difficulty: "Intermediate",
    detailedTheory: "The French Defense is a very solid opening where Black allows White a space advantage in exchange for a solid pawn structure.",
    history: "Played in the 1834 match between London and Paris."
  }
];
