// Cute notification sounds using Web Audio API
// Each sound is procedurally generated — no external files needed

type SoundType =
  | "taskCreated"
  | "taskDeleted"
  | "taskEdited"
  | "dragDrop"
  | "overdue"
  | "dueToday"
  | "importSuccess"
  | "exportSuccess"
  | "error"
  | "welcome"
  | "emptyDay";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  delay: number = 0,
  volume: number = 0.15
) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function playChirp(startFreq: number, endFreq: number, duration: number, delay: number = 0, volume: number = 0.12) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime + delay);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + delay + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

export function playSound(sound: SoundType): void {
  try {
    switch (sound) {
      case "taskCreated":
        // Happy chirp — rising "mew!" like a kitten
        playChirp(600, 900, 0.12, 0, 0.13);
        playChirp(800, 1200, 0.15, 0.1, 0.1);
        playTone(1100, 0.08, "sine", 0.22, 0.08);
        break;

      case "taskDeleted":
        // Soft descending "mrrp" — gentle farewell
        playChirp(700, 350, 0.2, 0, 0.1);
        playTone(300, 0.15, "triangle", 0.15, 0.06);
        break;

      case "taskEdited":
        // Quick double tap — "prr-prr"
        playTone(800, 0.08, "sine", 0, 0.1);
        playTone(900, 0.08, "sine", 0.1, 0.1);
        break;

      case "dragDrop":
        // Playful bounce — "boing!"
        playChirp(400, 800, 0.08, 0, 0.12);
        playChirp(700, 1000, 0.1, 0.08, 0.1);
        playTone(950, 0.12, "sine", 0.16, 0.08);
        break;

      case "overdue":
        // Worried low mewl — "mrrroww..."
        playChirp(500, 300, 0.3, 0, 0.1);
        playChirp(350, 200, 0.25, 0.25, 0.08);
        break;

      case "dueToday":
        // Gentle attention chime — "ding-ding"
        playTone(880, 0.15, "sine", 0, 0.1);
        playTone(1100, 0.2, "sine", 0.15, 0.08);
        playTone(880, 0.1, "sine", 0.3, 0.05);
        break;

      case "importSuccess":
        // Excited trill — "prrrrt!" ascending
        playChirp(500, 700, 0.08, 0, 0.1);
        playChirp(650, 900, 0.08, 0.07, 0.1);
        playChirp(800, 1100, 0.08, 0.14, 0.1);
        playTone(1200, 0.15, "sine", 0.2, 0.12);
        break;

      case "exportSuccess":
        // Proud purr — "brrrm" with warmth
        playTone(300, 0.12, "triangle", 0, 0.08);
        playTone(400, 0.12, "triangle", 0.08, 0.1);
        playTone(600, 0.2, "sine", 0.16, 0.12);
        break;

      case "error":
        // Annoyed hiss — short buzz
        playTone(200, 0.08, "sawtooth", 0, 0.06);
        playTone(180, 0.12, "sawtooth", 0.1, 0.04);
        break;

      case "welcome":
        // Sweet morning meow — "mew~"
        playChirp(600, 800, 0.15, 0, 0.1);
        playChirp(750, 1000, 0.12, 0.12, 0.08);
        playTone(900, 0.2, "sine", 0.22, 0.06);
        break;

      case "emptyDay":
        // Sleepy yawn — soft descending
        playChirp(600, 400, 0.25, 0, 0.06);
        playTone(350, 0.3, "sine", 0.2, 0.04);
        break;
    }
  } catch {
    // Audio not supported — fail silently
  }
}
