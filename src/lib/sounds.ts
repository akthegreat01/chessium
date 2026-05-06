"use client";

// Simple move sound utility using browser's Audio
export const playMoveSound = (type: 'move' | 'capture' | 'check' | 'castle' | 'promote' | 'correct' | 'wrong' = 'move') => {
  if (typeof window === 'undefined') return;
  
  // Use high-quality Chess.com sounds from public CDN
  const sounds = {
    move: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/move-self.mp3',
    capture: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/capture.mp3',
    check: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/move-check.mp3',
    castle: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/castle.mp3',
    promote: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/promote.mp3',
    correct: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/ten-seconds.mp3', // Win sound
    wrong: 'https://images.chesscomfiles.com/chess-themes/sounds/_standard/default/illegal.mp3'
  };

  try {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore audio play errors (usually due to user interaction requirements)
    });
  } catch (e) {
    console.warn('Audio play failed', e);
  }
};
