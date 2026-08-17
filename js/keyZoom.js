import { loadKeyZoom, saveKeyZoom } from "./storage.js?v=5";

// ========== Key-width zoom, scoped to Laboratorio and Practicar only ==========
// Lesson panels always stay at 100%: several missions rely on seeing a full chord or interval
// at once (see js/lessons/lesson02.js, lesson05.js, lesson08.js), and forcing horizontal scroll
// mid-mission there would break that. Lab and Practicar have no such constraint, so this is where
// zooming toward real piano key width (~160%) is safe. One shared persisted value keeps both
// panels' sliders in sync rather than tracking two independent preferences.
const DEFAULT_ZOOM = 100;
const zoom = loadKeyZoom(DEFAULT_ZOOM);

const PANELS = [
  { panel: document.getElementById("mode-lab"), input: document.getElementById("labKeyZoom"), output: document.getElementById("labKeyZoomValue") },
  { panel: document.getElementById("mode-practice"), input: document.getElementById("practiceKeyZoom"), output: document.getElementById("practiceKeyZoomValue") }
];

function applyZoom(value) {
  PANELS.forEach(({ panel, input, output }) => {
    panel.style.setProperty("--key-scale", value / 100);
    input.value = value;
    output.textContent = `${value}%`;
  });
}

applyZoom(zoom);
PANELS.forEach(({ input }) => input.addEventListener("input", () => {
  const value = Number(input.value);
  applyZoom(value);
  saveKeyZoom(value);
}));
