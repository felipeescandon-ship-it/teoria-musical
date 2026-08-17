import { rootById, buildChordTones } from "../theory.js?v=3";
import { getAudioContext, playChordAt } from "../audio.js?v=5";
import { getSampledPiano, playChordAtSampled } from "../audioSampled.js?v=7";
import { setLessonState } from "../nav.js?v=7";
import { renderMissionDots } from "../icons.js?v=3";

// ========== Lesson 11: Connecting voicings to real music (Web Component) ==========
// Unlike lessons 1-10 (plain script attaching listeners to app.html's markup), this lesson
// is a real custom element with its own Shadow DOM — the pattern future lessons should follow.
// It has no interactive piano (buildKeyboard looks elements up via the global document, which
// can't see inside a shadow root), so it teaches through audio-only "hear it in context" demos.

const PROGRESSION = [
  { root: rootById("D"), quality: "min7" },  // ii7
  { root: rootById("G"), quality: "dom7" },  // V7
  { root: rootById("C"), quality: "maj7" }   // Imaj7
];

// Each voicing paired with a real-world context and a tempo that makes the reasoning audible:
// the same ii-V-I is played at a tempo genuinely suited to that voicing's note count and spread.
const CONTEXTS = [
  {
    type: "closed", label: "Cerrado",
    context: "Arreglos de piano y voz en pop/balada: todas las notas caben bajo la mano sin saltos, fácil de leer y cantar encima.",
    why: "A tempo medio, el voicing cerrado sigue siendo compacto y claro — ni sobra ni falta espacio.",
    stepMs: 700
  },
  {
    type: "open", label: "Abierto",
    context: "Arreglo orquestal y baladas de piano lentas (piensa en una balada pop al piano, tipo \"Someone Like You\"): la 3ª sube una octava y deja espacio grave-agudo.",
    why: "Ese espacio necesita tiempo para \"respirar\". A tempo lento suena amplio; a tempo rápido, simplemente disperso.",
    stepMs: 1050
  },
  {
    type: "drop2", label: "Drop 2",
    context: "El voicing de comping más común en jazz de piano y guitarra (popularizado por pianistas como Bill Evans) en standards como \"Autumn Leaves\".",
    why: "Es compacto para la mano y mantiene la melodía arriba, así que se puede tocar con precisión incluso a tempos ágiles de swing.",
    stepMs: 460
  },
  {
    type: "shell", label: "Cáscara",
    context: "Comping de jazz a tempos muy rápidos (bebop): solo raíz, 3ª y 7ª — el bajista ya cubre la raíz y otro instrumento puede sumar la 5ª.",
    why: "Con menos notas, la mano llega a tiempo incluso en temas rapidísimos donde un voicing cerrado o abierto se \"embarra\".",
    stepMs: 320
  }
];

// Schedules the whole (short, finite — 3 chords) progression up front against the
// AudioContext's own clock, instead of setTimeout deciding when each chord sounds. A finite
// sequence like this can just be scheduled all at once; the lookahead scheduler in
// transport.js is reserved for Lesson 9's open-ended loop, which can't know its beats in
// advance the way this fixed 3-chord sequence can.
//
// `engine` picks which sound source plays the progression — "synth" (audio.js, always ready)
// or "sampled" (the Steinway prototype from audioSampled.js). The sampled piano's first call
// awaits its sample load before computing startTime, so "now + 0.08s" still means now — if it
// were computed before the await, a slow first load would make every chord fire in the past.
async function playProgressionWithVoicing(voicingType, stepMs, engine) {
  const ctx = getAudioContext();
  const stepSeconds = stepMs / 1000;
  const chords = PROGRESSION.map(chord => buildChordTones(chord.root, chord.quality, 0, 48, voicingType));
  const piano = engine === "sampled" ? await getSampledPiano() : null;
  const startTime = ctx.currentTime + 0.08; // same small buffer used elsewhere before a first sound
  chords.forEach((tones, i) => {
    const when = startTime + i * stepSeconds;
    const midis = tones.map(t => t.midi);
    if (piano) playChordAtSampled(piano, midis, when, stepSeconds * 0.9);
    else playChordAt(midis, when);
  });
}

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; color: var(--text); font-family: inherit; }
    h2 { margin: 0 0 10px; font-size: 1.5rem; font-family: var(--font-sans); }
    p.intro { color: var(--muted); line-height: 1.55; }
    .cards { display: grid; gap: 14px; margin: 18px 0; }
    .card {
      border: 1px solid var(--line); border-radius: var(--radius-md);
      padding: 16px 18px; background: var(--panel-soft);
    }
    .card h3 { margin: 0 0 6px; font-size: 1.05rem; font-family: var(--font-serif); color: var(--text); }
    .card p { margin: 6px 0; line-height: 1.5; }
    .why { color: var(--accent-dark); font-weight: 600; font-size: .92rem; }
    button {
      margin-top: 10px; border: none; border-radius: var(--radius-sm); padding: 12px 20px;
      background: var(--accent); color: var(--accent-text); font: inherit; font-weight: var(--weight-heavy);
      cursor: pointer; box-shadow: var(--shadow-btn);
    }
    button:hover { background: var(--accent-hover); }
    button:active { background: var(--accent-pressed); }
    .mission {
      position: relative;
      background: var(--mission-bg); border: 1px solid var(--mission-border);
      border-radius: var(--radius-md); padding: 16px 16px 16px 60px; margin-top: 12px;
      color: var(--mission-text-color);
    }
    .mission { --target-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='6' fill='none' stroke='black' stroke-width='1.6'/%3E%3Ccircle cx='10' cy='10' r='1.8' fill='black'/%3E%3C/svg%3E"); }
    .mission::before {
      content: ""; position: absolute; left: 16px; top: 16px;
      width: 32px; height: 32px; border-radius: 50%;
      background-color: var(--mission-icon-bg);
    }
    .mission::after {
      content: ""; position: absolute; left: 16px; top: 16px;
      width: 32px; height: 32px;
      background-color: var(--mission-icon-color);
      -webkit-mask: var(--target-icon) center / 15px 15px no-repeat;
      mask: var(--target-icon) center / 15px 15px no-repeat;
    }
    .mission-title { color: var(--mission-title-color); font-weight: var(--weight-heavy); margin-bottom: 5px; }
    .dots { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
    .mission-dot { width: 15px; height: 15px; border-radius: 50%; border: 2px solid var(--accent); background: transparent; flex: 0 0 auto; }
    .mission-dot.filled { background: var(--accent); }
    .engine-toggle {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      border: 1px solid var(--line); border-radius: var(--radius-md);
      padding: 12px 16px; margin: 16px 0; background: var(--panel-soft);
    }
    .engine-toggle span.label { color: var(--muted); }
    .engine-toggle .status { color: var(--muted); }
    .engine-toggle button {
      border: 1px solid var(--line); border-radius: var(--radius-sm);
      padding: 8px 14px; background: var(--panel); color: var(--text);
      font: inherit; font-weight: var(--weight-heavy); cursor: pointer; box-shadow: none;
    }
    .engine-toggle button.active { background: var(--accent); color: var(--accent-text); border-color: var(--accent); }
  </style>
  <h2>Los mismos voicings, en contexto musical real</h2>
  <p class="intro">
    Ya escuchaste closed, open, drop 2 y shell sobre un único acorde. Ahora escúchalos dentro de una
    progresión real de jazz (ii7–V7–Imaj7 en Do), cada uno al tempo donde realmente se usa. La razón
    para elegir un voicing casi nunca es solo "cómo suena" — también es "¿me da tiempo de tocarlo?".
  </p>
  <div class="engine-toggle">
    <span class="label">Motor de sonido:</span>
    <button type="button" data-engine="synth">Sintetizador (comparar)</button>
    <button type="button" data-engine="sampled" class="active">Piano real</button>
    <span class="status"></span>
  </div>
  <div class="cards"></div>
  <div class="mission">
    <div class="mission-title">Misión: escucha la progresión en los 4 contextos</div>
    <p>Pulsa los cuatro botones para sentir cómo el mismo ii–V–I cambia de carácter según el voicing y el tempo.</p>
    <div class="dots"></div>
  </div>
`;

class LessonRealMusic extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(TEMPLATE.content.cloneNode(true));
    const cardsEl = root.querySelector(".cards");
    const dotsEl = root.querySelector(".dots");
    const heard = new Set();
    renderMissionDots(dotsEl, CONTEXTS.map(() => false));

    let engine = "sampled";
    const engineButtons = root.querySelectorAll(".engine-toggle button");
    const statusEl = root.querySelector(".engine-toggle .status");
    engineButtons.forEach(btn => btn.addEventListener("click", () => {
      engine = btn.dataset.engine;
      engineButtons.forEach(b => b.classList.toggle("active", b === btn));
      statusEl.textContent = "";
    }));

    CONTEXTS.forEach(c => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${c.label}</h3>
        <p>${c.context}</p>
        <p class="why">${c.why}</p>
        <button type="button">Escuchar en contexto (${Math.round(60000 / c.stepMs)} negras/min aprox.)</button>
      `;
      card.querySelector("button").addEventListener("click", async () => {
        setLessonState(11, "explored");
        if (engine === "sampled") statusEl.textContent = "Cargando muestras de piano…";
        await playProgressionWithVoicing(c.type, c.stepMs, engine);
        if (engine === "sampled") statusEl.textContent = "";
        heard.add(c.type);
        if (heard.size === 1) setLessonState(11, "practiced");
        renderMissionDots(dotsEl, CONTEXTS.map(x => heard.has(x.type)));
        if (heard.size === CONTEXTS.length) setLessonState(11, "mastered");
      });
      cardsEl.appendChild(card);
    });
  }
}

customElements.define("lesson-real-music", LessonRealMusic);
