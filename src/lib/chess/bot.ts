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
}

export const RATING_CONFIGS: Record<number, BotConfig> = {
  300: { skillLevel: 0, depth: 1 },
  600: { skillLevel: 1, depth: 2 },
  1000: { skillLevel: 3, depth: 5 },
  1400: { skillLevel: 7, depth: 10, elo: 1400 },
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
  },
  {
    id: "bot-casual",
    name: "Jimmy",
    rating: 600,
    description: "Knows the rules but still hangs pieces. Plays aggressively.",
    avatar: "👦",
    style: "Aggressive",
    delayRange: [800, 2500],
  },
  {
    id: "bot-club",
    name: "Nelson",
    rating: 1000,
    description: "Loves bringing the queen out early. Tactical but structurally flawed.",
    avatar: "👱‍♂️",
    style: "Tactical",
    delayRange: [500, 2000],
  },
  {
    id: "bot-strong",
    name: "Antonio",
    rating: 1400,
    description: "A solid positional player. Doesn't blunder easily.",
    avatar: "👨",
    style: "Positional",
    delayRange: [400, 1500],
  },
  {
    id: "bot-expert",
    name: "Isabel",
    rating: 1800,
    description: "Sharp and dangerous. Excellent at finding tactical shots.",
    avatar: "👩",
    style: "Tactical",
    delayRange: [300, 1200],
  },
  {
    id: "bot-master",
    name: "Vladimir",
    rating: 2200,
    description: "A master of the endgame. Grinds out small advantages.",
    avatar: "👴",
    style: "Endgame Specialist",
    delayRange: [200, 1000],
  },
  {
    id: "bot-gm",
    name: "Magnus",
    rating: 2600,
    description: "Grandmaster strength. Extremely accurate and unforgiving.",
    avatar: "👑",
    style: "Master",
    delayRange: [100, 500],
  },
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
