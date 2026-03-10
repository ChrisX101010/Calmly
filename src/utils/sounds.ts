// Enhanced notification sounds with ringtone melodies
// All procedurally generated via Web Audio API -- no external files

export type SoundType =
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
  | "emptyDay"
  | "meetingApproaching"
  | "meetingNow"
  | "meetingMissed"
  | "meetingLate"
  | "dismiss";

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

function playChirp(
  startFreq: number,
  endFreq: number,
  duration: number,
  delay: number = 0,
  volume: number = 0.12
) {
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

// Musical note frequencies
const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.00,
};

function playMelody(notes: { freq: number; dur: number }[], vol: number = 0.1) {
  let time = 0;
  notes.forEach((n) => {
    playTone(n.freq, n.dur, "sine", time, vol);
    time += n.dur * 0.85;
  });
}

export function playSound(sound: SoundType): void {
  try {
    switch (sound) {
      case "taskCreated":
        playChirp(600, 900, 0.12, 0, 0.13);
        playChirp(800, 1200, 0.15, 0.1, 0.1);
        playTone(1100, 0.08, "sine", 0.22, 0.08);
        break;

      case "taskDeleted":
        playChirp(700, 350, 0.2, 0, 0.1);
        playTone(300, 0.15, "triangle", 0.15, 0.06);
        break;

      case "taskEdited":
        playTone(800, 0.08, "sine", 0, 0.1);
        playTone(900, 0.08, "sine", 0.1, 0.1);
        break;

      case "dragDrop":
        playChirp(400, 800, 0.08, 0, 0.12);
        playChirp(700, 1000, 0.1, 0.08, 0.1);
        playTone(950, 0.12, "sine", 0.16, 0.08);
        break;

      case "overdue":
        playChirp(500, 300, 0.3, 0, 0.1);
        playChirp(350, 200, 0.25, 0.25, 0.08);
        break;

      case "dueToday":
        playTone(880, 0.15, "sine", 0, 0.1);
        playTone(1100, 0.2, "sine", 0.15, 0.08);
        playTone(880, 0.1, "sine", 0.3, 0.05);
        break;

      case "importSuccess":
        playChirp(500, 700, 0.08, 0, 0.1);
        playChirp(650, 900, 0.08, 0.07, 0.1);
        playChirp(800, 1100, 0.08, 0.14, 0.1);
        playTone(1200, 0.15, "sine", 0.2, 0.12);
        break;

      case "exportSuccess":
        playTone(300, 0.12, "triangle", 0, 0.08);
        playTone(400, 0.12, "triangle", 0.08, 0.1);
        playTone(600, 0.2, "sine", 0.16, 0.12);
        break;

      case "error":
        playTone(200, 0.08, "sawtooth", 0, 0.06);
        playTone(180, 0.12, "sawtooth", 0.1, 0.04);
        break;

      case "welcome":
        playChirp(600, 800, 0.15, 0, 0.1);
        playChirp(750, 1000, 0.12, 0.12, 0.08);
        playTone(900, 0.2, "sine", 0.22, 0.06);
        break;

      case "emptyDay":
        playChirp(600, 400, 0.25, 0, 0.06);
        playTone(350, 0.3, "sine", 0.2, 0.04);
        break;

      // -- MEETING RINGTONE: Calm, gentle music-box melody --
      case "meetingApproaching":
        playMelody([
          { freq: NOTE.E5, dur: 0.2 },
          { freq: NOTE.G5, dur: 0.2 },
          { freq: NOTE.E5, dur: 0.15 },
          { freq: NOTE.C5, dur: 0.3 },
          { freq: NOTE.D5, dur: 0.15 },
          { freq: NOTE.E5, dur: 0.35 },
        ], 0.12);
        // Add a soft shimmer
        playTone(NOTE.G5, 0.5, "sine", 1.2, 0.04);
        playTone(NOTE.C5, 0.6, "sine", 1.4, 0.03);
        break;

      // -- MEETING NOW: More urgent but still cute doorbell chime --
      case "meetingNow":
        playMelody([
          { freq: NOTE.G5, dur: 0.15 },
          { freq: NOTE.E5, dur: 0.15 },
          { freq: NOTE.G5, dur: 0.15 },
          { freq: NOTE.E5, dur: 0.15 },
        ], 0.14);
        setTimeout(() => {
          playMelody([
            { freq: NOTE.A5, dur: 0.2 },
            { freq: NOTE.G5, dur: 0.2 },
            { freq: NOTE.E5, dur: 0.2 },
            { freq: NOTE.G5, dur: 0.4 },
          ], 0.12);
        }, 600);
        break;

      // -- MEETING MISSED: Sad descending melody --
      case "meetingMissed":
        playMelody([
          { freq: NOTE.E5, dur: 0.25 },
          { freq: NOTE.D5, dur: 0.25 },
          { freq: NOTE.C5, dur: 0.25 },
          { freq: NOTE.B4, dur: 0.2 },
          { freq: NOTE.A4, dur: 0.5 },
        ], 0.1);
        // Sad wobble at the end
        playChirp(NOTE.A4, NOTE.G4 * 0.95, 0.4, 1.0, 0.06);
        break;

      // -- MEETING LATE: Annoyed rapid tapping --
      case "meetingLate":
        playMelody([
          { freq: NOTE.E5, dur: 0.1 },
          { freq: NOTE.E5, dur: 0.1 },
          { freq: NOTE.F5, dur: 0.1 },
          { freq: NOTE.E5, dur: 0.1 },
        ], 0.11);
        setTimeout(() => {
          playMelody([
            { freq: NOTE.D5, dur: 0.15 },
            { freq: NOTE.C5, dur: 0.15 },
            { freq: NOTE.D5, dur: 0.3 },
          ], 0.09);
        }, 450);
        break;

      // -- DISMISS: Quick soft closing sound --
      case "dismiss":
        playChirp(800, 400, 0.15, 0, 0.08);
        playTone(350, 0.1, "sine", 0.12, 0.04);
        break;
    }
  } catch {
    // Audio not supported
  }
}
