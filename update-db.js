const fs = require('fs');

// 1. Update Courses
const coursesFile = './src/lib/chess/courses-db.ts';
let coursesData = fs.readFileSync(coursesFile, 'utf-8');
const newCourse = `
  , {
    id: "advanced-tactics",
    title: "Advanced Tactics",
    description: "Master complex tactical motifs like clearance sacrifices and windmills.",
    level: "Advanced",
    color: "#ca3431",
    longDescription: "Take your tactical vision to the next level. This course covers advanced combinational themes that often occur in master-level play.",
    whatYouWillLearn: ["Clearance sacrifices", "Windmills", "Interference"],
    lessons: [
      {
        id: "clearance-sacrifice",
        title: "The Clearance Sacrifice",
        description: "Sacrifice a piece to clear a crucial square or file.",
        steps: [
          {
            fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQ1RK1 w kq - 0 1",
            instruction: "Play d4 to challenge the center.",
            expectedMove: "d2d4",
            successMessage: "Great job!",
            failMessage: "Try d4",
            opponentReply: "e5d4"
          }
        ]
      }
    ]
  }
];`;
coursesData = coursesData.replace(/\n\];/, newCourse);
fs.writeFileSync(coursesFile, coursesData);

// 2. Update Endgames
const endgamesFile = './src/lib/chess/endgames-db.ts';
let endgamesData = fs.readFileSync(endgamesFile, 'utf-8');
const newEndgame = `
  , {
    id: "rook-vs-pawn",
    title: "Rook vs Pawn",
    category: "Rook Endgames",
    fen: "8/8/8/8/8/R7/4p3/4K3 w - - 0 1",
    difficulty: "Advanced",
    description: "Learn how to stop an advanced pawn with a rook.",
    solution: ["a3e3", "e2e1", "e3e1"],
    ideas: ["Get the rook behind the pawn", "Use the king to assist"]
  }
];`;
endgamesData = endgamesData.replace(/\n\];/, newEndgame);
fs.writeFileSync(endgamesFile, endgamesData);

// 3. Update Master Games
const mastergamesFile = './src/lib/chess/master-games-db.ts';
let mastergamesData = fs.readFileSync(mastergamesFile, 'utf-8');
const newMasterGame = `
  , {
    id: "kasparov-topalov-1999",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    event: "Wijk aan Zee 1999",
    date: "1999-01-20",
    result: "1-0",
    pgn: '[Event "Hoogovens Group A"]\\n[Site "Wijk aan Zee NED"]\\n[Date "1999.01.20"]\\n[White "Garry Kasparov"]\\n[Black "Veselin Topalov"]\\n[Result "1-0"]\\n[ECO "B06"]\\n\\n1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7 1-0',
    description: "Kasparov's Immortal Game, featuring a breathtaking king hunt that chases Topalov's king across the entire board.",
    openingEco: "B06",
    openingName: "Pirc Defense"
  }
];`;
mastergamesData = mastergamesData.replace(/\n\];/, newMasterGame);
fs.writeFileSync(mastergamesFile, mastergamesData);

// 4. Update Openings
const openingsFile = './src/lib/chess/openings-db.ts';
let openingsData = fs.readFileSync(openingsFile, 'utf-8');
const newOpening = `
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
];`;
openingsData = openingsData.replace(/\n\];/, newOpening);
fs.writeFileSync(openingsFile, openingsData);

// 5. Update Puzzles
const puzzlesFile = './src/lib/chess/puzzles-db.ts';
let puzzlesData = fs.readFileSync(puzzlesFile, 'utf-8');
const newPuzzleCategory = `
  ,
  "Mate in 3": [
    {
      id: "mate_3_1",
      fen: "r5k1/pp3p1p/2p3p1/8/2P1b2q/1P2P2P/PQ3PP1/3R1R1K b - - 0 1",
      solution: ["h4h3", "h1g1", "h3g2"],
      rating: 1600,
      themes: ["Mate in 3", "Pin"]
    }
  ]
};`;
puzzlesData = puzzlesData.replace(/\n\};/, newPuzzleCategory);
fs.writeFileSync(puzzlesFile, puzzlesData);

console.log("Successfully added new mock data.");
