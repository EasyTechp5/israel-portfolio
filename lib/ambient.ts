/**
 * A soft lo-fi beat, synthesised live with the Web Audio API: no audio files,
 * nothing to download. Kick, hats, a warm bass and a slow chord pad at 78 BPM.
 * Browsers only allow sound after a user gesture, so start() is called from one.
 */

const BPM = 78;
const STEP = 60 / BPM / 4; // sixteenth note
const VOLUME = 0.32;

// Am9 – Fmaj7 – C – G, one chord per bar (frequencies in Hz).
const CHORDS = [
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 261.63, 329.63, 440.0],
  [196.0, 261.63, 329.63, 392.0],
  [196.0, 246.94, 293.66, 392.0],
];
const BASS = [55.0, 43.65, 65.41, 49.0];

type Ctx = AudioContext;

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let timer: number | undefined;
let nextTime = 0;
let step = 0;
let noise: AudioBuffer | null = null;
let wanted = false;
let analyser: AnalyserNode | null = null;
let bins: Uint8Array<ArrayBuffer> | null = null;
let level = 0;

function noiseBuffer(c: Ctx) {
  if (noise) return noise;
  noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

function kick(c: Ctx, out: AudioNode, t: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.34);
}

function hat(c: Ctx, out: AudioNode, t: number, vol: number) {
  const s = c.createBufferSource();
  s.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = 7000;
  const g = c.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  s.connect(f).connect(g).connect(out);
  s.start(t);
  s.stop(t + 0.06);
}

function snare(c: Ctx, out: AudioNode, t: number) {
  const s = c.createBufferSource();
  s.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = 1800;
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
  s.connect(f).connect(g).connect(out);
  s.start(t);
  s.stop(t + 0.18);
}

function tone(c: Ctx, out: AudioNode, t: number, freq: number, len: number, vol: number, type: OscillatorType, lowpass: number) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = lowpass;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + Math.min(0.25, len / 3));
  g.gain.linearRampToValueAtTime(0.0001, t + len);
  o.connect(f).connect(g).connect(out);
  o.start(t);
  o.stop(t + len + 0.05);
}

function schedule(c: Ctx, out: AudioNode, i: number, t: number) {
  const inBar = i % 16;
  const bar = Math.floor(i / 16) % CHORDS.length;
  // A touch of swing on the off-sixteenths.
  const at = t + (inBar % 2 === 1 ? STEP * 0.18 : 0);

  if (inBar === 0 || inBar === 10) kick(c, out, at);
  if (inBar === 8) snare(c, out, at);
  if (inBar % 2 === 0) hat(c, out, at, inBar % 4 === 0 ? 0.22 : 0.12);
  if (inBar === 15) hat(c, out, at, 0.14);

  if (inBar === 0) {
    const len = STEP * 16;
    for (const f of CHORDS[bar]) tone(c, out, t, f, len, 0.05, "triangle", 1400);
    tone(c, out, t, BASS[bar], len * 0.5, 0.2, "sine", 300);
  }
  if (inBar === 10) tone(c, out, at, BASS[bar] * 2, STEP * 3, 0.09, "sine", 400);
  // A sparse, dreamy melody note now and then.
  if (inBar === 6 || inBar === 13) {
    const n = CHORDS[bar][(i * 7) % 4] * 2;
    tone(c, out, at, n, STEP * 3, 0.035, "sine", 2400);
  }
}

function pump() {
  if (!ctx || !master) return;
  while (nextTime < ctx.currentTime + 0.4) {
    schedule(ctx, master, step, nextTime);
    nextTime += STEP;
    step += 1;
  }
}

export function startAmbient() {
  wanted = true;
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.7;
      comp.connect(analyser);
      bins = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    }
    void ctx.resume();
    if (!master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(VOLUME, now + 2.5);
    if (timer === undefined) {
      nextTime = now + 0.1;
      step = 0;
      timer = window.setInterval(pump, 120);
    }
  } catch {
    /* audio unavailable: stay silent */
  }
}

export function stopAmbient() {
  wanted = false;
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 0.6);
  const c = ctx;
  window.setTimeout(() => {
    if (wanted) return;
    if (timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
    void c.suspend();
  }, 700);
}

/** How loud the low end is right now, 0 to 1. Lets the room move with the beat. */
export function ambientLevel(): number {
  if (!analyser || !bins || !wanted) {
    level *= 0.9;
    return level;
  }
  analyser.getByteFrequencyData(bins);
  let sum = 0;
  for (let i = 0; i < 5; i++) sum += bins[i];
  const raw = Math.min(1, sum / (5 * 200));
  level += (raw - level) * 0.35;
  return level;
}

export type Sfx = "tick" | "pop" | "whoosh" | "chime" | "clink" | "open";

/** Tiny interface sounds, made on the spot. Silent when the music is off. */
export function sfx(kind: Sfx) {
  if (!ctx || !master || !wanted || ctx.state !== "running") return;
  const c = ctx;
  const t = c.currentTime;
  const out = c.createGain();
  out.gain.value = 0.5;
  out.connect(c.destination);
  const blip = (freq: number, len: number, vol: number, type: OscillatorType = "sine", glideTo?: number, at = 0) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t + at);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + at + len);
    g.gain.setValueAtTime(0.0001, t + at);
    g.gain.exponentialRampToValueAtTime(vol, t + at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + at + len);
    o.connect(g).connect(out);
    o.start(t + at);
    o.stop(t + at + len + 0.02);
  };
  switch (kind) {
    case "tick":
      blip(1500, 0.05, 0.12, "triangle");
      break;
    case "pop":
      blip(420, 0.12, 0.3, "sine", 900);
      break;
    case "open":
      blip(330, 0.18, 0.22, "triangle", 660);
      blip(660, 0.22, 0.16, "sine", 990, 0.06);
      break;
    case "whoosh": {
      const s = c.createBufferSource();
      s.buffer = noiseBuffer(c);
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 1.2;
      f.frequency.setValueAtTime(400, t);
      f.frequency.exponentialRampToValueAtTime(3200, t + 0.5);
      f.frequency.exponentialRampToValueAtTime(500, t + 0.95);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      s.connect(f).connect(g).connect(out);
      s.start(t);
      s.stop(t + 1.05);
      break;
    }
    case "chime":
      blip(880, 1.2, 0.2, "sine");
      blip(1320, 1.0, 0.1, "sine", undefined, 0.02);
      blip(1760, 0.8, 0.05, "sine", undefined, 0.04);
      break;
    case "clink":
      blip(2400, 0.25, 0.18, "sine");
      blip(3600, 0.18, 0.08, "sine", undefined, 0.01);
      break;
  }
}
