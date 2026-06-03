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
    title: "Chapter 1: The Partner's Betrayal",
    suspectName: "Victor (The Butler)",
    rating: 1000,
    avatar: "🤵",
    description: "The butler Victor greets you at the foyer. He serves you tea, which you realize too late is laced with a slow-acting poison. Victor demands you play him, claiming he was double-crossed by Alistair himself.",
    startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    opponentColor: "black",
    clueTitle: "Victor's Alibi & The Swapped Body",
    clueDescription: "Victor confesses he was Alistair Thorne's secret lover and co-conspirator. They planned to fake Alistair's death using a lookalike body to escape the Black Rook secret society. But Alistair betrayed Victor, and the fake death was turned into a real murder. Alistair's fingers were stained pitch black from the poisonous ebony lacquer.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Drink your tea, Detective. Or should I say... Alistair's favorite son? You've already swallowed the toxin. Play the board if you want to live. Only Alistair has the key to the antidote."
      },
      {
        moveNumber: 2,
        text: "I loved him. I spent thirty years serving him, hiding our relationship. We planned to fake his death and run away. But he was going to betray me and leave with the manuscript and you!"
      },
      {
        moveNumber: 6,
        text: "Beatrice was in the drawing room, screaming about money. She had no idea she was Alistair's biological daughter. She plays the King's Gambit—reckless, aggressive, and full of hate."
      },
      {
        moveNumber: 12,
        text: "The lookalike body at the desk was Dr. Aris's missing assistant. But someone replaced our fake poison with a real contact toxin on the Black Queen. Alistair's hands were stained black when I found him."
      },
      {
        trigger: "onBlunder",
        text: "A blunder. Alistair was distracted too. Greed is a poison of the mind, Detective."
      },
      {
        trigger: "onWin",
        text: "You play with his exact conviction. Very well. The poison on Alistair's hands came from the Black Queen of his custom ivory set. Dr. Aris stole it from the crime scene. Find him."
      },
      {
        trigger: "onLoss",
        text: "The poison is already slowing your brain. Lord Alistair would have mated me in ten. Try again."
      }
    ]
  },
  {
    id: "chapter-2",
    title: "Chapter 2: The Biological Heiress",
    suspectName: "Lady Beatrice",
    rating: 1300,
    avatar: "💃",
    description: "Lady Beatrice confronts you in the Drawing Room. She reveals she is Alistair's biological daughter from an affair with his rival's wife, and admits she tried to kill him—only to be double-crossed.",
    startingFen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    opponentColor: "black",
    clueTitle: "The Untouched Poisoned Wine",
    clueDescription: "Beatrice admits she poisoned Alistair's wine glass out of rage for leaving his fortune to you, his adopted son. But when she crept in, he was already dead, sitting at the chess board. The poison in the glass was untouched, meaning someone else struck first with a contact toxin on the board itself.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "So Victor poisoned you? Good. That butler was Alistair's shadow. Let's see if you have the strength to fight my King's Gambit, or if the poison claims you first."
      },
      {
        trigger: "onFirstMove",
        text: "1. e4 e5 2. f4! The King's Gambit. A sacrifice. My mother was Alistair's rival's wife. I am his biological daughter! Yet he was leaving everything to you, a stray detective!"
      },
      {
        moveNumber: 6,
        text: "Yes, I poisoned his wine glass that night! I wanted my inheritance. But when I went to check on him, his head was slumped on the board. He hadn't even touched the wine. Someone beat me to it."
      },
      {
        moveNumber: 12,
        text: "Dr. Aris was searching Alistair's desk. Aris knew about the solved chess manuscript. Aris plays the French Defense—passive, hiding behind pawns, hiding his theft of the poisoned chess pieces."
      },
      {
        trigger: "onBlunder",
        text: "Failing to see the threats? Just like Uncle Alistair when he reached for the black piece."
      },
      {
        trigger: "onWin",
        text: "Fine, you win. The clue: my poisoned wine was untouched. Alistair died from touching the custom ebony Black Queen. Dr. Aris stole the poisoned pieces to study the contact toxin. He is in the Library."
      },
      {
        trigger: "onLoss",
        text: "A passive player, just like Dr. Aris. The poison is taking hold. Goodbye, detective."
      }
    ]
  },
  {
    id: "chapter-3",
    title: "Chapter 3: The Stolen Poison",
    suspectName: "Dr. Aris",
    rating: 1600,
    avatar: "👨‍🏫",
    description: "Dr. Aris pacing frantically in the library. He reveals he stole the Black Queen to study the nerve agent that killed Alistair, and tells you of Alistair's secret desk drawer.",
    startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    opponentColor: "black",
    clueTitle: "The Antidote Passcode",
    clueDescription: "Dr. Aris explains that the antidote is in a mechanical drawer inside Alistair's desk, locked with a chess coordinate passcode. He confirms the Black Queen was coated in a contact toxin. He says the killer left the game notation sheet on the board, ending in checkmate coordinate 'Nf7'.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "I didn't kill him! I stole the Black Queen to study the toxin! It's a rare nerve agent. Alistair was blackmailing me! Play, play... I will tell you how to get the antidote!"
      },
      {
        moveNumber: 4,
        text: "Alistair solved chess. He discovered the White winning sequence. It would have ruined the game. He was blackmailing me with my old research diaries to force me to publish it under his name."
      },
      {
        moveNumber: 10,
        text: "The night he died, he was playing a hooded visitor. I saw Alistair reach for the Black Queen. It was a bait, a sacrifice. He touched the poisoned ebony lacquer and died in agony."
      },
      {
        moveNumber: 16,
        text: "The antidote is in Alistair's desk drawer. It is locked by a mechanical grid. The passcode is the coordinate of the final checkmating move of Alistair's master game—Nf7!"
      },
      {
        trigger: "onBlunder",
        text: "Watch your pieces! The poison is clouding your vision!"
      },
      {
        trigger: "onWin",
        text: "You have the mind of a grandmaster. The clue: the antidote is locked in Alistair's desk. The code is 'Nf7'—the coordinate of the smothered mate. The hooded killer is waiting for you in the study. It is Alistair himself!"
      },
      {
        trigger: "onLoss",
        text: "Too late. The poison has reached your heart. A tragic end."
      }
    ]
  },
  {
    id: "chapter-4",
    title: "Chapter 4: The Human Gambit",
    suspectName: "Alistair Thorne",
    rating: 1900,
    avatar: "👤",
    description: "You enter the dark study. The hooded figure turns around—it is Lord Alistair Thorne, alive and smiling. The corpse was Dr. Aris's assistant. Alistair faked his death to play his final game against you.",
    startingFen: "r1b2r1k/pp4pp/2n5/4q1N1/2B5/8/PPP2PPP/R2QR1K1 w - - 0 1",
    opponentColor: "black",
    clueTitle: "The Mystery of Chess Preserved",
    clueDescription: "By checkmating Alistair Thorne with 'Nf7#' without capturing the poisoned Queen on e5, you triggered the final mechanical lock. Victor suddenly stepped from the shadows and stabbed Alistair in the back for his betrayal. With Alistair's death, you unlocked the desk drawer using the coordinate 'Nf7', drank the antidote, and burned the solved manuscript to keep the mystery of chess alive.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Surprised, Detective? Yes, I am alive. The corpse was just a prop. I faked my death to watch them betray each other. And to play my final master game against you. Capture my Black Queen on e5, or find another way."
      },
      {
        moveNumber: 2,
        text: "Victor poisoned your tea. The only antidote is in my desk. If you capture my Queen, you touch the contact poison and die immediately. Can you find checkmate without taking the bait?"
      },
      {
        moveNumber: 4,
        text: "This is the Human Gambit. A true Grandmaster must sacrifice his closest pupil to immortalize his name. Take the Queen. Embrace the poison."
      },
      {
        trigger: "onWin",
        text: "No! How did you checkmate me without capturing the Queen? Nf7... you completed Alistair's final sequence... Ugh!"
      },
      {
        trigger: "onLoss",
        text: "Hahaha! Greed checkmates even the cleverest minds. The contact poison claims another victim. Goodbye, Detective."
      }
    ]
  }
];
