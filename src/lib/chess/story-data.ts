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
  imagePath: string;
  sceneBgPath: string;
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
    title: "Chapter 1: The Mad Barber",
    suspectName: "Aaron Kosminski",
    rating: 1100,
    avatar: "🪒",
    imagePath: "/story/kosminski.png",
    sceneBgPath: "/story/bg_barber.png",
    description: "Kosminski paces nervously in his dingy, blood-spattered barber shop. His hands shake as he wipes a straight razor, whispering about the voices that command him. Play him to break his manic silences and extract a clue.",
    startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    opponentColor: "black",
    clueTitle: "Kosminski's Goulston Street Scrap",
    clueDescription: "Kosminski collapses in terror, throwing a bloody scrap of paper at you. It is a piece of a letter in red ink matching the 'Dear Boss' writing style. It mentions Goulston Street and points to Queen Victoria's personal physician, Sir William Gull, who Kosminski claims knows the true geometry of the surgical incisions.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Step into my chair, Inspector. The metal is cold... but my blade is warm. Play the board, or I will shave you closer than you have ever been shaved."
      },
      {
        moveNumber: 2,
        text: "They scream in the night... the streetwalks of Whitechapel. I only wanted to quiet them. The blood on my apron is just sheep's blood, Abberline. I swear it!"
      },
      {
        moveNumber: 6,
        text: "The physician Gull, he walks the streets with a black bag. He thinks I'm mad, but he is the one who worships the geometric angles of the cuts."
      },
      {
        moveNumber: 12,
        text: "I found the leather apron in the alley. The Ripper... he writes letters 'From Hell'. He leaves them on the chessboards of the dead!"
      },
      {
        trigger: "onBlunder",
        text: "A blunder! Your neck is exposed, inspector. I can see the pulse beating in your throat!"
      },
      {
        trigger: "onWin",
        text: "Ah! The razor slips... Fine! Take it! The scrap of paper... it was Gull! The Queen's physician Gull was in Mitre Square that night. He has the surgical tools. Find him!"
      },
      {
        trigger: "onLoss",
        text: "The blade cuts deep. You shouldn't have snooped around the East End docks, inspector."
      }
    ]
  },
  {
    id: "chapter-2",
    title: "Chapter 2: The Masonic Physician",
    suspectName: "Sir William Gull",
    rating: 1400,
    avatar: "🎩",
    imagePath: "/story/gull.png",
    sceneBgPath: "/story/bg_study.png",
    description: "Sir William Gull sits in a dimly lit study surrounded by anatomical charts and leather-bound journals. He regards you with a chilling, surgical calm. He challenges you to a duel of intellect.",
    startingFen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    opponentColor: "black",
    clueTitle: "The Masonic Coordinate Map",
    clueDescription: "Gull confesses that the murders are part of a secret ritual to cleanse royal scandals, but claims he didn't strike the fatal blows. He gives you a map marked with coordinates. He notes that the artist Walter Sickert has painted the exact scenes of the crimes before the bodies were even cold.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Ah, Inspector Abberline. You search for a monster, but you fail to see the grand anatomy of this city. Chess, like surgery, requires absolute, cold precision. Let us begin."
      },
      {
        trigger: "onFirstMove",
        text: "1. e4 e5 2. f4! The King's Gambit. A sacrifice. We do not kill for pleasure, inspector. We perform a Masonic duty. We cleanse the bloodlines of the crown."
      },
      {
        moveNumber: 6,
        text: "The cuts on Nichols and Chapman... done with a professional lithotomy knife. Only a surgeon knows how to extract the kidney in absolute darkness."
      },
      {
        moveNumber: 12,
        text: "Walter Sickert, the painter... he captures the red hues of the streets so vividly. Go look at his canvases. He paints the bodies dripping, before your officers even find them."
      },
      {
        trigger: "onBlunder",
        text: "A sloppy incision. You have severed your own lines of communication."
      },
      {
        trigger: "onWin",
        text: "Surgical checkmate. Very well. I did not strike the final blows—my hands are too old. The artist Sickert is the one who executes the visual canvas of our work. His studio is in Miller's Court."
      },
      {
        trigger: "onLoss",
        text: "You've bled out on the board, Abberline. The city's secrets remain safe."
      }
    ]
  },
  {
    id: "chapter-3",
    title: "Chapter 3: The Studio of Horrors",
    suspectName: "Walter Sickert",
    rating: 1650,
    avatar: "🎨",
    imagePath: "/story/sickert.png",
    sceneBgPath: "/story/bg_studio.png",
    description: "In his gloomy studio, Walter Sickert stands before an easel covered in dark crimson paintings. He laughs hysterically as you examine the canvases portraying the murder scenes. He plays with chaotic, artistic frenzy.",
    startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    opponentColor: "black",
    clueTitle: "The Canvas of Miller's Court",
    clueDescription: "Sickert breaks down, screaming that the Ripper is a shadow that lives inside his paintings. He points to a canvas of a dark alley ending in checkmate coordinate 'Nf7'. He whispers that the Ripper waits in the foggy Mitre Square cellar, ready to complete the 'Canonical checkmate'.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Do you like my art, Inspector? The red paint... it flows so beautifully, doesn't it? The shadow whispers to me, and I paint. Play me, and maybe I will paint your final moments!"
      },
      {
        moveNumber: 4,
        text: "The canvas of Whitechapel is painted in blood. A sacrifice of a pawn is a sacrifice of a soul. I painted Mary Kelly's room days before she was dismembered. The Ripper guided my brush!"
      },
      {
        moveNumber: 10,
        text: "You think you can capture the wind? The shadow walks through walls. He wears a dark cloak and has eyes like burning gaslamps."
      },
      {
        moveNumber: 16,
        text: "The final painting... it's a chessboard coordinate. The Ripper's ultimate masterpiece. The coordinate is 'Nf7'—the smothered mate in the butcher's cellar!"
      },
      {
        trigger: "onBlunder",
        text: "A terrible stroke! You have ruined the painting of your defense!"
      },
      {
        trigger: "onWin",
        text: "No! The paint is drying! The clue: the Ripper waits in the cellar beneath Mitre Square. The code to open the iron gate is 'Nf7'. He is waiting to play the final game against you!"
      },
      {
        trigger: "onLoss",
        text: "A masterpiece of slaughter. Your blood is the perfect shade of crimson."
      }
    ]
  },
  {
    id: "chapter-4",
    title: "Chapter 4: The Whitechapel Fiend",
    suspectName: "Jack the Ripper",
    rating: 1900,
    avatar: "👤",
    imagePath: "/story/ripper.png",
    sceneBgPath: "/story/bg_cellar.png",
    description: "A shadowy figure in a long black overcoat and top hat stands in the foggy butcher's cellar. His face is completely hidden in darkness except for two glowing white eyes. A blood-stained chessboard sits between you.",
    startingFen: "r1b2r1k/pp4pp/2n5/4q1N1/2B5/8/PPP2PPP/R2QR1K1 w - - 0 1",
    opponentColor: "black",
    clueTitle: "The Case of the Ripper Closed",
    clueDescription: "By checkmating the Ripper with 'Nf7#' without capturing his baited Queen on e5 (which was coated in contact poison), you locked him in the cellar. As the police broke down the door, the Ripper vanished into the sewers, leaving his blood-stained bag of letters. The murders stopped, and the terror of Whitechapel ended.",
    dialogue: [
      {
        trigger: "onLoad",
        text: "Welcome, Abberline. You have followed the trail of blood to my chessboard. Capture my Queen on e5, or find another way. One touch of the poisoned piece, and your lungs will fill with blood."
      },
      {
        moveNumber: 2,
        text: "This is the Ripper's Gambit. A sacrifice of the flesh. Will you take the baited Queen and die in agony, or can your mind find checkmate through the fog?"
      },
      {
        moveNumber: 4,
        text: "The streets of London will remember my name forever. I am the shadow in the alley. I am the Whispering King of the slums. Take the Queen. Complete the slaughter!"
      },
      {
        trigger: "onWin",
        text: "Ah! Nf7... a smothered mate! You did not touch the Queen! The board... it locks... No!"
      },
      {
        trigger: "onLoss",
        text: "Hahaha! Greed checkmates you! The blood fills your throat. Another victim for the Whitechapel legend."
      }
    ]
  }
];
