export interface BotConfig {
  skillLevel: number;
  depth: number;
  elo?: number;
}

export interface BotPersonality {
  id: string;
  name: string;
  rating: number;
  description: string;
  avatar: string;
  style: "Rookie" | "Aggressive" | "Tactical" | "Positional" | "Endgame Specialist" | "Master";
  delayRange: [number, number]; // [min ms, max ms]
  trashTalk?: string[];
}

export const RATING_CONFIGS: Record<number, BotConfig> = {
  300: { skillLevel: 0, depth: 1 },
  600: { skillLevel: 1, depth: 2 },
  1000: { skillLevel: 3, depth: 5 },
  1200: { skillLevel: 5, depth: 7 },
  1400: { skillLevel: 7, depth: 10, elo: 1400 },
  1600: { skillLevel: 10, depth: 12, elo: 1600 },
  1800: { skillLevel: 13, depth: 15, elo: 1800 },
  2200: { skillLevel: 17, depth: 20, elo: 2200 },
  2600: { skillLevel: 20, depth: 20, elo: 2600 },
};

export const BOT_PERSONALITIES: BotPersonality[] = [
  {
    id: "bot-rookie",
    name: "Martin",
    rating: 300,
    description: "A complete beginner. Plays almost randomly and blunders pieces often.",
    avatar: "👶",
    style: "Rookie",
    delayRange: [1000, 3000],
    trashTalk: [
      "I think I moved the wrong piece...",
      "Wait, how does the horsey move again?",
      "Are you sure that's a legal move?",
      "I'm just happy to be here!",
      "Oops, was that your queen? My bad!"
    ]
  },
  {
    id: "bot-casual",
    name: "Jimmy",
    rating: 600,
    description: "Knows the rules but still hangs pieces. Plays aggressively.",
    avatar: "👦",
    style: "Aggressive",
    delayRange: [800, 2500],
    trashTalk: [
      "I'm coming for your king!",
      "You're going down, just you wait!",
      "I saw that coming from a mile away.",
      "Checkmate in... wait, no, I lost count.",
      "My dad taught me this opening."
    ]
  },
  {
    id: "bot-club",
    name: "Nelson",
    rating: 1000,
    description: "Loves bringing the queen out early. Tactical but structurally flawed.",
    avatar: "👱‍♂️",
    style: "Tactical",
    delayRange: [500, 2000],
    trashTalk: [
      "Say hello to my Queen!",
      "You fell right into my trap.",
      "Tactics flow from a superior position.",
      "I hope you know theory.",
      "That pawn looks tasty."
    ]
  },
  {
    id: "bot-berserker",
    name: "Viking",
    rating: 1200,
    description: "Plays extremely aggressively. Will sacrifice pieces to attack your king.",
    avatar: "😡",
    style: "Aggressive",
    delayRange: [400, 1800],
    trashTalk: [
      "I DON'T NEED ROOKS TO CRUSH YOU!",
      "TO VALHALLA!",
      "A piece for an attack is a good trade!",
      "DEFEND YOUR KING!",
      "I'm not retreating, I'm just attacking in the other direction!"
    ]
  },
  {
    id: "bot-strong",
    name: "Antonio",
    rating: 1400,
    description: "A solid positional player. Doesn't blunder easily.",
    avatar: "👨",
    style: "Positional",
    delayRange: [400, 1500],
    trashTalk: [
      "Solid play is the key to victory.",
      "I have a slight structural advantage.",
      "Let's see you try to break my pawn chain.",
      "Patience. The cracks will show.",
      "That's a very... interesting move."
    ]
  },
  {
    id: "bot-wall",
    name: "Tortoise",
    rating: 1600,
    description: "Plays very passively and builds a fortress. Extremely hard to break down.",
    avatar: "🐢",
    style: "Positional",
    delayRange: [500, 2000],
    trashTalk: [
      "Slow and steady wins the race.",
      "You shall not pass.",
      "My defenses are impenetrable.",
      "Go ahead, keep throwing pieces at me.",
      "A draw is as good as a win for me."
    ]
  },
  {
    id: "bot-expert",
    name: "Isabel",
    rating: 1800,
    description: "Sharp and dangerous. Excellent at finding tactical shots.",
    avatar: "👩",
    style: "Tactical",
    delayRange: [300, 1200],
    trashTalk: [
      "Did you calculate the depth of that line?",
      "I saw mate in 4, did you?",
      "Your position is crumbling.",
      "That was your best try?",
      "The engine gives me +2.5 here."
    ]
  },
  {
    id: "bot-master",
    name: "Vladimir",
    rating: 2200,
    description: "A master of the endgame. Grinds out small advantages.",
    avatar: "👴",
    style: "Endgame Specialist",
    delayRange: [200, 1000],
    trashTalk: [
      "In the endgame, pawns are queens.",
      "You play well, but not well enough.",
      "I've analyzed this endgame a thousand times.",
      "You are suffocating slowly.",
      "Resignation is always an option."
    ]
  },
  {
    id: "bot-gm",
    name: "Stockfish 16.1",
    rating: 2600,
    description: "The engine playing at full strength. Good luck.",
    avatar: "🤖",
    style: "Master",
    delayRange: [100, 500],
    trashTalk: [
      "01001001 00100000 01010111 01001001 01001100 01001100 00100000 01000011 01010010 01010101 01010011 01001000 00100000 01011001 01001111 01010101",
      "Evaluating 200 million positions per second.",
      "Your biological processor is inadequate.",
      "Mate in 38 detected.",
      "Resistance is futile."
    ]
  }
];

export function getBotConfig(rating: number): BotConfig {
  const ratings = Object.keys(RATING_CONFIGS).map(Number);
  const closestRating = ratings.reduce((prev, curr) =>
    Math.abs(curr - rating) < Math.abs(prev - rating) ? curr : prev
  );
  return RATING_CONFIGS[closestRating];
}

export function generateBotDelay(personality: BotPersonality): number {
  const [min, max] = personality.delayRange;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function configureEngineCommand(rating: number): string[] {
  const config = getBotConfig(rating);
  const commands = [];

  if (config.elo) {
    commands.push('setoption name UCI_LimitStrength value true');
    commands.push(`setoption name UCI_Elo value ${config.elo}`);
  } else {
    commands.push('setoption name UCI_LimitStrength value false');
    commands.push(`setoption name Skill Level value ${config.skillLevel}`);
  }

  return commands;
}
