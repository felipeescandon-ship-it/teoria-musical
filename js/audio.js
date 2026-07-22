// ========== Audio synthesis via Web Audio API ==========
let audioCtx;
const heldVoices = new Map(); // Tracks sustained notes from piano key presses

export function getAudioContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
// Convert MIDI note number to frequency (A4 = 69 = 440 Hz)
export function midiToFreq(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

// Pure ADSR/velocity math, no AudioContext involved — this is what makes it unit-testable.
// velocity (0-1) models how hard the note was struck: harder hits get a snappier attack,
// a higher sustain level, and brighter harmonics (more 2nd/3rd partial energy), not just
// more volume — mirrors how a piano hammer strike changes timbre, not only loudness.
// If velocity isn't given explicitly, it's inferred from the requested peak volume so
// existing callers (who only pass a volume) still get sensible, if neutral, dynamics.
const NEUTRAL_VELOCITY_REF = 0.15; // volume level treated as velocity ~0.73 (today's old defaults)
export function computeEnvelope(volume = 0.11, velocity = null) {
  const v = Math.min(1, Math.max(0, velocity ?? volume / NEUTRAL_VELOCITY_REF));
  const attack = 0.05 - v * 0.044;       // 50ms (soft) down to ~6ms (hard)
  const decay = 0.08;                     // fixed: peak settles into sustain
  const sustainRatio = 0.55 + v * 0.2;    // 0.55 (soft, decays more) – 0.75 (hard, rings out)
  const release = 0.18;                   // fixed exponential fade-out once the note is released
  const brightness = 0.12 + v * 0.35;     // harmonic gain multiplier driving timbre
  return {
    velocity: v,
    peakGain: volume,
    sustainGain: volume * sustainRatio,
    attack, decay, release, brightness
  };
}

// Create a note with additive synthesis: fundamental + 2nd and 3rd harmonics for timbral
// richness. Harmonic gains scale with envelope.brightness so harder-struck notes sound brighter.
export function makeVoice(midi, volume = .11, when = null, velocity = null) {
  const ctx = getAudioContext();
  const now = when ?? ctx.currentTime;
  const env = computeEnvelope(volume, velocity);
  const master = ctx.createGain();
  master.gain.setValueAtTime(.0001, now);
  master.gain.linearRampToValueAtTime(env.peakGain, now + env.attack);       // Attack
  master.gain.linearRampToValueAtTime(env.sustainGain, now + env.attack + env.decay); // Decay -> Sustain
  master.connect(ctx.destination);
  const brightnessMul = env.brightness / (0.12 + 0.73 * 0.35); // normalized so old defaults sound unchanged
  const layers = [
    {type:"triangle", ratio:1, gain:1},                  // Fundamental
    {type:"sine", ratio:2, gain:.18 * brightnessMul},     // 2nd harmonic (octave)
    {type:"sine", ratio:3, gain:.07 * brightnessMul}      // 3rd harmonic (perfect 5th)
  ];
  const oscillators = layers.map(layer => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = layer.type;
    osc.frequency.setValueAtTime(midiToFreq(midi) * layer.ratio, now);
    gain.gain.value = layer.gain;
    osc.connect(gain).connect(master);
    osc.start(now);
    return osc;
  });
  return {ctx, master, oscillators, started:now, env};
}

// Release a voice at a real note-off time (not a duration guessed in advance) — the release
// ramp always starts from wherever the gain actually is at that moment. cancelAndHoldAtTime
// (not cancelScheduledValues + setValueAtTime) is essential here: reading `.value` on the
// main thread at schedule time gives whatever the gain is *right now*, not at the future
// offTime, so pinning to that stale reading produced an audible jump/click at release.
// The fade itself is EXPONENTIAL, not linear: a linear ramp toward zero keeps a constant
// slope and then hits a hard corner at the end, which the ear hears as a click/pop. An
// exponential decay flattens naturally into silence (how real instruments and speakers
// actually fade), so there's no discontinuity. We stop the oscillators only after the gain
// has reached the effectively-silent floor, so the stop itself is inaudible too.
const SILENCE_FLOOR = .0001;
function scheduleRelease(voice, offTime) {
  const {master, oscillators, env} = voice;
  master.gain.cancelAndHoldAtTime(offTime);
  master.gain.setTargetAtTime(SILENCE_FLOOR, offTime, env.release / 4); // exponential decay toward silence
  const stopAt = offTime + env.release + .05;
  master.gain.setValueAtTime(SILENCE_FLOOR, stopAt); // pin to silence before cutting the oscillators
  oscillators.forEach(osc => { try { osc.stop(stopAt); } catch (_) {} });
}

// Play a single note: starts, sustains, and releases; duration in seconds
export function playMidi(midi, duration=.78, delay=0, volume=.12, velocity=null) {
  const ctx = getAudioContext();
  const when = ctx.currentTime + delay;
  const voice = makeVoice(midi, volume, when, velocity);
  scheduleRelease(voice, when + duration);
}
// Start a held note (key pressed); sustains until stopHeldMidi is called
export function startHeldMidi(token, midi, volume=.11, velocity=null) {
  if (heldVoices.has(token)) return;
  heldVoices.set(token, makeVoice(midi, volume, null, velocity));
}
// Release a held note at the real moment it's released
export function stopHeldMidi(token) {
  const voice = heldVoices.get(token);
  if (!voice) return;
  scheduleRelease(voice, voice.ctx.currentTime);
  heldVoices.delete(token);
}
// Play multiple notes as a chord (simultaneous or arpegiated)
export function playChord(midis, arpeggio=false, delayStart=0, velocity=null) {
  midis.forEach((m,i) => playMidi(m, arpeggio ? .72 : .95, delayStart + (arpeggio ? i*.16 : 0), arpeggio ? .13 : .09, velocity));
}
