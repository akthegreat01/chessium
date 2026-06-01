const { Chess } = require('chess.js');
const pgn = `[Event "FIDE World Cup 2017"]
[Site "Tbilisi GEO"]
[Date "2017.09.09"]
[Round "4.1"]
[White "Carlsen,M"]
[Black "Bu Xiangzhi"]
[Result "0-1"]
[WhiteElo "2827"]
[BlackElo "2710"]
[EventDate "2017.09.03"]
[ECO "C55"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 h6 5. O-O d6 6. c3 g6 7. Re1 Bg7 8. h3 O-O
9. Bb3 Re8 10. Nbd2 Be6 11. Bc2 d5 12. a4 a5 13. exd5 Nxd5 14. Ne4 b6 15. Bd2 f5
16. Ng3 Bf7 17. h4 h5 18. Ng5 Qd7 19. Bb3 Nd8 20. d4 e4 21. c4 Nf6 22. Bc3 Ne6
23. Nxf7 Qxf7 24. c5 Rad8 25. cxb6 cxb6 26. Ne2 Kh7 27. Qd2 Bh6 28. Qc2 f4
29. Rad1 f3 30. Ng3 fxg2 31. Nxe4 Nd5 32. Bd2 Qf5 33. Ng3 Qh3 34. Qe4 Ndf4
35. Bxf4 Nxf4 36. Qb7+ Rd7 37. Qc6 Rde7 38. Qxe8 Rxe8 39. Rxe8 Qxh4 40. d5 Qg4
41. Rde1 h4 42. R1e7+ Bg7 43. d6 hxg3 44. fxg3 Qxg3 0-1`;

const g = new Chess();
g.loadPgn(pgn);
const h = g.history({verbose: true});
console.log("Move 0 keys:", Object.keys(h[0]));
console.log("Move 0 after:", h[0].after);
console.log("Move 0 before:", h[0].before);
