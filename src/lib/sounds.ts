// Web Audio API sound generator for chess moves - no external files needed
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio context isn't available
  }
}

function playNoise(duration: number, volume = 0.08) {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    
    // Low-pass filter to make it sound wooden
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start();
  } catch {
    // Silently fail
  }
}

export function playMoveSound() {
  playNoise(0.12, 0.12);
  playTone(800, 0.08, 'sine', 0.04);
}

export function playCaptureSound() {
  playNoise(0.18, 0.2);
  playTone(400, 0.12, 'triangle', 0.08);
}

export function playCheckSound() {
  playTone(880, 0.1, 'square', 0.08);
  setTimeout(() => playTone(1100, 0.15, 'square', 0.06), 80);
}

export function playCastleSound() {
  playNoise(0.1, 0.1);
  setTimeout(() => playNoise(0.1, 0.1), 120);
}

export function playGameEndSound() {
  playTone(523, 0.2, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.2, 'sine', 0.1), 150);
  setTimeout(() => playTone(784, 0.3, 'sine', 0.1), 300);
}

export function playIllegalSound() {
  playTone(200, 0.15, 'sawtooth', 0.05);
  setTimeout(() => playTone(180, 0.15, 'sawtooth', 0.05), 100);
}
