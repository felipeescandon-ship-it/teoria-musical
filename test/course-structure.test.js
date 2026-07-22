import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ========== Course-structure guardrails ==========
// These don't test music theory — they test that the COURSE ITSELF is navigable and
// self-consistent. They exist because a missing "Continuar" button in Lesson 5 once
// silently cut the guided path short, hiding lessons 6-11 from anyone following it, and
// stale "Lección N de 5/6/7/8/10" headers once disagreed with the sidebar's "de 11".
// Neither of those was catchable by the existing theory/audio/storage unit tests.
const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "..", "index.html"), "utf8");
const nav = readFileSync(join(__dirname, "..", "js", "nav.js"), "utf8");

const LESSON_COUNT = Number(nav.match(/LESSON_COUNT\s*=\s*(\d+)/)[1]);

// Parse each <article class="lesson-panel" data-lesson-panel="N">...</article> block in
// document order. Lesson panels aren't nested, so a non-greedy match is safe here.
const panelRe = /<article class="lesson-panel[^"]*" data-lesson-panel="(\d+)">([\s\S]*?)<\/article>/g;
const panels = [...html.matchAll(panelRe)].map(([, n, body]) => ({ n: Number(n), body }));

test("every lesson panel referenced in the sidebar (1..LESSON_COUNT) exists exactly once", () => {
  const found = panels.map(p => p.n).sort((a, b) => a - b);
  const expected = Array.from({ length: LESSON_COUNT }, (_, i) => i + 1);
  expect(found).toEqual(expected);
});

test('every lesson eyebrow reads "Lección N de <LESSON_COUNT>"', () => {
  for (const { n, body } of panels) {
    const m = body.match(/class="eyebrow">Lección (\d+) de (\d+)/);
    expect(m).not.toBeNull();
    const [, shown, total] = m;
    expect(Number(shown)).toBe(n);
    expect(Number(total)).toBe(LESSON_COUNT);
  }
});

test("the guided path (lesson-next buttons) reaches every lesson from 1 to LESSON_COUNT with no gaps", () => {
  const visited = [];
  let current = 1;
  while (current != null) {
    visited.push(current);
    const panel = panels.find(p => p.n === current);
    const next = panel.body.match(/class="btn lesson-next" data-next="(\d+)"/);
    current = next ? Number(next[1]) : null;
  }
  const expected = Array.from({ length: LESSON_COUNT }, (_, i) => i + 1);
  expect(visited).toEqual(expected);
});

test("every lesson-prev button points at the immediately preceding lesson", () => {
  for (const { n, body } of panels) {
    if (n === 1) continue; // lesson 1 has nothing to go back to
    const prev = body.match(/class="btn secondary lesson-prev" data-prev="(\d+)"/);
    expect(prev).not.toBeNull();
    expect(Number(prev[1])).toBe(n - 1);
  }
});
