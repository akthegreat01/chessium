"use client";

// High-quality Chess.com sounds from public CDN
const SOUND_URLS = {
  move: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/move-self.mp3',
  capture: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/capture.mp3',
  check: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/move-check.mp3',
  castle: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/castle.mp3',
  promote: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/promote.mp3',
  correct: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/ten-seconds.mp3', 
  wrong: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/illegal.mp3',
  gameEnd: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/game-end.mp3',
  brilliant: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/brilliant.mp3',
  great: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/great-move.mp3',
  blunder: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/blunder.mp3',
  mistake: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/mistake.mp3'
};

const playSound = (url: string) => {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {}
};

export const playMoveSound = (type: keyof typeof SOUND_URLS = 'move') => playSound(SOUND_URLS[type]);
export const playCaptureSound = () => playSound(SOUND_URLS.capture);
export const playCheckSound = () => playSound(SOUND_URLS.check);
export const playCastleSound = () => playSound(SOUND_URLS.castle);
export const playPromoteSound = () => playSound(SOUND_URLS.promote);
export const playCorrectSound = () => playSound(SOUND_URLS.correct);
export const playWrongSound = () => playSound(SOUND_URLS.wrong);
export const playGameEndSound = () => playSound(SOUND_URLS.gameEnd);
export const playBrilliantSound = () => playSound(SOUND_URLS.brilliant);
export const playGreatSound = () => playSound(SOUND_URLS.great);
export const playBlunderSound = () => playSound(SOUND_URLS.blunder);
export const playMistakeSound = () => playSound(SOUND_URLS.mistake);

