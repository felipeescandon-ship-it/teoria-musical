// ========== Sampled piano engine ==========
// Real Steinway samples (SplendidGrandPiano, via smplr), self-hosted under assets/piano-samples/
// instead of the library's default CDN (danigb.github.io) — removes a third-party runtime
// dependency and lets the files be cached on-device (see service-worker.js) across sessions.
// The smplr library itself is also vendored locally (js/vendor/) rather than imported from
// esm.sh: it's a single self-contained bundle with no sub-imports (confirmed — no `import`
// statements anywhere in it), so vendoring it is a straight copy, and it closes the same offline
// gap as the samples — a cross-origin CDN script is invisible to our same-origin service worker,
// so without this, "offline after first visit" would silently break on the piano library itself.
//
// There's no note-range scoping: SplendidGrandPiano's `notesToLoad` option (used by an earlier
// version of this file) does nothing — confirmed by reading smplr@0.8.0's actual source, which
// has no such property anywhere. The instrument always loads its full fixed sample set (5
// velocity layers, ~60 recorded pitches each — the rest are reached via pitch-shifting from the
// nearest recording), so every caller shares one instance regardless of what MIDI range it plays.
import { getAudioContext, playMidi as playMidiSynth, playChord as playChordSynth } from "./audio.js?v=3";

const SAMPLE_BASE_URL = new URL("../assets/piano-samples", import.meta.url).href;

let pianoPromise = null;

export function getSampledPiano() {
  if (!pianoPromise) {
    pianoPromise = (async () => {
      const { SplendidGrandPiano } = await import("./vendor/smplr@0.8.0.mjs");
      const ctx = getAudioContext();
      const piano = new SplendidGrandPiano(ctx, { baseUrl: SAMPLE_BASE_URL });
      await piano.ready;
      return piano;
    })();
  }
  return pianoPromise;
}

// ========== Smart one-shot playback (drop-in for audio.js's playMidi/playChord) ==========
// Same call signature as their synth counterparts, so a lesson's demo-button code doesn't need
// to change — only its import source does. Falls back to the synth for whichever calls happen
// before the piano finishes loading; every call after that uses the real piano. Kicked off eagerly
// here (not waiting for a keyboard to trigger it) so demo-only lessons still get the real piano.
let sharedPiano = null;
getSampledPiano().then(p => { sharedPiano = p; });
const DEMO_VELOCITY = 85;

export function playMidiSmart(midi, duration=.78, delay=0, volume=.12, velocity=null) {
  if (!sharedPiano) return playMidiSynth(midi, duration, delay, volume, velocity);
  const ctx = getAudioContext();
  return sharedPiano.start({ note: midi, velocity: DEMO_VELOCITY, time: ctx.currentTime + delay, duration });
}
export function playChordSmart(midis, arpeggio=false, delayStart=0, velocity=null) {
  if (!sharedPiano) return playChordSynth(midis, arpeggio, delayStart, velocity);
  return midis.map((m,i) => playMidiSmart(m, arpeggio ? .72 : .95, delayStart + (arpeggio ? i*.16 : 0), arpeggio ? .13 : .09, velocity));
}

// Mirrors audio.js's playChordAt(midis, when, duration) contract — `when` is an absolute
// AudioContext time. smplr's `start({time})` is ALSO an absolute AudioContext time (not
// relative to "now" as its README implies) — it's compared directly against the player's own
// `context.currentTime` internally, so `when` passes straight through unchanged.
export function playChordAtSampled(piano, midis, when, duration = .95, velocity = 80) {
  return midis.map(midi => piano.start({ note: midi, velocity, time: when, duration }));
}

// Mirrors audio.js's startHeldMidi/stopHeldMidi (press-and-hold keyboard interaction), for
// callers driving the sampled piano instead of the synth. smplr identifies a sounding note by
// `stopId` (defaults to the note itself if omitted) — passing our own caller-supplied token as
// stopId lets the same physical key be held via two different tokens (e.g. mouse vs. computer
// keyboard) without one release silencing the other.
export function startHeldMidiSampled(piano, token, midi, velocity = 80) {
  piano.start({ note: midi, velocity, stopId: token });
}
export function stopHeldMidiSampled(piano, token) {
  piano.stop(token);
}
