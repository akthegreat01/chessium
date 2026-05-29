import { User, Flame, Shield, Crown } from "lucide-react";

export interface AIPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarIcon: any; // Lucide icon
  colorClass: string;
  engine: {
    skillLevel: number; // 0 to 20
    depth: number;
    moveTimeMin: number; // min ms delay
    moveTimeMax: number; // max ms delay
  };
  dialogue: {
    start: string[];
    winning: string[];
    losing: string[];
    draw: string[];
    blunder: string[]; // when user blunders
  };
}

export const aiPersonalities: AIPersonality[] = [
  {
    id: "rookie",
    name: "The Rookie",
    title: "Beginner",
    description: "Just learned how the pieces move. Plays fast and makes frequent mistakes.",
    avatarIcon: User,
    colorClass: "bg-blue-500",
    engine: {
      skillLevel: 0,
      depth: 1,
      moveTimeMin: 200,
      moveTimeMax: 800,
    },
    dialogue: {
      start: ["Let's have a fun game!", "I'm still learning, go easy on me.", "Good luck!"],
      winning: ["Wow, am I actually winning?", "I think I have a good position here!"],
      losing: ["Oops, I didn't see that.", "You're really good at this.", "My position is falling apart..."],
      draw: ["A draw? I'll take it!", "That was a close one."],
      blunder: ["Wait, did you mean to do that?", "I'll take a free piece!"],
    }
  },
  {
    id: "aggressor",
    name: "The Aggressor",
    title: "Tactical Brawler",
    description: "Loves sharp lines and attacking chess. Will sacrifice material for the initiative.",
    avatarIcon: Flame,
    colorClass: "bg-orange-500",
    engine: {
      skillLevel: 8,
      depth: 8,
      moveTimeMin: 400,
      moveTimeMax: 1200,
    },
    dialogue: {
      start: ["Prepare to defend.", "I don't play for draws.", "Let's make this chaotic."],
      winning: ["Your king is completely exposed.", "The attack is crashing through!", "Tactics flow from a superior position."],
      losing: ["My attack fizzled out...", "You defended well, I'll admit.", "I flew too close to the sun."],
      draw: ["A draw is a failure for both of us.", "I should have pushed harder."],
      blunder: ["A fatal mistake. Thank you.", "I was hoping you'd play that.", "The tactics are working!"],
    }
  },
  {
    id: "boa",
    name: "The Boa Constrictor",
    title: "Positional Master",
    description: "Plays extremely solid, positional chess. Slowly suffocates opponents without taking risks.",
    avatarIcon: Shield,
    colorClass: "bg-emerald-600",
    engine: {
      skillLevel: 14,
      depth: 14,
      moveTimeMin: 1000,
      moveTimeMax: 3000,
    },
    dialogue: {
      start: ["Patience is the key to chess.", "Let's build a solid position.", "I am in no rush."],
      winning: ["Your weaknesses are permanent.", "The pressure is insurmountable now.", "A slight edge is all I need."],
      losing: ["I miscalculated the endgame.", "Your position was surprisingly resilient.", "My structure collapsed."],
      draw: ["A solid, logical conclusion.", "Neither of us made a critical error."],
      blunder: ["An unforced error. I will convert this.", "Your structure is ruined.", "That pawn will cost you the game."],
    }
  },
  {
    id: "grandmaster",
    name: "The Grandmaster",
    title: "Stockfish 16.1",
    description: "Maximum strength engine. Plays flawlessly. Good luck.",
    avatarIcon: Crown,
    colorClass: "bg-purple-600",
    engine: {
      skillLevel: 20,
      depth: 20,
      moveTimeMin: 100, // Thinks fast because it's an engine
      moveTimeMax: 500,
    },
    dialogue: {
      start: ["I calculate 20 moves deep. Your turn.", "This will be brief.", "Standard opening lines."],
      winning: ["Mate in 14.", "Your position evaluates to -8.5.", "The outcome is mathematically certain."],
      losing: ["Error 404: Losing position not found.", "Fascinating. I underestimated that line.", "Hardware limitation detected."], // Easter egg
      draw: ["A theoretical draw.", "0.00 evaluation."],
      blunder: ["Evaluation dropped by 4.2 points.", "Inaccurate. I will exploit this.", "??"],
    }
  }
];
