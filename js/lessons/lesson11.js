import { rootById, buildChordTones } from "../theory.js";
import { getAudioContext, playChordAt } from "../audio.js";
import { setLessonState } from "../nav.js";

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
function playProgressionWithVoicing(voicingType, stepMs) {
  const ctx = getAudioContext();
  const startTime = ctx.currentTime + 0.08; // same small buffer used elsewhere before a first sound
  const stepSeconds = stepMs / 1000;
  PROGRESSION.forEach((chord, i) => {
    const tones = buildChordTones(chord.root, chord.quality, 0, 48, voicingType);
    playChordAt(tones.map(t => t.midi), startTime + i * stepSeconds);
  });
}

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; color: var(--text); font-family: inherit; }
    h2 { margin: 0 0 10px; font-size: 1.5rem; }
    p.intro { color: var(--muted); line-height: 1.55; }
    .cards { display: grid; gap: 14px; margin: 18px 0; }
    .card {
      border: 1px solid var(--line); border-radius: var(--radius, 16px);
      padding: 16px 18px; background: var(--panel-soft, #fafaff);
    }
    .card h3 { margin: 0 0 6px; font-size: 1.05rem; }
    .card p { margin: 6px 0; line-height: 1.5; }
    .why { color: var(--accent-dark, var(--accent)); font-weight: 600; font-size: .92rem; }
    button {
      margin-top: 10px; border: none; border-radius: 999px; padding: 8px 16px;
      background: var(--accent); color: white; font: inherit; font-weight: 600; cursor: pointer;
    }
    button:hover { filter: brightness(1.08); }
    .mission {
      border: 1px dashed var(--accent); border-radius: var(--radius, 16px);
      padding: 14px 16px; margin-top: 8px;
    }
    .mission-title { font-weight: 700; margin-bottom: 6px; }
    .dots { letter-spacing: 3px; }
  </style>
  <h2>Los mismos voicings, en contexto musical real</h2>
  <p class="intro">
    Ya escuchaste closed, open, drop 2 y shell sobre un único acorde. Ahora escúchalos dentro de una
    progresión real de jazz (ii7–V7–Imaj7 en Do), cada uno al tempo donde realmente se usa. La razón
    para elegir un voicing casi nunca es solo "cómo suena" — también es "¿me da tiempo de tocarlo?".
  </p>
  <div class="cards"></div>
  <div class="mission">
    <div class="mission-title">Misión: escucha la progresión en los 4 contextos</div>
    <p>Pulsa los cuatro botones para sentir cómo el mismo ii–V–I cambia de carácter según el voicing y el tempo.</p>
    <div class="dots">○ ○ ○ ○</div>
  </div>
`;

class LessonRealMusic extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(TEMPLATE.content.cloneNode(true));
    const cardsEl = root.querySelector(".cards");
    const dotsEl = root.querySelector(".dots");
    const heard = new Set();

    CONTEXTS.forEach(c => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${c.label}</h3>
        <p>${c.context}</p>
        <p class="why">${c.why}</p>
        <button type="button">Escuchar en contexto (${Math.round(60000 / c.stepMs)} negras/min aprox.)</button>
      `;
      card.querySelector("button").addEventListener("click", () => {
        setLessonState(11, "explored");
        playProgressionWithVoicing(c.type, c.stepMs);
        heard.add(c.type);
        if (heard.size === 1) setLessonState(11, "practiced");
        dotsEl.textContent = CONTEXTS.map(x => heard.has(x.type) ? "●" : "○").join(" ");
        if (heard.size === CONTEXTS.length) setLessonState(11, "mastered");
      });
      cardsEl.appendChild(card);
    });
  }
}

customElements.define("lesson-real-music", LessonRealMusic);
