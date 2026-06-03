const fs = require('fs');

// 1. Update Guess The Elo Games
const eloFile = './src/app/(dashboard)/guess-the-elo/page.tsx';
let eloData = fs.readFileSync(eloFile, 'utf-8');
const newGames = `
  , { id: 16, white: "Anonymous", black: "Anonymous", realElo: 2850, pgn: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6 8. Qd2 Qxb2 9. Rb1 Qa3 10. f5 Nc6 11. fxe6 fxe6 12. Nxc6 bxc6 13. e5 dxe5 14. Bxf6 gxf6 15. Ne4 Be7 16. Be2 h5 17. Rb3 Qa4 18. c4 f5 19. O-O fxe4 20. Kh1 c5 21. Rg3 Qd7 22. Qe3 Bb7 23. Rg7 O-O-O 24. Rff7 Rhe8 25. h3 Qd6 26. Qb3 Rd7 27. Qa4 Red8 28. Qa5 Kb8 29. Kh2 h4 30. Rh7 e3 31. Kh1 Qd2 32. Qxd2 exd2 33. Rxe7 d1=Q+ 34. Bxd1 Rxd1+ 35. Kh2 Rb1 36. Rxe6 Rb2 37. Rg7 Rdd2" }
  , { id: 17, white: "Anonymous", black: "Anonymous", realElo: 300, pgn: "1. e4 e5 2. f3 Bc5 3. g4 Qh4+ 4. Ke2 Qf2+ 5. Kd3 Qd4+ 6. Ke2 Nf6 7. c3 Qf2+ 8. Kd3 b6 9. Nh3 Ba6+ 10. Kc2 Qh4 11. d3 O-O 12. Bg5" }
  , { id: 18, white: "Anonymous", black: "Anonymous", realElo: 2550, pgn: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2 O-O 5. a3 Bxc3+ 6. Qxc3 b6 7. Bg5 Bb7 8. f3 h6 9. Bh4 d5 10. e3 Nbd7 11. cxd5 Nxd5 12. Bxd8 Nxc3 13. Bh4 Nd5 14. Bf2 c5 15. e4 Ne7 16. dxc5 Nxc5 17. Bxc5 bxc5 18. Rc1 Rab8 19. Rxc5 Rfc8 20. Rxc8+ Bxc8 21. b4 a5 22. b5 Bd7 23. a4 Nc8 24. Kd2 Nb6 25. Bd3 Nxa4 26. Ne2 Nc5 27. Nd4 Nxd3 28. Kxd3 Bxb5+ 29. Nxb5 Rxb5 30. Ra1 Kf8" }
  , { id: 19, white: "Anonymous", black: "Anonymous", realElo: 1250, pgn: "1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Bc4 Nf6 5. e5 d5 6. Bb5 Ne4 7. Nxd4 Bd7 8. Bxc6 bxc6 9. O-O Bc5 10. f3 Ng5 11. Be3 Ne6 12. c3 Bb6 13. Qd2 O-O 14. Na3 f6 15. exf6 Qxf6 16. Nac2 Nf4 17. Bxf4 Qxf4 18. Qxf4 Rxf4 19. Rfe1 Re8 20. Rxe8+ Bxe8 21. Re1 Bg6 22. Kf1 Bd3+ 23. Kf2 Bxc2" }
  , { id: 20, white: "Anonymous", black: "Anonymous", realElo: 800, pgn: "1. e4 e5 2. Bc4 Nf6 3. d3 c6 4. f4 exf4 5. Bxf4 d5 6. exd5 Nxd5 7. Bg3 Ne3 8. Qe2 Qe7 9. Bb3 Nd7 10. Kd2 Nf5 11. Qxe7+ Bxe7 12. Nf3 Nxg3 13. hxg3 O-O 14. Nc3 Nc5 15. Rae1 Bf6 16. d4 Nxb3+ 17. axb3 Be6 18. Ne4 Be7 19. Kc1 Rfd8 20. c3 Bxb3 21. Neg5 Bxg5+ 22. Nxg5 h6 23. Nf3 Bd5" }
];`;
eloData = eloData.replace(/\n\];/, newGames);
fs.writeFileSync(eloFile, eloData);

// 2. Update Puzzles (randomly add some to Endgame, Pin, Fork to increase rush pool)
const puzzlesFile = './src/lib/chess/puzzles-db.ts';
let puzzlesData = fs.readFileSync(puzzlesFile, 'utf-8');
const morePuzzles = `
    ,
    {
      id: "endgame_2",
      fen: "8/8/8/8/8/k7/p7/K7 w - - 0 1",
      solution: ["a1a2", "a3b4", "a2b2"],
      rating: 1100,
      themes: ["Endgame"]
    }
  ],
  "Tactics": [
    {
      id: "tactic_1",
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5",
      solution: ["c3d5", "f6e4", "d1e2"],
      rating: 1300,
      themes: ["Tactics"]
    },
    {
      id: "tactic_2",
      fen: "3r2k1/p4ppp/1p2p3/2b5/2P1n3/1P3N2/PB3PPP/5RK1 b - - 1 20",
      solution: ["d8d2", "f3d2", "e4d2"],
      rating: 1750,
      themes: ["Tactics", "Fork"]
    }
  ]
};`;
puzzlesData = puzzlesData.replace(/\n  \]\n\};/, morePuzzles);
fs.writeFileSync(puzzlesFile, puzzlesData);

console.log("Updated Guess The Elo and Puzzles DB");
