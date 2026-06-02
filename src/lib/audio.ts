export const playMoveSound = (isCapture: boolean = false, soundEnabled: boolean = true) => {
  if (!soundEnabled || typeof window === "undefined") return;
  const audio = new Audio(isCapture ? "/sounds/capture.ogg" : "/sounds/move.ogg");
  audio.play().catch(e => console.error("Audio play failed:", e));
};
