export const OPENING_DICTIONARY: Record<string, { name: string; eco: string }> = {
  "e4": { name: "King's Pawn Game", eco: "B00" },
  "e4 c5": { name: "Sicilian Defense", eco: "B20" },
  "e4 e5": { name: "King's Pawn Game", eco: "C20" },
  "e4 e5 Nf3": { name: "King's Knight Opening", eco: "C40" },
  "e4 e5 Nf3 Nc6": { name: "King's Knight Opening", eco: "C44" },
  "e4 e5 Nf3 Nc6 Bb5": { name: "Ruy Lopez", eco: "C60" },
  "e4 e5 Nf3 Nc6 Bc4": { name: "Italian Game", eco: "C50" },
  "e4 e6": { name: "French Defense", eco: "C00" },
  "d4": { name: "Queen's Pawn Game", eco: "A40" },
  "d4 d5": { name: "Queen's Pawn Game", eco: "D00" },
  "d4 d5 c4": { name: "Queen's Gambit", eco: "D06" },
  "d4 Nf6": { name: "Indian Defense", eco: "A45" },
  "d4 Nf6 c4 e6": { name: "Nimzo-Indian Defense", eco: "E20" },
  // ... can be expanded
};

export function detectOpening(pgnMoves: string[]): { name: string; eco: string } {
  // Check up to depth 6
  for (let i = Math.min(pgnMoves.length, 6); i > 0; i--) {
    const sequence = pgnMoves.slice(0, i).join(" ");
    if (OPENING_DICTIONARY[sequence]) {
      return OPENING_DICTIONARY[sequence];
    }
  }
  return { name: "Starting Position", eco: "A00" };
}
