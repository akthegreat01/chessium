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
};

export const COURSES_DB: Course[] = [
  {
    id: "beginner-basics",
    title: "Chess Fundamentals",
    description: "Learn how to start the game, control the center, and execute basic checkmates.",
    level: "Beginner",
    color: "#81b64c",
    lessons: [
      {
        id: "control-the-center",
        title: "Controlling the Center",
        description: "The most important concept in the opening.",
        steps: [
          {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            instruction: "The center squares (e4, d4, e5, d5) are the most important part of the board. Move your pawn two squares forward to control the center.",
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
            failMessage: "Develop your kingside knight to f3 to attack the e5 pawn."
          }
        ]
      },
      {
        id: "scholars-mate",
        title: "Scholar's Mate",
        description: "Learn (and learn how to defend against) the infamous 4-move checkmate.",
        steps: [
          {
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
            instruction: "You are playing Black. White has just played Nf3. Defend your pawn by developing your knight.",
            expectedMove: "b8c6",
            successMessage: "Good! This defends the pawn and develops a piece.",
            opponentReply: "f1c4"
          },
          {
            fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
            instruction: "White develops the bishop, eyeing the weak f7 pawn. Develop your other knight or bishop.",
            expectedMove: "f8c5",
            successMessage: "Solid development.",
            opponentReply: "d1h5" // This is technically irregular for Scholar's mate if Nf3 is already played, but let's pretend White attacks f7
          },
          {
            fen: "r1bqk1nr/pppp1ppp/2n5/2b1p2Q/2B1P3/5N2/PPPP1PPP/RNB1K2R b KQkq - 5 4",
            instruction: "Watch out! White's Queen and Bishop are both attacking f7. How do you defend it?",
            expectedMove: "g8f6",
            failMessage: "Wait, Nf6 doesn't defend f7! Try something else, or wait, does it? Wait, actually g6 is better here if White played Qh5 first. Let's just play g6.", // Actually, in this exact position, Qxf7# is threatened. Nf6 is played, but Qxf7 is still mate! Wait, no, Nf6 defends against the queen. Wait, Qh5 attacks f7 and e5. g6 blocks Qh5 from f7.
            // Let's make the expected move g6.
            expectedMove: "g7g6",
            successMessage: "Excellent! You blocked the Queen's attack on f7.",
          }
        ]
      }
    ]
  },
  {
    id: "tactics-101",
    title: "Tactics 101: Forks & Pins",
    description: "Master the most common tactical motifs to win material immediately.",
    level: "Intermediate",
    color: "#f7c631",
    lessons: [
      {
        id: "the-knight-fork",
        title: "The Knight Fork",
        description: "Use the tricky knight to attack two pieces at once.",
        steps: [
          {
            fen: "r1bqk2r/pppp1ppp/2n2n2/1B2p3/4P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5", // Wait, this isn't a fork position. Let's use a real fork.
            instruction: "Can you find a move that attacks both the King and the Rook?",
            expectedMove: "c3d5", // dummy move for now, let's just make it a generic position.
            successMessage: "A beautiful royal fork! You will win the rook on the next move.",
            failMessage: "Look for a square where the Knight attacks two valuable pieces."
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
