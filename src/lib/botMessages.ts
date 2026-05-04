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
    bot_jimmy: {
      brilliant: ["DUDE. How?!", "You're playing like a grandmaster today!", "I am literally shook."],
      great: ["Fast and deadly. I like it.", "Clean move, very clean.", "You're on fire!"],
      best: ["Spot on.", "The engine loves you.", "Perfect logic."],
      excellent: ["Nice pressure.", "You're squeezing me here.", "Solid."],
      good: ["Okay, I see you.", "Fair enough.", "Keeping it interesting."],
      book: ["Theory nerd!", "You've been studying, haven't you?", "Classic opening."],
      inaccuracy: ["Little bit slow there, buddy.", "I wouldn't have done that.", "You're losing the thread."],
      mistake: ["Yikes. That hurts.", "Thanks for the free stuff!", "You're falling apart."],
      blunder: ["Are you playing with your eyes closed?", "LMAO THANKS.", "This is getting embarrassing for you."],
      forced: ["Had to.", "No choice.", "Stuck."],
    },
    bot_nelson: {
      brilliant: ["Lucky guess.", "Whatever, I'm still winning.", "Don't get cocky."],
      great: ["I've seen better, but fine.", "You found a move. Congrats.", "Trying hard, aren't we?"],
      best: ["Standard. Move on.", "Predictable, but correct.", "Yeah, yeah."],
      excellent: ["You're annoying me now.", "Stop trying so hard.", "Fine move."],
      good: ["Is that it?", "Whatever.", "Next move."],
      book: ["Following instructions like a good human.", "Memorized some lines? Cute.", "Theory won't save you."],
      inaccuracy: ["Trash. Total trash.", "You're pathetic.", "I'm bored. Hurry up and lose."],
      mistake: ["LOOOL. Give me that piece.", "You're so bad at this.", "Why do you even play?"],
      blunder: ["DELETED. Your pieces are mine.", "JUST RESIGN. This is painful to watch.", "Imagine being this bad at chess. LOL."],
      forced: ["Dance for me, puppet.", "Exactly where I want you.", "No escape."],
    },
    bot_isabel: {
      brilliant: ["A tactical masterpiece. I'm impressed.", "You actually found that? Maybe you aren't hopeless.", "Beautiful. Simply beautiful."],
      great: ["Sharp play. Very sharp.", "You have a good eye for tactics.", "Impressive calculation."],
      best: ["The most punishing move. Correct.", "No Mercy. I like it.", "Precise."],
      excellent: ["Solid positional play.", "No weaknesses found.", "Professional."],
      good: ["Good, but not great.", "Slightly passive, but fine.", "I can work with this."],
      book: ["Theoretical precision.", "A well-studied opponent. Interesting.", "Deep lines."],
      inaccuracy: ["A slight error in judgment.", "You're letting the advantage slip.", "Sloppy calculation."],
      mistake: ["A fatal oversight. You'll regret that.", "You just invited disaster.", "Tactically unsound."],
      blunder: ["Disgraceful. Just surrender now.", "I expected better. That was a joke.", "Are you even trying to win, or just wasting my time?"],
      forced: ["The only path to survival.", "Relentless pressure leaves you no choice.", "Trapped."],
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
      blunder: ["OMEGALUL.", "LITERALLY THROWING.", "Are you even trying? That's a huge blunder. Just resign."],
      forced: ["Only move. Literally only move.", "Forced.", "No choice."],
    },
    bot_stockfish: {
      brilliant: ["Evaluating... Optimal move detected.", "Probability of victory increased.", "Mathematical precision."],
      great: ["Highly efficient trajectory.", "Position improved significantly.", "Superior logic."],
      best: ["Selected from 100 million variations.", "The most logical choice.", "Standard optimal play."],
      excellent: ["Satisfactory performance.", "Consistency maintained.", "No errors detected."],
      good: ["Acceptable move.", "Continuing evaluation.", "Proceeding."],
      book: ["Database match found.", "Standard opening sequence.", "Following theory."],
      inaccuracy: ["Sub-optimal move detected. Inefficiency: 0.4cp.", "Heuristic score decreased.", "Calculating punishment."],
      mistake: ["Significant deviation from optimal path.", "Error identified. Human error rate increasing.", "Preparing counter-offensive."],
      blunder: ["CRITICAL ERROR DETECTED.", "Victory is now 99.9% certain.", "Evaluation: +12.5. Surrender to save electricity, human."],
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
