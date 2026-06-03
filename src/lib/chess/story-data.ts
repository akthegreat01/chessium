export interface DialogueLine {
  moveNumber?: number;
  trigger?: "onLoad" | "onWin" | "onLoss" | "onFirstMove" | "onBlunder";
  text: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  suspectName: string;
  rating: number;
  avatar: string;
  description: string;
  startingFen: string;
  opponentColor: "white" | "black";
  clueTitle: string;
  clueDescription: string;
  dialogue: DialogueLine[];
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "chapter-1",
    title: "Chapter 1: A Cold Welcome",
    suspectName: "Victor (The Butler)",
    rating: 1000,
    avatar: "🤵",
    description: "The butler Victor greets you at the rain-swept foyer of Thorne Manor. He is cold, silent, and highly suspicious. He demands you play him on Lord Alistair's private board.",
    startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    opponentColor: "black",
    clueTitle: "Victor's Alibi & The Black Residue",
    clueDescription: "Victor claims he was in the wine cellar retrieving a bottle of Chateau Margaux when Lord Thorne died. However, he notes that Lord Alistair's fingertips were stained with a dark, sticky black residue at the time of death.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Welcome to Thorne Manor, Detective. Lord Thorne's will was specific—no questions may be answered except on the sixty-four squares. Let us begin."
      },
      {
        moveNumber: 2,
        text: "I served Lord Alistair for thirty years. I knew his favorite openings, his tendencies, his weaknesses. But the night he died... he was playing someone else."
      },
      {
        moveNumber: 6,
        text: "Victor was in the cellar, yes. But I heard raised voices from the study. Lady Beatrice was demanding her inheritance. She plays the King's Gambit—aggressive, reckless, desperate."
      },
      {
        moveNumber: 12,
        text: "When I found Lord Alistair, his hand was clutching his chest. But his fingertips... they were stained pitch black. As if he had been handling charcoal. Or something worse."
      },
      {
        trigger: "onBlunder",
        text: "A slip of the finger? Lord Alistair was distracted in his final game as well. His opponent offered a capture he simply could not resist."
      },
      {
        trigger: "onWin",
        text: "A masterfully played game, Detective. You have the same sharp eye as Lord Alistair. Here is what I know: the wine was untouched. But his fingertips were stained black. The poison was not in his glass."
      },
      {
        trigger: "onLoss",
        text: "Perhaps the retired detective has lost their edge. Lord Alistair would have checkmated me ten moves ago. Try again."
      }
    ]
  },
  {
    id: "chapter-2",
    title: "Chapter 2: The Heiress's Gambit",
    suspectName: "Lady Beatrice",
    rating: 1300,
    avatar: "💃",
    description: "Lord Thorne's niece, Lady Beatrice, sits by the drawing room fireplace. She is furious about being cut out of the will and challenges you to survive her hyper-aggressive attack.",
    startingFen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2", // plays f4 next
    opponentColor: "black",
    clueTitle: "The Ancient Ivory Set",
    clueDescription: "Beatrice reveals that Lord Thorne was playing with his prized possession: a custom, ancient ivory chess set. The black pieces were carved from rare ebony-coated ivory. She also claims Dr. Aris was searching Alistair's desk that night.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Ah, the detective. Victor says you can play, but can you survive my attack? I have no patience for defensive, slow games."
      },
      {
        trigger: "onFirstMove",
        text: "Let us make it interesting. e4 e5 f4! The King's Gambit. A sacrifice. You must give something up to win, Detective. Just like Uncle Alistair did."
      },
      {
        moveNumber: 6,
        text: "They think I did it because of the money. Ridiculous. If I wanted him dead, I wouldn't have left Dr. Aris alone in the study with Alistair's research diary."
      },
      {
        moveNumber: 12,
        text: "Dr. Aris was searching for Alistair's final manuscript. He was terrified of what was in it. Aris plays the French Defense—slow, hiding behind pawns, concealing his secrets."
      },
      {
        trigger: "onBlunder",
        text: "Losing focus? In chess, as in life, greed is a fatal flaw."
      },
      {
        trigger: "onWin",
        text: "Hmph. You defend well. Very well. Here is your clue: Uncle Alistair was playing with his custom ebony-and-ivory set that night. The set he kept locked in the glass case. And Dr. Aris was desperate to get his hands on it."
      },
      {
        trigger: "onLoss",
        text: "Passive and weak. Just like Dr. Aris. Leave my sight and study your tactics."
      }
    ]
  },
  {
    id: "chapter-3",
    title: "Chapter 3: The Cryptic Journal",
    suspectName: "Dr. Aris",
    rating: 1600,
    avatar: "👨‍🏫",
    description: "Dr. Aris, Alistair's long-time rival and paranoid chess theoretician, pacing nervously in the cluttered library. He claims he was trying to save Alistair from a terrible discovery.",
    startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    opponentColor: "black",
    clueTitle: "The Poisoned Piece",
    clueDescription: "Dr. Aris reveals the true murder method: the Black Queen of the custom chess set was coated in a lethal, dark contact toxin that absorbs through the skin. Thorne was baited into a Queen sacrifice, capturing the piece and sealing his fate.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "You think I killed him? No! I was trying to save him! He was going to publish it—the Solving of Chess! It would have killed the game! Play me, I must clear my name!"
      },
      {
        moveNumber: 4,
        text: "Alistair discovered a mathematical proof. A sequence that guarantees a win for White. It would have turned our beautiful art into a solved equation. I begged him to burn it."
      },
      {
        moveNumber: 10,
        text: "The night he died, he was playing a hooded visitor. I looked through the keyhole. Alistair was smiling. He saw a hanging Black Queen. He captured it... and then he screamed."
      },
      {
        moveNumber: 16,
        text: "The poison wasn't in the wine! It was on the Black Queen! A contact nerve agent. The dark ebony lacquer hid it. The killer knew Alistair could never resist a brilliant Queen sacrifice!"
      },
      {
        trigger: "onBlunder",
        text: "Do you not see the danger? You're walking straight into the trap, just like Alistair did!"
      },
      {
        trigger: "onWin",
        text: "Incredible... you see the board so clearly. Listen to me: the killer baited Alistair with a poisoned Queen. The black residue on his fingers was the ebony paint mixed with the toxin. The killer has returned to the manor tonight to retrieve the poisoned piece and the manuscript!"
      },
      {
        trigger: "onLoss",
        text: "No, no! You fell for the bait! You don't have the vision to solve this case."
      }
    ]
  },
  {
    id: "chapter-4",
    title: "Chapter 4: The Poisoned Queen",
    suspectName: "The Mastermind",
    rating: 1900,
    avatar: "👤",
    description: "You enter the dark, dusty study where Alistair died. A hooded figure stands by the window, holding the poisoned Black Queen. It is Victor's true identity—Alistair's twin brother, who wanted the solved manuscript. He challenges you to finish Alistair's final game.",
    startingFen: "r1b2r1k/pp4pp/2n5/4q1N1/2B5/8/PPP2PPP/R2QR1K1 w - - 0 1",
    opponentColor: "black",
    clueTitle: "The Mystery of Chess Preserved",
    clueDescription: "By checkmating the Mastermind without capturing the poisoned Black Queen, you solved the mystery and saved your own life. You discover Alistair's completed manuscript, but realize its publication would end the magic of chess forever. You throw it into the fireplace.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "So, you solved my little riddle, Detective. You know about the contact toxin. But can you resist it? Here is Alistair's final position. The Black Queen is hanging on e5. Take her, if you dare."
      },
      {
        moveNumber: 2,
        text: "Why do you hesitate? The Queen is free. Capture her and win the game. Or are you afraid of a little paint?"
      },
      {
        moveNumber: 4,
        text: "Alistair was a genius, but his greed was his undoing. He saw the sacrifice, he took the Queen, and he died. Will you share his fate?"
      },
      {
        trigger: "onWin",
        text: "No! How... how did you find checkmate without capturing my Queen? You bypassed the trap! You solved Alistair's final gambit..."
      },
      {
        trigger: "onLoss",
        text: "Hahaha! Greed checkmates even the cleverest minds. The contact poison claims another victim. Goodbye, Detective."
      }
    ]
  }
];
