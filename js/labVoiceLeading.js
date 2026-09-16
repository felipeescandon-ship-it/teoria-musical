import { ROOTS } from "./data.js?v=4";
import { buildChordTones, chordSymbol, inversionName, bestInversion, voiceLeadingDistance, suggestFingering } from "./theory.js?v=5";
import { playChordSmart as playChordNow } from "./audioSampled.js?v=7";
import { buildKeyboard, highlightChordOnKeyboard } from "./keyboard.js?v=7";

// ========== Lab: free-form voice leading ==========
// Same concept as Lesson 9's "conecta la progresión con inversiones" (bestInversion() chained
// forward, compared against always-root-position), but here the sequence is typed free text
// instead of a fixed diatonic progression in one key.

const QUALITY_BY_SUFFIX = {
  "": "major", m: "minor", min: "minor", dim: "diminished", aug: "augmented",
  sus2: "sus2", sus4: "sus4", "7": "dom7", maj7: "maj7", m7: "min7", min7: "min7"
};
const TOKEN_RE = /^([A-Ga-g])([#♯b♭]?)(maj7|min7|sus2|sus4|dim|aug|m7|min|m|7)?$/;

function parseChordToken(raw) {
  const match = raw.match(TOKEN_RE);
  if (!match) return null;
  const accidental = match[2] === "♯" ? "#" : match[2] === "♭" ? "b" : (match[2] || "");
  const root = ROOTS.find(r => r.id === match[1].toUpperCase() + accidental);
  const quality = QUALITY_BY_SUFFIX[match[3] || ""];
  if (!root || !quality) return null;
  return { root, quality };
}

function tokenize(text) {
  return text.replace(/[→,]/g, " ").split(/\s+/).map(t => t.trim()).filter(Boolean).slice(0, 16);
}

function rootVersionOf(chords) {
  return chords.map(c => ({ ...c, inversion: 0, tones: buildChordTones(c.root, c.quality, 0, 48) }));
}
function connectedVersionOf(chords) {
  const version = [];
  chords.forEach((c, i) => {
    if (i === 0) { version.push({ ...c, inversion: 0, tones: buildChordTones(c.root, c.quality, 0, 48) }); return; }
    const best = bestInversion(version[i - 1].tones, c.root, c.quality, 48);
    version.push({ ...c, inversion: best.inversion, tones: best.tones });
  });
  return version;
}
function totalMovement(version) {
  return version.slice(1).reduce((sum, step, i) => sum + voiceLeadingDistance(version[i].tones, step.tones), 0);
}
function renderChordChips(version) {
  return version.map(({ root, quality, inversion, tones }) => {
    const bass = tones[0], symbol = chordSymbol(root, quality, bass.american);
    const fingers = suggestFingering(tones.length, inversion, "right").join("-");
    return `<span class="pill">${symbol} <small>(${inversionName(inversion, tones.length)} · dedos ${fingers})</small></span>`;
  }).join("");
}
function playSequence(version) {
  version.forEach((step, i) => setTimeout(() => {
    playChordNow(step.tones.map(t => t.midi));
    highlightChordOnKeyboard("vlKeyboard", step.tones);
  }, i * 900));
}

const sequenceInput = document.getElementById("vlSequence");
const errorBox = document.getElementById("vlError");
const rootChordsBox = document.getElementById("vlRootChords");
const connectedChordsBox = document.getElementById("vlConnectedChords");
const rootMovementEl = document.getElementById("vlRootMovement");
const connectedMovementEl = document.getElementById("vlConnectedMovement");
const playRootBtn = document.getElementById("vlPlayRoot");
const playConnectedBtn = document.getElementById("vlPlayConnected");

buildKeyboard("vlKeyboard", null, { octaves: 2 });

let lastRootVersion = null, lastConnectedVersion = null;

function renderVoiceLeading() {
  errorBox.hidden = true;
  const tokens = tokenize(sequenceInput.value);
  if (tokens.length < 2) {
    errorBox.hidden = false;
    errorBox.textContent = "Escribe al menos dos acordes para poder comparar el movimiento entre ellos.";
    return;
  }
  const chords = [], invalid = [];
  tokens.forEach(t => { const c = parseChordToken(t); if (c) chords.push(c); else invalid.push(t); });
  if (invalid.length) {
    errorBox.hidden = false;
    errorBox.textContent = `No reconocí: ${invalid.join(", ")}. Prueba con C, Am, G7 o Fmaj7.`;
    return;
  }
  lastRootVersion = rootVersionOf(chords);
  lastConnectedVersion = connectedVersionOf(chords);
  rootChordsBox.innerHTML = renderChordChips(lastRootVersion);
  connectedChordsBox.innerHTML = renderChordChips(lastConnectedVersion);
  rootMovementEl.textContent = `${totalMovement(lastRootVersion)} semitonos`;
  connectedMovementEl.textContent = `${totalMovement(lastConnectedVersion)} semitonos`;
  playRootBtn.disabled = false;
  playConnectedBtn.disabled = false;
  highlightChordOnKeyboard("vlKeyboard", lastConnectedVersion[0].tones);
}

document.getElementById("vlConnect").addEventListener("click", renderVoiceLeading);
sequenceInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); renderVoiceLeading(); } });
playRootBtn.addEventListener("click", () => lastRootVersion && playSequence(lastRootVersion));
playConnectedBtn.addEventListener("click", () => lastConnectedVersion && playSequence(lastConnectedVersion));

renderVoiceLeading();
