// ========== Pure timing math for the tempo/loop transport (Épica C1) ==========
// No `window`, no DOM, no AudioContext — this is what makes it unit-testable without
// mocking Web Audio. transport.js (impure: real setTimeout + real AudioContext) is a thin
// wrapper around these two functions.

export function secondsPerBeat(bpm) {
  if (!Number.isFinite(bpm) || bpm <= 0) {
    throw new RangeError("El BPM debe ser mayor que cero");
  }
  return 60 / bpm;
}

// Given an absolute beat number since the transport started, decide whether it falls in the
// count-in or in actual playback, and — if it's a chord boundary — which chord (by index)
// should sound. Looping is implicit: chordIndex wraps via modulo once the progression ends.
export function progressionEventAtBeat({
  beat,
  chordCount,
  chordsPerBar,
  beatsPerBar = 4,
  countInBars = 1
}) {
  const countInBeats = beatsPerBar * countInBars;

  if (beat < countInBeats) {
    return {
      type: "count-in",
      beatInBar: beat % beatsPerBar,
      accented: beat % beatsPerBar === 0
    };
  }

  const musicalBeat = beat - countInBeats;
  const beatInBar = musicalBeat % beatsPerBar;
  const beatsPerChord = beatsPerBar / chordsPerBar;
  const chordBoundary = musicalBeat % beatsPerChord === 0;

  return {
    type: "playback",
    musicalBeat,
    beatInBar,
    accented: beatInBar === 0,
    chordIndex: chordBoundary ? Math.floor(musicalBeat / beatsPerChord) % chordCount : null
  };
}

// Advance a lookahead window: collects every beat whose time falls before `horizon`, then
// returns the updated {nextBeat, nextBeatTime} so the caller can resume from exactly where
// this call left off. Pure — the actual AudioContext.currentTime read happens in transport.js.
export function collectScheduledBeats({ nextBeat, nextBeatTime, horizon, beatDuration }) {
  const beats = [];
  while (nextBeatTime < horizon) {
    beats.push({ beat: nextBeat, when: nextBeatTime });
    nextBeat += 1;
    nextBeatTime += beatDuration;
  }
  return { beats, nextBeat, nextBeatTime };
}
