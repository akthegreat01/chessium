export const ARTICLES = [
  {
    id: "brilliant-moves",
    title: "The 10 Most Brilliant Moves in Chess History",
    category: "Tactics",
    readTime: "8 min",
    emoji: "💎",
    preview: "From Kasparov's legendary Rxd4 to Fischer's Be6, these are the moves that transcended calculation and entered the realm of pure genius.",
    content: `Chess brilliance isn't just about finding the best move — it's about seeing what nobody else can see. Throughout history, certain moves have transcended mere calculation to become works of art.

### 1. Kasparov vs Topalov, Wijk aan Zee 1999 — Rxd4!!
In what many consider the greatest game ever played, Kasparov unleashed a rook sacrifice that led to a forced winning sequence 15 moves deep. The computer era had arrived, but this was pure human creativity. Topalov's king was chased across the entire board, ending in a beautiful mating net.

[BOARD|1r2r1k1/p4p1p/1qp1b1p1/3p4/N2P4/P2Q1P2/1P4PP/2R1R1K1 b - - 2 24|white|Kasparov vs Topalov. Can you find White's immortal move?|Rxd4!!]

### 2. Tal vs Larsen, Bled 1965 — Nd5!!
Mikhail Tal, the "Magician from Riga," sacrificed his knight for a devastating attack. The combination that followed involved every piece on the board and required calculating impossible geometries. Tal's intuitive sacrifices often confused engines for years before they finally understood the deep compensation.

[BOARD|r1bq1rk1/1pp1bppp/p1np1n2/4p3/B3P3/2NP1N2/PPP2PPP/R1BQR1K1 w - - 3 9|white|Mikhail Tal's intuition strikes again.|Nd5!!]

### 3. Fischer vs Byrne, New York 1956 — Be6!!
A 13-year-old Bobby Fischer played what became known as "The Game of the Century" with this stunning bishop sacrifice. Fischer gave up his queen to unleash a windmill attack that decimated Byrne's position.

[BOARD|r1q2rk1/pp2ppbp/2n2np1/2p5/P3P3/1PNP1NP1/1B3P1P/R2Q1RK1 b - - 0 12|black|The Game of the Century. Black to play and win.|Be6!!]

### 4. Carlsen vs Anand, Chennai 2013 — Rxe7!!
Magnus Carlsen's precision in the World Championship demonstrated that brilliance can also be quiet and positional. This sacrifice didn't lead to an immediate checkmate but rather a slow, suffocating squeeze.

Understanding these sacrifices teaches you that material isn't everything — piece activity, king safety, and initiative often matter far more than the raw point value of pieces.`
  },
  {
    id: "underpromotion-guide",
    title: "The Complete Guide to Underpromotion",
    category: "Tactics",
    readTime: "12 min",
    emoji: "♞",
    preview: "When a queen isn't the answer. Master the art of promoting to knights, rooks, and bishops — the rarest and most beautiful tactical pattern in chess.",
    content: `Underpromotion is perhaps the most elegant concept in chess tactics. It occurs when a pawn reaches the eighth rank and the player deliberately chooses not to promote it to a queen.

### Why Would You NOT Want a Queen?

There are three main reasons:
1. **Stalemate avoidance** — A queen might leave the opponent with no legal moves.
2. **Knight forks** — A knight can attack two pieces simultaneously in ways a queen cannot.
3. **Specific piece geometry** — Sometimes only a rook or bishop creates the right threats to trap a king without stalemating it.

### Knight Underpromotion
The most common type. Knights have a unique movement pattern that no other piece replicates. A pawn promoting to a knight can deliver immediate forks against the king and queen, or create discovered attacks.

[BOARD|8/P5pk/7p/8/8/8/6PK/1q6 w - - 0 1|white|White is losing. Is there a way to save the game?|a8=N+!!]

*Famous Example: Timman vs Velimirović, 1979*
After a spectacular combinative struggle, the game was decided by a knight underpromotion that forked the king and rook — the only way to win the game.

### Rook Underpromotion
Almost always used to avoid stalemate. If your opponent's king is trapped and a queen would leave no legal moves, promoting to a rook maintains the winning advantage without stalemate.

[BOARD|8/P7/8/8/8/8/1k6/7K w - - 0 1|white|Promoting to a Queen causes Stalemate! What is the winning move?|a8=R!]`
  },
  {
    id: "sacrifices",
    title: "Most Insane Sacrifices That Changed Chess",
    category: "Tactics",
    readTime: "7 min",
    emoji: "🔥",
    preview: "Queen sacrifices, exchange sacrifices, and total piece immolation. The moves that broke every rule and rewrote chess theory.",
    content: `In chess, a sacrifice means giving up material for a greater advantage — usually an attack. But some sacrifices go so far beyond normal that they redefine what's possible.

### The Queen Sacrifice
The most dramatic type. Giving up your strongest piece for a devastating attack requires absolute precision. When Nezhmetdinov sacrificed his queen against Chernikov in 1962, he didn't even calculate a forced mate—he just evaluated the resulting position as completely winning due to piece activity.

[BOARD|r1bq1rk1/ppp2ppp/2n5/2bnp3/2B5/2PP1N2/PP3PPP/RNBQR1K1 w - - 1 9|white|White gives up the Queen for immense activity.|Qxf3!!]

### The Exchange Sacrifice
Trading a rook for a minor piece. Tigran Petrosian was the absolute master of this, often sacrificing the exchange for positional compensation that only became clear 20 moves later. He used it to control critical squares or eliminate key defending pieces.

### Total Piece Immolation
The rarest form — sacrificing multiple pieces. Mikhail Tal once sacrificed a knight, then a bishop, then a rook, creating an unstoppable attack with just his queen and pawns. 

Understanding sacrifices is crucial for chess improvement. They teach you that material isn't everything — piece activity, king safety, and initiative often matter far more than the raw point value of pieces.`
  },
  {
    id: "ai-chess",
    title: "AI vs Human: The New Era of Chess",
    category: "History",
    readTime: "10 min",
    emoji: "🤖",
    preview: "From Deep Blue to AlphaZero to Stockfish NNUE — how artificial intelligence transformed chess forever and what it means for human players.",
    content: `The relationship between humans and computers in chess is one of the most fascinating stories in technology.

### 1997: Deep Blue Defeats Kasparov
IBM's Deep Blue became the first computer to defeat a reigning world champion in a match. Kasparov won the first game but lost the match 3.5-2.5. He accused IBM of using human assistance, but ultimately, it marked the beginning of the engine era.

### 2017: AlphaZero Revolutionizes Chess
Google DeepMind's AlphaZero learned chess from scratch in just 4 hours by playing against itself. It then defeated the world's strongest engine, Stockfish 8. Its playing style was described as "alien" — creative, aggressive, and unlike any engine before. It heavily prioritized piece activity over material, changing how grandmasters play.

[BOARD|r1b1k2r/ppq2ppp/2n1p3/3pP3/3P4/5N2/PP1QBPPP/R4RK1 w kq - 3 13|white|AlphaZero routinely pushed the h-pawn to create chaos.|h4!!]

### 2020: Stockfish NNUE
Stockfish integrated neural network evaluation (NNUE), combining traditional alpha-beta search with machine learning. This made it even stronger than AlphaZero in practical play, capable of running efficiently on standard CPUs.

### What This Means for Human Players
Engines haven't killed chess — they've enriched it. Players now use engines for training, preparation, and analysis. The key is to use them as tools for understanding, not as crutches. Memorizing engine lines without understanding the "why" is useless in human vs human play.`
  },
  {
    id: "endgames",
    title: "Greatest Endgames Ever Played",
    category: "Endgame",
    readTime: "9 min",
    emoji: "👑",
    preview: "The art of converting advantages in the final phase. From Capablanca's technique to Carlsen's endgame wizardry.",
    content: `The endgame is where chess mastery truly reveals itself. While openings can be memorized and middlegames can be intuited, endgames demand precise calculation and deep understanding.

### Capablanca: The Endgame Machine
José Raúl Capablanca was perhaps the greatest endgame player in history. His technique was so precise that opponents would resign in positions that looked equal to amateurs. He proved that even microscopic advantages could be converted with perfect play.

[BOARD|8/p7/1p6/1P6/8/8/6K1/k7 w - - 0 1|white|A classic pawn endgame study. Who promotes first?|Kg3!]

### Carlsen's Modern Endgame Mastery
Magnus Carlsen has elevated endgame play to new heights. His ability to squeeze wins from completely drawish positions has earned him the nickname "The Endgame Grinder." He often plays seemingly harmless endgames for hours until his opponent cracks under the sustained pressure.

### Key Endgame Principles
1. **King activity becomes crucial:** The king transforms from a target to a powerful attacking piece.
2. **Pawn structure determines the outcome:** Passed pawns must be pushed, and pawn islands must be targeted.
3. **Piece coordination is more important than material:** Two coordinated pieces can easily defeat three uncoordinated ones.
4. **Patience and technique matter more than brilliance:** The endgame is about precision, not flashy sacrifices.`
  },
  {
    id: "psychology",
    title: "Psychological Warfare on the Chessboard",
    category: "Psychology",
    readTime: "6 min",
    emoji: "🧠",
    preview: "How grandmasters use psychology, time pressure, and intimidation to gain advantages beyond the board.",
    content: `Chess is not just a battle of minds on the board — it's a psychological war. The greatest players have always understood that managing emotions, time, and opponent psychology is as important as calculation.

### Fischer's Psychological Dominance
Bobby Fischer was famous for his pre-game psychological tactics. He would make unreasonable demands, arrive late, and project an aura of invincibility. During the 1972 World Championship, his erratic behavior completely destabilized Spassky.

### Kasparov's Intimidation
Garry Kasparov was known for his intense stare, dramatic facial expressions, and aggressive body language. Opponents often felt defeated before the game began. He would physically slam pieces onto the board during critical moves.

### Time Pressure as a Weapon
Many grandmasters deliberately play quickly in the opening to put psychological pressure on opponents, then slow down for critical decisions. Putting an opponent in "time trouble" forces them to make crucial decisions with seconds on the clock, drastically increasing the blunder rate.

### Practical Tips
1. **Stay calm under pressure:** Never let your opponent see that you are surprised.
2. **Don't show emotion after blunders:** If you make a mistake, maintain a poker face. Your opponent might not even notice it.
3. **Use your time deliberately:** Think on your opponent's time, and don't rush when you have the advantage.`
  },
];
