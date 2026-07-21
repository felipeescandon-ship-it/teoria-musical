// ========== Versioned localStorage persistence ==========
const LEGACY_KEY = "musicLessonStates"; // pre-versioning key: held a bare lessonStates object
const KEY = "musicAppState";
export const CURRENT_VERSION = 2;

// Each entry migrates data from that version to version+1. Add a new entry whenever the
// stored shape changes, and bump CURRENT_VERSION — never mutate an old migration in place.
const migrations = {
  1: (data) => data // v1 -> v2: adopt the {version, data} envelope; lessonStates shape unchanged
};

// Pure: given whatever was JSON.parsed from storage (or null for a first-time user), return
// {version, data} pinned at CURRENT_VERSION. No localStorage access here, so it's unit-testable.
export function migrate(parsed) {
  let version = parsed?.version || 1;
  let data = parsed?.data || {};
  while (version < CURRENT_VERSION) {
    const step = migrations[version];
    if (!step) break;
    data = step(data);
    version++;
  }
  return { version: CURRENT_VERSION, data };
}

function readStoredState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return migrate(JSON.parse(raw));
  } catch (_) {}
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return migrate({ version: 1, data: { lessonStates: JSON.parse(legacy) } });
  } catch (_) {}
  return migrate(null);
}

let state = readStoredState();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
}

// Merge persisted lessonStates over the given defaults (so newly-added lessons still start "not_started")
export function loadLessonStates(defaults) {
  return { ...defaults, ...(state.data.lessonStates || {}) };
}

export function saveLessonStates(lessonStates) {
  state = { ...state, data: { ...state.data, lessonStates } };
  persist();
}
