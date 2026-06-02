export type LessonStep = {
  fen: string;
  instruction: string;
  expectedMove: string; // UCI format e.g. "e2e4"
  successMessage: string;
  failMessage?: string;
  opponentReply?: string; // UCI format move the opponent makes automatically
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  steps: LessonStep[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  lessons: Lesson[];
  longDescription?: string;
  whatYouWillLearn?: string[];
};

export const COURSES_DB: Course[] = [
  {
    id: "beginner-basics",
    title: "Chess Fundamentals",
    description: "Learn how to start the game, control the center, and execute basic checkmates.",
    level: "Beginner",
    color: "#81b64c",
    longDescription: `Welcome to the foundational course of your chess journey. Chess is a game of infinite complexity, but every grandmaster started by learning the basic principles of the opening, middlegame, and endgame. In this comprehensive course, we will break down the essential concepts that you need to play competitive chess. 

You will learn the absolute golden rules of the opening: fighting for control of the central squares, developing your minor pieces efficiently, and prioritizing king safety through early castling. We will explore why breaking these rules often leads to quick, devastating losses, and how you can punish opponents who neglect these principles.

Furthermore, we will delve into the critical patterns of checkmate. Identifying and executing checkmates is the ultimate goal of the game. We will cover basic mating nets and common blunders like Scholar's Mate. By the end of this course, you will have a solid framework for how to approach any chess game, ensuring you transition from the opening into the middlegame with a comfortable and fighting position.`,
    whatYouWillLearn: [
      "The paramount importance of central control in the opening phase",
      "How to rapidly and safely develop your knights and bishops",
      "Recognizing and defending against early traps like Scholar's Mate",
      "The value of king safety and when to castle",
      "Basic mating patterns and how to exploit weak squares",
      "How to formulate a simple plan in the early middlegame"
    ],
    lessons: [
      {
        id: "control-the-center",
        title: "Controlling the Center",
        description: "The most important concept in the opening.",
        steps: [
          {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            instruction: "The center squares (e4, d4, e5, d5) are the most important part of the board. Move your King's pawn two squares forward to control the center.",
            expectedMove: "e2e4",
            successMessage: "Excellent! You control the d5 and f5 squares and open diagonals for your Queen and Bishop.",
            failMessage: "Try moving the e-pawn two squares forward (e2-e4).",
            opponentReply: "e7e5"
          },
          {
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
            instruction: "Black replied by also fighting for the center. Now develop your Knight to attack the center and the black pawn.",
            expectedMove: "g1f3",
            successMessage: "Great! Developing knights before bishops is a solid rule of thumb.",
            failMessage: "Develop your kingside knight to f3 to attack the e5 pawn.",
            opponentReply: "b8c6"
          },
          {
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 1 3",
            instruction: "Black defended their pawn. Now develop your Bishop to an active square attacking the center.",
            expectedMove: "f1c4",
            successMessage: "Perfect! You've played the Italian Game opening. You control the center and are ready to castle.",
            failMessage: "Move your Bishop to c4 to eye the weak f7 square."
          }
        ]
      },
      {
        id: "scholars-mate",
        title: "Defending Scholar's Mate",
        description: "Learn how to defend against the infamous 4-move checkmate.",
        steps: [
          {
            fen: "rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2",
            instruction: "You are playing Black. White has just played Bc4, aiming at your weak f7 pawn. Defend your e5 pawn and develop your knight.",
            expectedMove: "b8c6",
            successMessage: "Good! This defends the pawn and develops a piece.",
            opponentReply: "d1h5"
          },
          {
            fen: "r1bqkbnr/pppp1ppp/2n5/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3",
            instruction: "Watch out! White's Queen and Bishop are both attacking f7, threatening checkmate. How do you defend it?",
            expectedMove: "g7g6",
            successMessage: "Excellent! You blocked the Queen's attack on f7.",
            failMessage: "Play g6 to block the Queen's path to f7.",
            opponentReply: "h5f3"
          },
          {
            fen: "r1bqkbnr/pppp1p1p/2n3p1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 1 4",
            instruction: "White is persistent! They are attacking f7 again. Develop your knight to block the attack once more.",
            expectedMove: "g8f6",
            successMessage: "Brilliant! You've successfully defended against Scholar's Mate and have a great position.",
            failMessage: "Develop your knight to f6 to block the Queen's attack."
          }
        ]
      }
    ]
  },
  {
    id: "tactics-101",
    title: "Tactics 101",
    description: "Master the most common tactical motifs to win material immediately.",
    level: "Intermediate",
    color: "#f7c631",
    longDescription: `Tactics are the lifeblood of chess. It is often said that chess is 99% tactics, and improving your tactical vision is the fastest way to increase your rating and win more games. A tactic is a short sequence of moves that forces an immediate, tangible advantage, usually resulting in winning material (like a pawn or a piece) or delivering checkmate.

In this rigorous intermediate course, we will explore the fundamental tactical motifs that appear constantly in real games. We will study the geometry of the chessboard to understand how pieces coordinate to create devastating threats. 

You will master the art of the 'Fork', where a single piece simultaneously attacks two or more enemy pieces. You will learn how to employ the 'Pin', paralyzing opponent's pieces by tying them to the defense of a more valuable target. We will also cover 'Skewers', 'Discovered Attacks', and 'Removing the Defender'. By training your brain to recognize these patterns instantly, you will be able to spot winning combinations in your own games and avoid falling into your opponent's tactical traps.`,
    whatYouWillLearn: [
      "Identifying and executing devastating Knight and Pawn Forks",
      "Utilizing Absolute and Relative Pins to paralyze the opponent",
      "Executing Skewers to win valuable pieces behind lesser ones",
      "Setting up and unleashing Discovered Attacks",
      "Calculating short forcing sequences accurately",
      "Improving board vision and piece awareness"
    ],
    lessons: [
      {
        id: "the-knight-fork",
        title: "The Knight Fork",
        description: "Use the tricky knight to attack two pieces at once.",
        steps: [
          {
            fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P1n1/2NP1N2/PPP2PPP/R1BQK2R b KQkq - 0 6",
            instruction: "White has played poorly. Find a knight move that attacks both the Queen and the Rook (a family fork!).",
            expectedMove: "g4f2",
            successMessage: "A beautiful royal fork! You will win material on the next move.",
            failMessage: "Look for a square where the Knight attacks two valuable pieces.",
            opponentReply: "d1e2"
          },
          {
            fen: "r1bqk2r/pppp1ppp/2n5/2b1p3/2B1P3/2NP1N2/PPP1QnPP/R1B1K2R b KQkq - 1 7",
            instruction: "The Queen moved. Now capture the Rook!",
            expectedMove: "f2h1",
            successMessage: "Great job! You won a full Rook.",
            failMessage: "Capture the Rook on h1."
          }
        ]
      },
      {
        id: "the-pin",
        title: "The Absolute Pin",
        description: "Pin your opponent's pieces to their King so they cannot move.",
        steps: [
          {
            fen: "rnbqk2r/pppp1ppp/5n2/4p3/1b2P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq - 4 5",
            instruction: "Black's Bishop on b4 is pinning your c3 Knight to your King. But wait! You can pin Black's f6 Knight to their Queen. Find the move.",
            expectedMove: "c1g5",
            successMessage: "Excellent! The f6 Knight is now pinned. If it moves, Black loses their Queen.",
            failMessage: "Move your dark-squared bishop to pin the f6 knight to the d8 queen.",
            opponentReply: "h7h6"
          },
          {
            fen: "rnbqk2r/pppp1pp1/5n1p/4p1B1/1b2P3/2N2N2/PPPP1PPP/R2QKB1R w KQkq - 0 6",
            instruction: "Black is questioning your Bishop. Maintain the pin by retreating to h4.",
            expectedMove: "g5h4",
            successMessage: "Perfect. The pin is maintained, and Black's position is uncomfortable.",
            failMessage: "Retreat the bishop to h4."
          }
        ]
      }
    ]
  }
];

export function getCourse(id: string): Course | undefined {
  return COURSES_DB.find((c) => c.id === id);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourse(courseId);
  return course?.lessons.find((l) => l.id === lessonId);
}
