import {
  ROOTS, CHORDS, NATURAL_PCS, LATIN_LETTERS, AMERICAN_LETTERS,
  MAJOR_SCALE_INTERVALS, DIATONIC_QUALITIES, DIATONIC_ROMANS, DIATONIC_FUNCTIONS
} from "./data.js";

// ========== Chord theory utilities ==========
// Convert accidental difference to notation (♯, ♭, etc.)
export function accidentalText(diff) {
  const map={"-3":"♭♭♭","-2":"♭♭","-1":"♭","0":"","1":"♯","2":"𝄪","3":"♯♯♯"};
  return map[String(diff)] ?? (diff>0?"♯".repeat(diff):"♭".repeat(-diff));
}
// Normalize accidental difference to ±6 range (no double-flats in simple cases)
export function normalizeDiff(diff){ while(diff>6)diff-=12; while(diff<-6)diff+=12; return diff; }
// Spell a chord from a root: generates note names respecting scale degrees, not just pitch classes
export function spellChord(root,qualityKey) {
  const chord=CHORDS[qualityKey];
  return chord.intervals.map((interval,i)=>{
    const letter=(root.letter+chord.degreeSteps[i])%7, targetPc=(root.pc+interval)%12;
    const diff=normalizeDiff(targetPc-NATURAL_PCS[letter]);
    return {latin:LATIN_LETTERS[letter]+accidentalText(diff),american:AMERICAN_LETTERS[letter]+accidentalText(diff),pc:targetPc,degree:chord.degreeLabels[i],roleLabel:chord.roleLabels[i],role:i,accidental:diff};
  });
}
// Generate chord symbol (e.g., "Cm" or "C/E" for first inversion)
export function chordSymbol(root,qualityKey,bassAmerican=null){ const base=root.american+CHORDS[qualityKey].short; return bassAmerican&&bassAmerican!==root.american?`${base}/${bassAmerican}`:base; }

// ========== Voicing: redistribute an already-built chord's notes across octaves ==========
// Applied after inversion, using each tone's stable `role` (0=root,1=3rd,2=5th,3=7th) so it
// works no matter which note the inversion put in the bass.
export function sortByMidi(tones) { return [...tones].sort((a,b) => a.midi - b.midi); }
export function applyVoicing(tones, voicingType) {
  const byRole = r => tones.find(t => t.role === r);
  if (voicingType === "open") {
    // Spread the 3rd up an octave: root and 5th stay put, 3rd rings out above
    const third = byRole(1); if (!third) return tones;
    return sortByMidi(tones.map(t => t===third ? {...t, midi:t.midi+12} : t));
  }
  if (voicingType === "drop2") {
    // Drop the 5th down an octave: opens space between root and the rest
    const fifth = byRole(2); if (!fifth) return tones;
    return sortByMidi(tones.map(t => t===fifth ? {...t, midi:t.midi-12} : t));
  }
  if (voicingType === "shell") {
    // Omit the 5th entirely: keep only root, 3rd, and 7th (if present)
    return tones.filter(t => t.role !== 2);
  }
  return tones; // "closed": leave as-is
}
// Build complete chord with MIDI values, respecting inversion (which note is in the bass),
// voicing type (how notes spread across octaves), and octave constraints
export function buildChordTones(root,qualityKey,inversion=0,baseRootMidi=48,voicingType="closed") {
  const spelled=spellChord(root,qualityKey);
  let tones=CHORDS[qualityKey].intervals.map((interval,i)=>({...spelled[i],midi:baseRootMidi+root.pc+interval}));
  // Apply inversion by rotating notes and octaving them up
  const inv=Math.min(Number(inversion),tones.length-1);
  for(let i=0;i<inv;i++){ const first=tones.shift(); tones.push({...first,midi:first.midi+12}); }
  tones=applyVoicing(tones,voicingType);
  // Keep all notes within a playable range (MIDI 48–72)
  while(Math.max(...tones.map(t=>t.midi))>72) tones=tones.map(t=>({...t,midi:t.midi-12}));
  while(Math.min(...tones.map(t=>t.midi))<48) tones=tones.map(t=>({...t,midi:t.midi+12}));
  return tones;
}
// Spell a major scale from a root: one note per letter, respecting the universal T-T-S-T-T-T-S pattern
export function spellScale(root) {
  return MAJOR_SCALE_INTERVALS.map((interval,i) => {
    const letter=(root.letter+i)%7, targetPc=(root.pc+interval)%12;
    const diff=normalizeDiff(targetPc-NATURAL_PCS[letter]);
    return {latin:LATIN_LETTERS[letter]+accidentalText(diff),american:AMERICAN_LETTERS[letter]+accidentalText(diff),pc:targetPc,degree:i+1,accidental:diff};
  });
}
// Build the full major scale (8 notes, root to octave) with MIDI values
export function buildScaleTones(root,baseRootMidi=48) {
  const spelled=spellScale(root);
  return spelled.map((note,i)=>({...note,midi:baseRootMidi+root.pc+MAJOR_SCALE_INTERVALS[i],role:i===0||i===7?0:1}));
}
// Build the 7 diatonic chords for any major key: one chord per scale degree, with roman numeral and harmonic function
export function buildDiatonicChords(root) {
  const scale=spellScale(root);
  return DIATONIC_QUALITIES.map((quality,i) => {
    const scaleNote=scale[i];
    const chordRoot={id:scaleNote.american, pc:scaleNote.pc, letter:(root.letter+i)%7, accidental:scaleNote.accidental, latin:scaleNote.latin, american:scaleNote.american};
    return {quality, roman:DIATONIC_ROMANS[i], func:DIATONIC_FUNCTIONS[i], root:chordRoot, name:`${scaleNote.latin} ${CHORDS[quality].label}`};
  });
}
export function rootById(id){ return ROOTS.find(r=>r.id===id)||ROOTS[0]; }
export function inversionName(n,count){ return n===0?"posición fundamental":n===1?"primera inversión":n===2?"segunda inversión":n===3&&count===4?"tercera inversión":"inversión"; }
export function octaveOf(midi){ return Math.floor(midi/12)-1; }
