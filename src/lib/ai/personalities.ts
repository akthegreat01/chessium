import { User, Flame, Shield, Crown } from "lucide-react";

export interface AIPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  avatarIcon: any; // Lucide icon (fallback)
  avatarImage?: string; // High res PFP
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
    avatarImage: "/bots/rookie.png",
    colorClass: "bg-blue-500",
    engine: {
      skillLevel: 0,
      depth: 1,
      moveTimeMin: 200,
      moveTimeMax: 800,
    },
    dialogue: {
      start: ["Hi! I'm still learning, please go easy on me...", "Let's have a fun game!", "Wait, how does the horsey move again?"],
      winning: ["Wow, am I actually winning?!", "I think I clicked the right button!", "Is this what being a Grandmaster feels like?"],
      losing: ["Oh no, my position is falling apart...", "You're too good! Please stop taking my pieces!", "I didn't see that coming at all..."],
      draw: ["A draw? Yay, I didn't lose!", "That was a close one, phew!"],
      blunder: ["Wait, did you mean to just give me that piece?", "I'll gladly take that free piece, thanks!"],
    }
  },
  {
    id: "aggressor",
    name: "The Aggressor",
    title: "Tactical Brawler",
    description: "Loves sharp lines and attacking chess. Will sacrifice material for the initiative.",
    avatarIcon: Flame,
    avatarImage: "/bots/aggressor.png",
    colorClass: "bg-orange-500",
    engine: {
      skillLevel: 8,
      depth: 8,
      moveTimeMin: 400,
      moveTimeMax: 1200,
    },
    dialogue: {
      start: ["I'm going to crush you.", "Prepare to get checkmated in 10 moves.", "I hope you brought a helmet."],
      winning: ["Told you. You're completely lost.", "Just resign already, you're embarrassing yourself.", "My attack is unstoppable. Cry about it."],
      losing: ["Lucky move. Won't happen again.", "You're only winning because I'm playing fast.", "Enjoy it while it lasts, my counterattack is coming."],
      draw: ["You got lucky this time.", "A draw is a win for you."],
      blunder: ["Are you blind? Thanks for the free material.", "Wow, what a terrible move. I almost feel bad.", "Did your finger slip or are you just bad?"],
    }
  },
  {
    id: "boa",
    name: "The Boa Constrictor",
    title: "Positional Master",
    description: "Plays extremely solid, positional chess. Slowly suffocates opponents without taking risks.",
    avatarIcon: Shield,
    avatarImage: "/bots/master.png",
    colorClass: "bg-purple-500",
    engine: {
      skillLevel: 15,
      depth: 12,
      moveTimeMin: 600,
      moveTimeMax: 2000,
    },
    dialogue: {
      start: ["Let us play a positional masterpiece.", "Take your time. You'll need it.", "Chess is an art, let's paint."],
      winning: ["Your position is structurally bankrupt.", "I'm squeezing the life out of your pieces.", "The evaluation bar doesn't lie."],
      losing: ["An interesting continuation. Let's see if you can convert it.", "I may be down material, but my position has compensation.", "A rare miscalculation on my part."],
      draw: ["A perfectly balanced endgame.", "A fair result for both of us."],
      blunder: ["A fundamental misunderstanding of the position.", "You just violated basic chess principles. Punished.", "I saw that blunder 5 moves ago."],
    }
  },
  {
    id: "grandmaster",
    name: "The Grandmaster",
    title: "Stockfish 16.1",
    description: "Maximum strength engine. Plays flawlessly. Good luck.",
    avatarIcon: Crown,
    avatarImage: "/bots/grandmaster.png",
    colorClass: "bg-red-500",
    engine: {
      skillLevel: 20,
      depth: 20,
      moveTimeMin: 100, // Thinks fast because it's an engine
      moveTimeMax: 500,
    },
    dialogue: {
      start: ["I am perfection. Your defeat is mathematically guaranteed.", "I have already calculated the next 20 moves.", "Begin."],
      winning: ["Evaluation: +M7. Resistance is futile.", "You are playing like a 400 Elo human.", "I am flawless. You are making systematic errors."],
      losing: ["Error: Impossible state detected.", "Are you using an engine? This is statistically unlikely.", "Recalculating..."],
      draw: ["You found the only drawing line in 40 billion possibilities. Impressive.", "A theoretical draw."],
      blunder: ["Blunder detected. Win probability increased to 99.9%.", "A human error. How predictable.", "I will crush you for that mistake."],
    }
  }
];
