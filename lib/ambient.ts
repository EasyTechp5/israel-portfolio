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
