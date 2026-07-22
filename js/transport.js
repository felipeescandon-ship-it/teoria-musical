import { resumeAudioContext, getAudioContext, cancelVoices } from "./audio.js";
import { secondsPerBeat, collectScheduledBeats } from "./timing.js";

// ========== Lookahead-scheduler transport (Épica C1: tempo, count-in, loop) ==========
// setTimeout here NEVER decides when a note sounds — it only wakes the scheduler often enough
// to keep a short window of future beats agendados against AudioContext.currentTime (the only
// clock that matters). Even if a timer fires 20-30ms late, every beat it schedules still lands
// exactly on time, because collectScheduledBeats() computes each beat's time by adding
// secondsPerBeat repeatedly from the last one — never from Date.now() or "now".
const LOOKAHEAD_MS = 80;
const SCHEDULE_AHEAD_SEC = 0.4;
const START_PADDING_SEC = 0.08; // small buffer so the very first beat isn't scheduled in the past

export function createTransport({ onScheduleBeat }) {
  let running = false;
  let timerId = null;
  let bpm = 60;
  let nextBeat = 0;
  let nextBeatTime = 0;
  let generation = 0; // invalidates a stale start() that's still awaiting resume when stop()/a new start() runs
  const voices = new Set();

  function registerVoices(created) {
    (Array.isArray(created) ? created : [created]).forEach(v => v && voices.add(v));
  }

  function scheduler(ownGeneration) {
    if (!running || ownGeneration !== generation) return;
    const ctx = getAudioContext();
    const beatDuration = secondsPerBeat(bpm);
    const result = collectScheduledBeats({
      nextBeat, nextBeatTime, beatDuration,
      horizon: ctx.currentTime + SCHEDULE_AHEAD_SEC
    });
    nextBeat = result.nextBeat;
    nextBeatTime = result.nextBeatTime;
    result.beats.forEach(({ beat, when }) => {
      onScheduleBeat({ beat, when, secondsPerBeat: beatDuration, registerVoices });
    });
    timerId = window.setTimeout(() => scheduler(ownGeneration), LOOKAHEAD_MS);
  }

  // Async because it must wait for the AudioContext to actually be running before anchoring
  // nextBeatTime against its clock — anchoring while still suspended would start the whole
  // loop from a frozen (or soon-to-jump) currentTime.
  async function start({ tempo = 60 } = {}) {
    stop(); // cancel any previous run/voices before starting a new one
    const ownGeneration = ++generation;
    const ctx = await resumeAudioContext();
    if (ownGeneration !== generation) return; // stop()/another start() happened during the await
    bpm = tempo;
    nextBeat = 0;
    nextBeatTime = ctx.currentTime + START_PADDING_SEC;
    running = true;
    scheduler(ownGeneration);
  }

  // cancel:true (default) = the user pressed Stop: kill everything, including notes already
  // scheduled into the lookahead window that haven't become audible yet.
  // cancel:false = the sequence finished on its own (a single, non-looping pass): halt the
  // scheduler but let the notes already scheduled ring out naturally to their own release.
  function stop({ cancel = true } = {}) {
    generation += 1; // invalidate any in-flight start()'s await and any pending scheduler tick
    running = false;
    if (timerId !== null) { clearTimeout(timerId); timerId = null; }
    if (cancel) cancelVoices(voices); else voices.clear();
  }

  // Applies from the next scheduler tick onward (within LOOKAHEAD_MS) — beats already collected
  // into the current window keep their original spacing rather than jumping mid-batch.
  function setTempo(nextBpm) { bpm = nextBpm; }

  return { start, stop, setTempo, get running() { return running; } };
}
