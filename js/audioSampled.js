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
import {
  getAudioContext,
  playMidi as playMidiSynth, playChord as playChordSynth,
  playMidiAt as playMidiAtSynth, playChordAt as playChordAtSynth
} from "./audio.js?v=5";

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

// smplr's `piano.start()` returns a callable that stops that note early when invoked — its own
// native cancellation primitive. Wrapping it in `{cancel()}` gives it the same shape as the
// `.cancel()` audio.js now attaches to its synth voices, so a scheduler (transport.js) can hold
// a mixed bag of synth and sampled notes and cancel every one of them the same way, with no
// per-engine branching of its own.
function toCancellable(stopFn) {
  return { cancel: () => { try { stopFn?.(); } catch (_) {} } };
}

// Mirrors audio.js's playMidiAt/playChordAt(midis, when, duration) contract — `when` is an
// absolute AudioContext time. smplr's `start({time})` is ALSO an absolute AudioContext time (not
// relative to "now" as its README implies) — it's compared directly against the player's own
// `context.currentTime` internally, so `when` passes straight through unchanged.
//
// getAudioContext() here is NOT just for reading the clock — its side effect (auto-resume if
// suspended) matters. Safari, unlike Chrome, keeps an AudioContext genuinely silent until it's
// resumed inside a user-gesture call stack, and won't do so implicitly just because nodes get
// scheduled on it. Every other sound-producing path (audio.js's makeVoice, playMidiSmart) already
// called getAudioContext() and got this for free; this absolute-time path didn't, so once the
// piano was warm, pressing a key here could schedule a note that never resumes the context —
// silent on Safari, but easy to miss testing on Chrome, which resumes far more permissively.
export function playMidiAtSampled(piano, midi, when, duration = .95, velocity = 80) {
  getAudioContext();
  return toCancellable(piano.start({ note: midi, velocity, time: when, duration }));
}
export function playChordAtSampled(piano, midis, when, duration = .95, velocity = 80) {
  return midis.map(midi => playMidiAtSampled(piano, midi, when, duration, velocity));
}

// Smart absolute-time scheduling (drop-in for audio.js's playMidiAt/playChordAt), for a
// scheduler like transport.js: same fallback-then-upgrade behavior as playMidiSmart/playChordSmart
// above, just anchored to a caller-supplied time instead of "now".
export function playMidiAtSmart(midi, when, duration=.78, volume=.12, velocity=null) {
  if (!sharedPiano) return playMidiAtSynth(midi, when, duration, volume, velocity);
  return playMidiAtSampled(sharedPiano, midi, when, duration, DEMO_VELOCITY);
}
export function playChordAtSmart(midis, when, duration=.95, volume=.09, velocity=null) {
  if (!sharedPiano) return playChordAtSynth(midis, when, duration, volume, velocity);
  return playChordAtSampled(sharedPiano, midis, when, duration, DEMO_VELOCITY);
}

// Mirrors audio.js's startHeldMidi/stopHeldMidi (press-and-hold keyboard interaction), for
// callers driving the sampled piano instead of the synth. smplr identifies a sounding note by
// `stopId` (defaults to the note itself if omitted) — passing our own caller-supplied token as
// stopId lets the same physical key be held via two different tokens (e.g. mouse vs. computer
// keyboard) without one release silencing the other.
export function startHeldMidiSampled(piano, token, midi, velocity = 80) {
  getAudioContext(); // see playMidiAtSampled — resumes a Safari-suspended context on this gesture
  piano.start({ note: midi, velocity, stopId: token });
}
export function stopHeldMidiSampled(piano, token) {
  piano.stop(token);
}
