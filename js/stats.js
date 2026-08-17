import { loadSkillStats, saveSkillStats } from "./storage.js?v=5";
import { showMode, showLesson } from "./nav.js?v=7";

// ========== Skill stats (Épica C2): track right/wrong per skill, recommend what to review ==========
// "Modality" separates a tactile/visual check (build the chord, tap the right key) from an
// auditory one (identify a quality/function/pattern by ear) — the backlog explicitly asks these
// to stay separate rather than folding into one accuracy number.
export const SKILLS = {
  notas: "Notas y alteraciones",
  intervalos: "Intervalos",
  calidad: "Calidad de acorde",
  inversiones: "Inversiones",
  funcion: "Función armónica",
  construccion: "Construcción de acordes",
  arpegio: "Patrones de arpegio",
};

// Where "Ir a practicarlo" should send the user for each skill.
const SKILL_LINKS = {
  notas: { mode: "course", lesson: 1 },
  intervalos: { mode: "course", lesson: 2 },
  calidad: { mode: "practice" },
  inversiones: { mode: "course", lesson: 5 },
  funcion: { mode: "course", lesson: 8 },
  construccion: { mode: "practice" },
  arpegio: { mode: "course", lesson: 10 },
};

// Below this many attempts, an accuracy number is too noisy to recommend on (e.g. 0/1 = 0%).
const MIN_ATTEMPTS = 3;

function emptySkill() {
  return { visual: { correct: 0, total: 0 }, audio: { correct: 0, total: 0 } };
}
function defaults() {
  const d = {};
  Object.keys(SKILLS).forEach((k) => (d[k] = emptySkill()));
  return d;
}

const stats = loadSkillStats(defaults());
Object.keys(SKILLS).forEach((k) => { if (!stats[k]) stats[k] = emptySkill(); });

export function recordAttempt(skill, correct, modality = "visual") {
  const bucket = stats[skill][modality];
  bucket.total++;
  if (correct) bucket.correct++;
  saveSkillStats(stats);
  renderStatsPanel();
}

function totalsFor(skill) {
  const s = stats[skill];
  return { correct: s.visual.correct + s.audio.correct, total: s.visual.total + s.audio.total };
}

function summary() {
  return Object.entries(SKILLS).map(([key, label]) => {
    const t = totalsFor(key);
    return { key, label, ...t, accuracy: t.total ? t.correct / t.total : null };
  });
}

function recommendation() {
  const candidates = summary().filter((s) => s.total >= MIN_ATTEMPTS);
  if (!candidates.length) return null;
  return candidates.sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)[0];
}

function renderStatsPanel() {
  const grid = document.getElementById("skillStatsGrid");
  const rec = document.getElementById("skillStatsRecommendation");
  if (!grid || !rec) return;

  grid.innerHTML = summary().map((s) => {
    const pct = s.accuracy === null ? null : Math.round(s.accuracy * 100);
    return `<div class="info-item">
      <span>${s.label}</span>
      <strong>${pct === null ? "Sin datos" : `${pct}% · ${s.correct}/${s.total}`}</strong>
      <div class="progress-track"><div class="progress-fill" style="transform:scaleX(${s.total ? s.accuracy : 0})"></div></div>
    </div>`;
  }).join("");

  const top = recommendation();
  if (!top) {
    rec.className = "callout info";
    rec.innerHTML = "Practica un poco en cualquier lección o examen: aquí verás qué concepto conviene repasar según tus aciertos reales, no una ruta fija.";
    return;
  }
  const pct = Math.round(top.accuracy * 100);
  const link = SKILL_LINKS[top.key];
  rec.className = "callout info";
  rec.innerHTML = `<strong>Conviene repasar: ${top.label}.</strong> ${pct}% de aciertos en ${top.total} intento${top.total === 1 ? "" : "s"}.${link ? ` <button type="button" id="skillStatsGoTo" class="btn small mt-sm">Ir a practicarlo</button>` : ""}`;
  if (link) {
    document.getElementById("skillStatsGoTo").addEventListener("click", () => {
      showMode(link.mode);
      if (link.lesson) showLesson(link.lesson);
    });
  }
}

renderStatsPanel();
