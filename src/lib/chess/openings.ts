import { Chess } from 'chess.js';
import type { Opening } from '@/types/chess';

// ─── ECO Opening Database ───────────────────────────────────────────────────
// Map from FEN position key (first 4 fields: piece placement, side to move,
// castling, en passant) to Opening data.

const OPENINGS: Opening[] = [
  // A00–A09: Irregular Openings
  { eco: 'A00', name: 'Polish Opening', moves: '1. b4' },
  { eco: 'A00', name: 'Grob Opening', moves: '1. g4' },
  { eco: 'A00', name: 'Hungarian Opening', moves: '1. g3' },
  { eco: 'A01', name: 'Nimzo-Larsen Attack', moves: '1. b3' },
  { eco: 'A02', name: "Bird's Opening", moves: '1. f4' },
  { eco: 'A04', name: "Réti Opening", moves: '1. Nf3' },
  { eco: 'A05', name: "Réti Opening: King's Indian Attack", moves: '1. Nf3 Nf6' },
  { eco: 'A06', name: "Réti Opening", moves: '1. Nf3 d5' },
  { eco: 'A07', name: "King's Indian Attack", moves: '1. Nf3 d5 2. g3' },
  { eco: 'A09', name: "Réti Opening", moves: '1. Nf3 d5 2. c4' },

  // A10–A39: English Opening
  { eco: 'A10', name: 'English Opening', moves: '1. c4' },
  { eco: 'A13', name: 'English Opening: Agincourt Defense', moves: '1. c4 e6' },
  { eco: 'A15', name: 'English Opening: Anglo-Indian Defense', moves: '1. c4 Nf6' },
  { eco: 'A16', name: 'English Opening: Anglo-Indian Defense', moves: '1. c4 Nf6 2. Nc3' },
  { eco: 'A17', name: 'English Opening: Anglo-Indian, Hedgehog', moves: '1. c4 Nf6 2. Nc3 e6' },
  { eco: 'A20', name: 'English Opening: Reversed Sicilian', moves: '1. c4 e5' },
  { eco: 'A22', name: 'English Opening: Bremen System', moves: '1. c4 e5 2. Nc3 Nf6' },
  { eco: 'A25', name: 'English Opening: Closed', moves: '1. c4 e5 2. Nc3 Nc6' },
  { eco: 'A30', name: 'English Opening: Symmetrical Variation', moves: '1. c4 c5' },
  { eco: 'A33', name: 'English Opening: Symmetrical, Two Knights', moves: '1. c4 c5 2. Nf3 Nf6 3. Nc3 Nc6' },

  // A40–A49: Queen Pawn Openings
  { eco: 'A40', name: "Queen's Pawn Game", moves: '1. d4' },
  { eco: 'A41', name: "Queen's Pawn: Modern Defense", moves: '1. d4 g6' },
  { eco: 'A43', name: 'Old Benoni Defense', moves: '1. d4 c5' },
  { eco: 'A45', name: "Queen's Pawn Game", moves: '1. d4 Nf6' },
  { eco: 'A46', name: "Queen's Pawn: Indian Defense", moves: '1. d4 Nf6 2. Nf3' },
  { eco: 'A47', name: "Queen's Indian Defense", moves: '1. d4 Nf6 2. Nf3 b6' },
  { eco: 'A48', name: "King's Indian: London System", moves: '1. d4 Nf6 2. Nf3 g6 3. Bf4' },

  // A50–A79: Indian Defenses
  { eco: 'A50', name: 'Indian Defense', moves: '1. d4 Nf6 2. c4' },
  { eco: 'A51', name: 'Budapest Gambit', moves: '1. d4 Nf6 2. c4 e5' },
  { eco: 'A52', name: 'Budapest Gambit: Accepted', moves: '1. d4 Nf6 2. c4 e5 3. dxe5' },
  { eco: 'A53', name: 'Old Indian Defense', moves: '1. d4 Nf6 2. c4 d6' },
  { eco: 'A56', name: 'Benoni Defense', moves: '1. d4 Nf6 2. c4 c5' },
  { eco: 'A57', name: 'Benko Gambit', moves: '1. d4 Nf6 2. c4 c5 3. d5 b5' },
  { eco: 'A60', name: 'Modern Benoni', moves: '1. d4 Nf6 2. c4 c5 3. d5 e6' },
  { eco: 'A70', name: 'Benoni: Classical', moves: '1. d4 Nf6 2. c4 c5 3. d5 e6 4. Nc3 exd5 5. cxd5 d6 6. e4 g6 7. Nf3' },

  // A80–A99: Dutch Defense
  { eco: 'A80', name: 'Dutch Defense', moves: '1. d4 f5' },
  { eco: 'A83', name: 'Dutch Defense: Staunton Gambit', moves: '1. d4 f5 2. e4' },
  { eco: 'A87', name: 'Dutch Defense: Leningrad', moves: '1. d4 f5 2. c4 Nf6 3. g3 g6' },
  { eco: 'A90', name: 'Dutch Defense: Classical', moves: '1. d4 f5 2. c4 Nf6 3. g3 e6' },

  // B00–B09: Uncommon King Pawn
  { eco: 'B00', name: "King's Pawn Game", moves: '1. e4' },
  { eco: 'B01', name: 'Scandinavian Defense', moves: '1. e4 d5' },
  { eco: 'B02', name: "Alekhine's Defense", moves: '1. e4 Nf6' },
  { eco: 'B03', name: "Alekhine's Defense: Four Pawns Attack", moves: '1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. c4 Nb6 5. f4' },
  { eco: 'B06', name: 'Modern Defense', moves: '1. e4 g6' },
  { eco: 'B07', name: 'Pirc Defense', moves: '1. e4 d6 2. d4 Nf6' },
  { eco: 'B09', name: 'Pirc Defense: Austrian Attack', moves: '1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. f4' },

  // B10–B19: Caro-Kann Defense
  { eco: 'B10', name: 'Caro-Kann Defense', moves: '1. e4 c6' },
  { eco: 'B12', name: 'Caro-Kann: Advance Variation', moves: '1. e4 c6 2. d4 d5 3. e5' },
  { eco: 'B13', name: 'Caro-Kann: Exchange Variation', moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5' },
  { eco: 'B14', name: 'Caro-Kann: Panov-Botvinnik Attack', moves: '1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4' },
  { eco: 'B15', name: 'Caro-Kann: Main Line', moves: '1. e4 c6 2. d4 d5 3. Nc3' },
  { eco: 'B17', name: 'Caro-Kann: Steinitz Variation', moves: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7' },
  { eco: 'B18', name: 'Caro-Kann: Classical Variation', moves: '1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5' },

  // B20–B99: Sicilian Defense
  { eco: 'B20', name: 'Sicilian Defense', moves: '1. e4 c5' },
  { eco: 'B21', name: 'Sicilian: Smith-Morra Gambit', moves: '1. e4 c5 2. d4 cxd4 3. c3' },
  { eco: 'B22', name: 'Sicilian: Alapin Variation', moves: '1. e4 c5 2. c3' },
  { eco: 'B23', name: 'Sicilian: Closed', moves: '1. e4 c5 2. Nc3' },
  { eco: 'B27', name: 'Sicilian: Hyperaccelerated Dragon', moves: '1. e4 c5 2. Nf3 g6' },
  { eco: 'B30', name: 'Sicilian: Old Sicilian', moves: '1. e4 c5 2. Nf3 Nc6' },
  { eco: 'B32', name: 'Sicilian: Open', moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4' },
  { eco: 'B33', name: 'Sicilian: Sveshnikov Variation', moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5' },
  { eco: 'B35', name: 'Sicilian: Accelerated Dragon', moves: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7' },
  { eco: 'B40', name: 'Sicilian Defense: French Variation', moves: '1. e4 c5 2. Nf3 e6' },
  { eco: 'B41', name: 'Sicilian: Kan Variation', moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6' },
  { eco: 'B44', name: 'Sicilian: Taimanov Variation', moves: '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6' },
  { eco: 'B50', name: 'Sicilian Defense', moves: '1. e4 c5 2. Nf3 d6' },
  { eco: 'B51', name: 'Sicilian: Moscow Variation', moves: '1. e4 c5 2. Nf3 d6 3. Bb5+' },
  { eco: 'B52', name: 'Sicilian: Canal Attack', moves: '1. e4 c5 2. Nf3 d6 3. Bb5+ Bd7' },
  { eco: 'B54', name: 'Sicilian: Open', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4' },
  { eco: 'B56', name: 'Sicilian: Open, Classical', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3' },
  { eco: 'B60', name: 'Sicilian: Richter-Rauzer Attack', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5' },
  { eco: 'B70', name: 'Sicilian: Dragon Variation', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6' },
  { eco: 'B72', name: 'Sicilian: Dragon, Classical', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3' },
  { eco: 'B76', name: 'Sicilian: Dragon, Yugoslav Attack', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3' },
  { eco: 'B80', name: 'Sicilian: Scheveningen Variation', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6' },
  { eco: 'B85', name: 'Sicilian: Scheveningen, Classical', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be2' },
  { eco: 'B90', name: 'Sicilian: Najdorf Variation', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6' },
  { eco: 'B92', name: 'Sicilian: Najdorf, Opočenský Variation', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2' },
  { eco: 'B96', name: 'Sicilian: Najdorf', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5' },
  { eco: 'B97', name: 'Sicilian: Najdorf, Poisoned Pawn', moves: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6' },

  // C00–C19: French Defense
  { eco: 'C00', name: 'French Defense', moves: '1. e4 e6' },
  { eco: 'C01', name: 'French Defense: Exchange Variation', moves: '1. e4 e6 2. d4 d5 3. exd5 exd5' },
  { eco: 'C02', name: 'French Defense: Advance Variation', moves: '1. e4 e6 2. d4 d5 3. e5' },
  { eco: 'C03', name: 'French Defense: Tarrasch Variation', moves: '1. e4 e6 2. d4 d5 3. Nd2' },
  { eco: 'C10', name: 'French Defense: Rubinstein Variation', moves: '1. e4 e6 2. d4 d5 3. Nc3 dxe4' },
  { eco: 'C11', name: 'French Defense: Classical Variation', moves: '1. e4 e6 2. d4 d5 3. Nc3 Nf6' },
  { eco: 'C15', name: 'French Defense: Winawer Variation', moves: '1. e4 e6 2. d4 d5 3. Nc3 Bb4' },
  { eco: 'C18', name: 'French Defense: Winawer, Advance', moves: '1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3' },

  // C20–C39: King's Pawn Games
  { eco: 'C20', name: "King's Pawn Game", moves: '1. e4 e5' },
  { eco: 'C21', name: "Center Game", moves: '1. e4 e5 2. d4' },
  { eco: 'C22', name: "Center Game: Accepted", moves: '1. e4 e5 2. d4 exd4 3. Qxd4' },
  { eco: 'C23', name: "Bishop's Opening", moves: '1. e4 e5 2. Bc4' },
  { eco: 'C25', name: 'Vienna Game', moves: '1. e4 e5 2. Nc3' },
  { eco: 'C26', name: 'Vienna Game: Falkbeer Variation', moves: '1. e4 e5 2. Nc3 Nf6' },
  { eco: 'C29', name: 'Vienna Game: Vienna Gambit', moves: '1. e4 e5 2. Nc3 Nf6 3. f4' },
  { eco: 'C30', name: "King's Gambit", moves: '1. e4 e5 2. f4' },
  { eco: 'C33', name: "King's Gambit Accepted", moves: '1. e4 e5 2. f4 exf4' },
  { eco: 'C36', name: "King's Gambit: Abbazia Defense", moves: '1. e4 e5 2. f4 exf4 3. Nf3 d5' },

  // C40–C49: King's Knight Opening
  { eco: 'C40', name: "King's Knight Opening", moves: '1. e4 e5 2. Nf3' },
  { eco: 'C41', name: "Philidor Defense", moves: '1. e4 e5 2. Nf3 d6' },
  { eco: 'C42', name: 'Petrov Defense', moves: '1. e4 e5 2. Nf3 Nf6' },
  { eco: 'C44', name: 'Scotch Game', moves: '1. e4 e5 2. Nf3 Nc6 3. d4' },
  { eco: 'C45', name: 'Scotch Game', moves: '1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4' },
  { eco: 'C46', name: 'Three Knights Game', moves: '1. e4 e5 2. Nf3 Nc6 3. Nc3' },
  { eco: 'C47', name: 'Four Knights Game', moves: '1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6' },
  { eco: 'C48', name: 'Four Knights: Spanish Variation', moves: '1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5' },

  // C50–C59: Italian Game & Two Knights
  { eco: 'C50', name: 'Italian Game', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4' },
  { eco: 'C51', name: 'Italian Game: Evans Gambit', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4' },
  { eco: 'C53', name: 'Italian Game: Classical Variation', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5' },
  { eco: 'C54', name: 'Italian Game: Giuoco Piano', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3' },
  { eco: 'C55', name: 'Italian Game: Two Knights Defense', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6' },
  { eco: 'C57', name: 'Italian Game: Fried Liver Attack', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5' },
  { eco: 'C58', name: 'Italian Game: Two Knights, Morphy', moves: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Na5' },

  // C60–C99: Ruy López
  { eco: 'C60', name: 'Ruy López', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5' },
  { eco: 'C63', name: "Ruy López: Schliemann Defense", moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 f5' },
  { eco: 'C65', name: 'Ruy López: Berlin Defense', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6' },
  { eco: 'C67', name: 'Ruy López: Berlin Wall', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4' },
  { eco: 'C68', name: 'Ruy López: Exchange Variation', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6' },
  { eco: 'C69', name: 'Ruy López: Exchange, Gligoric', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6 dxc6 5. O-O' },
  { eco: 'C70', name: 'Ruy López: Morphy Defense', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6' },
  { eco: 'C72', name: 'Ruy López: Modern Steinitz Defense', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 d6' },
  { eco: 'C78', name: 'Ruy López: Archangelsk Variation', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O b5 6. Bb3 Bb7' },
  { eco: 'C80', name: 'Ruy López: Open Variation', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4' },
  { eco: 'C84', name: 'Ruy López: Closed', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7' },
  { eco: 'C88', name: 'Ruy López: Closed, Anti-Marshall', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O' },
  { eco: 'C89', name: 'Ruy López: Marshall Attack', moves: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5' },

  // D00–D05: Queen Pawn Games
  { eco: 'D00', name: "Queen's Pawn Game", moves: '1. d4 d5' },
  { eco: 'D00', name: 'London System', moves: '1. d4 d5 2. Bf4' },
  { eco: 'D01', name: 'Richter-Veresov Attack', moves: '1. d4 d5 2. Nc3 Nf6 3. Bg5' },
  { eco: 'D02', name: "Queen's Pawn: London System", moves: '1. d4 d5 2. Nf3 Nf6 3. Bf4' },
  { eco: 'D04', name: "Queen's Pawn: Colle System", moves: '1. d4 d5 2. Nf3 Nf6 3. e3' },
  { eco: 'D05', name: "Queen's Pawn: Colle-Zukertort", moves: '1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. b3' },

  // D06–D69: Queen's Gambit
  { eco: 'D06', name: "Queen's Gambit", moves: '1. d4 d5 2. c4' },
  { eco: 'D07', name: "Queen's Gambit: Chigorin Defense", moves: '1. d4 d5 2. c4 Nc6' },
  { eco: 'D10', name: "Queen's Gambit: Slav Defense", moves: '1. d4 d5 2. c4 c6' },
  { eco: 'D11', name: "Slav Defense", moves: '1. d4 d5 2. c4 c6 3. Nf3' },
  { eco: 'D12', name: "Slav Defense: Quiet Variation", moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3' },
  { eco: 'D13', name: 'Slav Defense: Exchange Variation', moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. cxd5 cxd5' },
  { eco: 'D15', name: 'Slav Defense: Main Line', moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3' },
  { eco: 'D17', name: 'Slav Defense: Czech Variation', moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5' },
  { eco: 'D20', name: "Queen's Gambit Accepted", moves: '1. d4 d5 2. c4 dxc4' },
  { eco: 'D23', name: "Queen's Gambit Accepted", moves: '1. d4 d5 2. c4 dxc4 3. Nf3' },
  { eco: 'D30', name: "Queen's Gambit Declined", moves: '1. d4 d5 2. c4 e6' },
  { eco: 'D31', name: "Queen's Gambit Declined", moves: '1. d4 d5 2. c4 e6 3. Nc3' },
  { eco: 'D35', name: "Queen's Gambit Declined: Exchange Variation", moves: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5' },
  { eco: 'D37', name: "Queen's Gambit Declined", moves: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3' },
  { eco: 'D38', name: "Queen's Gambit Declined: Ragozin Defense", moves: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3 Bb4' },
  { eco: 'D43', name: 'Semi-Slav Defense', moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6' },
  { eco: 'D44', name: 'Semi-Slav: Botvinnik Variation', moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. Bg5 dxc4' },
  { eco: 'D45', name: 'Semi-Slav: Main Line', moves: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3' },

  // D70–D99: Grünfeld Defense
  { eco: 'D70', name: 'Grünfeld Defense', moves: '1. d4 Nf6 2. c4 g6 3. Nc3 d5' },
  { eco: 'D76', name: 'Grünfeld: Russian Variation', moves: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. Nf3 Bg7 5. e3' },
  { eco: 'D80', name: 'Grünfeld Defense', moves: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. Bg2' },
  { eco: 'D85', name: 'Grünfeld: Exchange Variation', moves: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5' },
  { eco: 'D97', name: 'Grünfeld: Russian, Smyslov', moves: '1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. Nf3 Bg7 5. Qb3' },

  // E00–E09: Catalan Opening
  { eco: 'E00', name: 'Catalan Opening', moves: '1. d4 Nf6 2. c4 e6 3. g3' },
  { eco: 'E01', name: 'Catalan: Open', moves: '1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2' },
  { eco: 'E06', name: 'Catalan: Closed', moves: '1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7 5. Nf3' },

  // E10–E19: Queen's Indian
  { eco: 'E12', name: "Queen's Indian Defense", moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6' },
  { eco: 'E15', name: "Queen's Indian: Nimzowitsch", moves: '1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3' },

  // E20–E59: Nimzo-Indian
  { eco: 'E20', name: 'Nimzo-Indian Defense', moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4' },
  { eco: 'E21', name: 'Nimzo-Indian: Three Knights', moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3' },
  { eco: 'E32', name: 'Nimzo-Indian: Classical', moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2' },
  { eco: 'E41', name: 'Nimzo-Indian: Hübner Variation', moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 c5' },
  { eco: 'E46', name: 'Nimzo-Indian: Reshevsky Variation', moves: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O' },

  // E60–E99: King's Indian Defense
  { eco: 'E60', name: "King's Indian Defense", moves: '1. d4 Nf6 2. c4 g6' },
  { eco: 'E62', name: "King's Indian: Fianchetto", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. Nf3 d6 5. g3' },
  { eco: 'E70', name: "King's Indian Defense", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4' },
  { eco: 'E73', name: "King's Indian: Averbakh", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Be2 O-O 6. Bg5' },
  { eco: 'E76', name: "King's Indian: Four Pawns Attack", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f4' },
  { eco: 'E80', name: "King's Indian: Sämisch Variation", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3' },
  { eco: 'E90', name: "King's Indian: Classical", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3' },
  { eco: 'E92', name: "King's Indian: Classical, Petrosian", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2' },
  { eco: 'E97', name: "King's Indian: Mar del Plata", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6' },
  { eco: 'E99', name: "King's Indian: Classical, Bayonet", moves: '1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. b4' },
];

// ─── Build FEN Lookup Map ───────────────────────────────────────────────────

/**
 * Extract the FEN position key (first 4 fields) from a full FEN string.
 */
function fenKey(fen: string): string {
  return fen.split(' ').slice(0, 4).join(' ');
}

/**
 * Convert moves string to SAN array by stripping move numbers and dots.
 */
function movesToSanArray(movesStr: string): string[] {
  return movesStr
    .split(/\s+/)
    .filter((token) => !token.includes('.'));
}

// Build the lookup map lazily
let openingMap: Map<string, Opening> | null = null;

function getOpeningMap(): Map<string, Opening> {
  if (openingMap) return openingMap;

  openingMap = new Map<string, Opening>();

  for (const opening of OPENINGS) {
    const chess = new Chess();
    const sans = movesToSanArray(opening.moves);

    let valid = true;
    for (const san of sans) {
      const result = chess.move(san);
      if (!result) {
        valid = false;
        break;
      }
    }

    if (valid) {
      const key = fenKey(chess.fen());
      // Later/longer openings override shorter ones for the same position
      openingMap.set(key, { ...opening, fen: key });
    }
  }

  return openingMap;
}

// ─── Opening Detection ──────────────────────────────────────────────────────

/**
 * Detect the opening from a sequence of SAN moves.
 * Replays moves one by one and checks against the database at each position.
 * Returns the most specific (latest) matching opening.
 *
 * @param moves - Array of SAN move strings, e.g. ["e4", "e5", "Nf3", "Nc6"]
 * @returns The detected opening, or null if no match.
 */
export function detectOpening(moves: string[]): Opening | null {
  const map = getOpeningMap();
  const chess = new Chess();
  let lastOpening: Opening | null = null;

  for (const san of moves) {
    const result = chess.move(san);
    if (!result) break;

    const key = fenKey(chess.fen());
    const opening = map.get(key);
    if (opening) {
      lastOpening = opening;
    }
  }

  return lastOpening;
}

/**
 * Detect the opening from a FEN string.
 */
export function detectOpeningFromFen(fen: string): Opening | null {
  const map = getOpeningMap();
  const key = fenKey(fen);
  return map.get(key) ?? null;
}

/**
 * Get all openings in the database.
 */
export function getAllOpenings(): Opening[] {
  return [...OPENINGS];
}

/**
 * Search openings by name (case-insensitive substring match).
 */
export function searchOpenings(query: string): Opening[] {
  const q = query.toLowerCase();
  return OPENINGS.filter((o) => o.name.toLowerCase().includes(q));
}
