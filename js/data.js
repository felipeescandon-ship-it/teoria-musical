// ========== Musical data constants ==========
// NATURAL_PCS: pitch classes of white keys (Do, Re, Mi, Fa, Sol, La, Si) mapped to semitones 0-11
export const NATURAL_PCS = [0, 2, 4, 5, 7, 9, 11];
// Note names in Latin (Do, Re, Mi...) and American (C, D, E...) systems
export const LATIN_LETTERS = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];
export const AMERICAN_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
// Sharp/flat variations for notation and display
export const PC_SHARP_LATIN = ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"];
export const PC_FLAT_LATIN = ["Do", "Re♭", "Re", "Mi♭", "Mi", "Fa", "Sol♭", "Sol", "La♭", "La", "Si♭", "Si"];
export const PC_KEY_LABELS = ["Do", "Do♯/Re♭", "Re", "Re♯/Mi♭", "Mi", "Fa", "Fa♯/Sol♭", "Sol", "Sol♯/La♭", "La", "La♯/Si♭", "Si"];
export const PC_KEY_SHORT = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];

// All 12 roots (naturals + sharps + flats) with pitch class (pc), letter index, accidental, and notation in both systems
export const ROOTS = [
  { id:"C", pc:0, letter:0, accidental:0, latin:"Do", american:"C" },
  { id:"C#", pc:1, letter:0, accidental:1, latin:"Do♯", american:"C♯" },
  { id:"Db", pc:1, letter:1, accidental:-1, latin:"Re♭", american:"D♭" },
  { id:"D", pc:2, letter:1, accidental:0, latin:"Re", american:"D" },
  { id:"D#", pc:3, letter:1, accidental:1, latin:"Re♯", american:"D♯" },
  { id:"Eb", pc:3, letter:2, accidental:-1, latin:"Mi♭", american:"E♭" },
  { id:"E", pc:4, letter:2, accidental:0, latin:"Mi", american:"E" },
  { id:"F", pc:5, letter:3, accidental:0, latin:"Fa", american:"F" },
  { id:"F#", pc:6, letter:3, accidental:1, latin:"Fa♯", american:"F♯" },
  { id:"Gb", pc:6, letter:4, accidental:-1, latin:"Sol♭", american:"G♭" },
  { id:"G", pc:7, letter:4, accidental:0, latin:"Sol", american:"G" },
  { id:"G#", pc:8, letter:4, accidental:1, latin:"Sol♯", american:"G♯" },
  { id:"Ab", pc:8, letter:5, accidental:-1, latin:"La♭", american:"A♭" },
  { id:"A", pc:9, letter:5, accidental:0, latin:"La", american:"A" },
  { id:"A#", pc:10, letter:5, accidental:1, latin:"La♯", american:"A♯" },
  { id:"Bb", pc:10, letter:6, accidental:-1, latin:"Si♭", american:"B♭" },
  { id:"B", pc:11, letter:6, accidental:0, latin:"Si", american:"B" }
];

// Major scale formula in semitones from root: Tone-Tone-Semitone-Tone-Tone-Tone-Semitone (universal for any root)
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11, 12];

// Diatonic chord qualities by degree (universal for any major key): I, ii, iii, IV, V, vi, vii°
export const DIATONIC_QUALITIES = ["major", "minor", "minor", "major", "major", "minor", "diminished"];
export const DIATONIC_ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
// Harmonic function groups: Tónica (stable/home), Subdominante (movement away), Dominante (tension resolving to tonic)
export const DIATONIC_FUNCTIONS = ["Tónica", "Subdominante", "Tónica", "Subdominante", "Dominante", "Tónica", "Dominante"];
export const FUNCTION_COLOR_VAR = { "Tónica": "green", "Subdominante": "orange", "Dominante": "red" };

// Common diatonic chord progressions, written as roman numeral sequences (universal for any major key)
export const PROGRESSIONS = {
  "I-IV-V-I": ["I", "IV", "V", "I"],
  "I-V-vi-IV": ["I", "V", "vi", "IV"],
  "vi-IV-I-V": ["vi", "IV", "I", "V"],
  "ii-V-I": ["ii", "V", "I"]
};

// Chord types and their intervallic structure. Key musical insight: major (0-4-7) and minor (0-3-7) differ only in the 3rd.
export const CHORDS = {
  major: { label:"mayor", short:"", intervals:[0,4,7], degreeSteps:[0,2,4], degreeLabels:["1","3","5"], roleLabels:["raíz","3ª mayor","5ª justa"], feeling:"estable y luminoso" },
  minor: { label:"menor", short:"m", intervals:[0,3,7], degreeSteps:[0,2,4], degreeLabels:["1","♭3","5"], roleLabels:["raíz","3ª menor","5ª justa"], feeling:"estable con color menor" },
  diminished: { label:"disminuido", short:"dim", intervals:[0,3,6], degreeSteps:[0,2,4], degreeLabels:["1","♭3","♭5"], roleLabels:["raíz","3ª menor","5ª disminuida"], feeling:"muy inestable y tenso" },
  augmented: { label:"aumentado", short:"aug", intervals:[0,4,8], degreeSteps:[0,2,4], degreeLabels:["1","3","♯5"], roleLabels:["raíz","3ª mayor","5ª aumentada"], feeling:"abierto e inestable" },
  sus2: { label:"suspendido 2", short:"sus2", intervals:[0,2,7], degreeSteps:[0,1,4], degreeLabels:["1","2","5"], roleLabels:["raíz","2ª mayor","5ª justa"], feeling:"abierto y ambiguo" },
  sus4: { label:"suspendido 4", short:"sus4", intervals:[0,5,7], degreeSteps:[0,3,4], degreeLabels:["1","4","5"], roleLabels:["raíz","4ª justa","5ª justa"], feeling:"suspendido, suele pedir resolución" },
  dom7: { label:"séptima dominante", short:"7", intervals:[0,4,7,10], degreeSteps:[0,2,4,6], degreeLabels:["1","3","5","♭7"], roleLabels:["raíz","3ª mayor","5ª justa","7ª menor"], feeling:"tenso y con impulso de resolución" },
  maj7: { label:"séptima mayor", short:"maj7", intervals:[0,4,7,11], degreeSteps:[0,2,4,6], degreeLabels:["1","3","5","7"], roleLabels:["raíz","3ª mayor","5ª justa","7ª mayor"], feeling:"suave y expansivo" },
  min7: { label:"séptima menor", short:"m7", intervals:[0,3,7,10], degreeSteps:[0,2,4,6], degreeLabels:["1","♭3","5","♭7"], roleLabels:["raíz","3ª menor","5ª justa","7ª menor"], feeling:"menor, amplio y flexible" }
};

// Interval names indexed by semitone distance; used for displaying interval sizes
export const INTERVAL_NAMES = [
  "unísono", "segunda menor", "segunda mayor", "tercera menor", "tercera mayor", "cuarta justa",
  "tritono", "quinta justa", "sexta menor", "sexta mayor", "séptima menor", "séptima mayor", "octava"
];

// ========== Voicing types: closed, open (jazz), drop2, shell ==========
// Redistribute chord tones across octaves (see applyVoicing() in theory.js)
export const VOICING_TYPES = {
  "closed": {
    label: "Cerrado (3 notas juntas)",
    description: "Las notas del acorde dentro de una octava; sonido compacto"
  },
  "open": {
    label: "Abierto (jazz)",
    description: "La tercera sube una octava; raíz y quinta quedan abajo; sonido espacioso"
  },
  "drop2": {
    label: "Drop 2 (de bajo)",
    description: "La quinta baja una octava; abre espacio entre la raíz y el resto del acorde"
  },
  "shell": {
    label: "Cáscara (raíz–tercera–séptima)",
    description: "Omite la quinta; deja solo raíz, tercera y séptima (si existe); sonido limpio"
  }
};

// Root ids commonly used in "practical" spelling mode (lab lesson root picker)
export const PRACTICAL_ROOT_IDS = ["C","Db","D","Eb","E","F","F#","G","Ab","A","Bb","B"];
