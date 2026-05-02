import { BotPersonality } from "./chessStore";

type MoveQuality = 'brilliant' | 'great' | 'best' | 'excellent' | 'good' | 'book' | 'inaccuracy' | 'mistake' | 'blunder' | 'forced';

export const getBotResponse = (bot: BotPersonality, quality: MoveQuality, isBotMove: boolean): string => {
  const responses: Record<string, Record<MoveQuality, string[]>> = {
    bot_martin: {
      brilliant: ["I don't know what that was, but it looked shiny!", "Wait, are you cheating? Just kidding!", "Wow, that was lucky!"],
      great: ["Good job!", "I like that move.", "You're getting better!"],
      best: ["That was the best move!", "I would have played that too... maybe.", "Nice one."],
      excellent: ["Excellent!", "Keep it up.", "Cool move."],
      good: ["That's a good move.", "I see what you're doing.", "Okay!"],
      book: ["Is this from a book? I don't like reading.", "Opening theory! Fancy.", "I know this one."],
      inaccuracy: ["Oops?", "Did you mean to do that?", "I think I can handle that."],
      mistake: ["Oh, a mistake!", "You left something hanging!", "Haha, I see a way in."],
      blunder: ["NOOO! Not your queen!", "That was a BIG mistake.", "I'm going to win now, right?"],
      forced: ["You HAD to do that.", "No choice there!", "Forced move."],
    },
    bot_hikaru: {
      brilliant: ["That is actually insane. You're a literal god.", "Wait, what? Is that the best move? It is!", "Chat, they actually found that. That's crazy."],
      great: ["Good move. Very solid.", "I like the engine line here.", "Yeah, that's top tier."],
      best: ["Exactly. The most forcing move.", "Straightforward. I'd play that in blitz.", "No hesitation there."],
      excellent: ["Super solid. No counterplay.", "I've seen this position before, that's the one.", "Keep pushing the advantage."],
      good: ["Okay, fine.", "Nothing wrong with that.", "Standard stuff."],
      book: ["Total theory. We've seen this 100 times.", "Still in the database.", "Boring theory."],
      inaccuracy: ["That's a bit slow.", "I don't love it.", "You're giving me a chance."],
      mistake: ["That's just bad.", "Wait, why would you do that?", "You're throwing!"],
      blunder: ["OMEGALUL.", "LITERALLY THROWING.", "Are you even trying? That's a huge blunder."],
      forced: ["Only move. Literally only move.", "Forced.", "No choice."],
    },
    bot_stockfish: {
      brilliant: ["Evaluating... Optimal move detected.", "Probability of victory increased.", "Mathematical precision."],
      great: ["Highly efficient trajectory.", "Position improved significantly.", "Superior logic."],
      best: ["Selected from 100 million variations.", "The most logical choice.", "Standard optimal play."],
      excellent: ["Satisfactory performance.", "Consistency maintained.", "No errors detected."],
      good: ["Acceptable move.", "Continuing evaluation.", "Proceeding."],
      book: ["Database match found.", "Standard opening sequence.", "Following theory."],
      inaccuracy: ["Sub-optimal move detected.", "Heuristic score decreased.", "Calculating punishment."],
      mistake: ["Significant deviation from optimal path.", "Error identified.", "Preparing counter-offensive."],
      blunder: ["CRITICAL ERROR.", "Victory is now 99.9% certain.", "Evaluation: +9.5. Game over."],
      forced: ["Move is strictly constrained.", "Forced continuation.", "Single valid path."],
    }
  };

  const generic: Record<MoveQuality, string[]> = {
    brilliant: ["Unbelievable move!", "That was brilliant!", "Genius!"],
    great: ["Great move!", "Very well played.", "Impressive."],
    best: ["That was the best move.", "Spot on.", "Perfect."],
    excellent: ["Excellent choice.", "Solid play.", "Nicely done."],
    good: ["Good move.", "Fair enough.", "I see."],
    book: ["Solid opening theory.", "Classic book move.", "Standard."],
    inaccuracy: ["Slightly inaccurate.", "Not quite right.", "I've seen better."],
    mistake: ["That was a mistake.", "You're slipping.", "Watch out."],
    blunder: ["Huge blunder!", "You just lost the game.", "How could you?"],
    forced: ["Only move available.", "That was forced.", "You had to."],
  };

  const personalityResponses = responses[bot.id] || generic;
  const pool = personalityResponses[quality];
  return pool[Math.floor(Math.random() * pool.length)];
};
