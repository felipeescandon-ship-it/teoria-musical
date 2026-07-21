import { rootById } from "../js/theory.js";
import {
  accidentalText, normalizeDiff, spellChord, chordSymbol, applyVoicing,
  buildChordTones, spellScale, buildScaleTones, buildDiatonicChords, inversionName
} from "../js/theory.js";

const C = rootById("C");
const D = rootById("D");
const Fs = rootById("F#");
const Eb = rootById("Eb");

describe("accidentalText / normalizeDiff", () => {
  test("0 diff has no symbol", () => {
    expect(accidentalText(0)).toBe("");
  });
  test("+1 diff is a sharp", () => {
    expect(accidentalText(1)).toBe("♯");
  });
  test("-1 diff is a flat", () => {
    expect(accidentalText(-1)).toBe("♭");
  });
  test("normalizeDiff wraps values above 6 down by 12", () => {
    expect(normalizeDiff(7)).toBe(-5);
  });
  test("normalizeDiff wraps values below -6 up by 12", () => {
    expect(normalizeDiff(-7)).toBe(5);
  });
});

describe("spellChord", () => {
  test("C major spells as C E G with no accidentals", () => {
    const notes = spellChord(C, "major").map(n => n.american);
    expect(notes).toEqual(["C", "E", "G"]);
  });
  test("C minor flats the third: C Eb G", () => {
    const notes = spellChord(C, "minor").map(n => n.american);
    expect(notes).toEqual(["C", "E♭", "G"]);
  });
  test("D major uses F# and A, not Gb", () => {
    const notes = spellChord(D, "major").map(n => n.american);
    expect(notes).toEqual(["D", "F♯", "A"]);
  });
  test("F# major spells every letter once (F# A# C#), not enharmonic duplicates", () => {
    const letters = spellChord(Fs, "major").map(n => n.american[0]);
    expect(letters).toEqual(["F", "A", "C"]);
  });
  test("dom7 chord has 4 tones with a flat 7th degree label", () => {
    const notes = spellChord(C, "dom7");
    expect(notes).toHaveLength(4);
    expect(notes[3].degree).toBe("♭7");
  });
});

describe("chordSymbol", () => {
  test("root position major triad has no slash", () => {
    expect(chordSymbol(C, "major")).toBe("C");
  });
  test("minor triad appends 'm'", () => {
    expect(chordSymbol(C, "minor")).toBe("Cm");
  });
  test("inversion with different bass adds a slash", () => {
    expect(chordSymbol(C, "major", "E")).toBe("C/E");
  });
  test("root position bass equal to root omits the slash", () => {
    expect(chordSymbol(C, "major", "C")).toBe("C");
  });
});

describe("buildChordTones", () => {
  test("root position C major tones stay within MIDI 48-72", () => {
    const tones = buildChordTones(C, "major", 0);
    tones.forEach(t => {
      expect(t.midi).toBeGreaterThanOrEqual(48);
      expect(t.midi).toBeLessThanOrEqual(72);
    });
  });
  test("first inversion puts the 3rd in the bass", () => {
    const tones = buildChordTones(C, "major", 1);
    expect(tones[0].role).toBe(1);
  });
  test("second inversion puts the 5th in the bass", () => {
    const tones = buildChordTones(C, "major", 2);
    expect(tones[0].role).toBe(2);
  });
  test("tones are always sorted ascending by midi", () => {
    const tones = buildChordTones(Eb, "dom7", 2, 48, "open");
    for (let i = 1; i < tones.length; i++) {
      expect(tones[i].midi).toBeGreaterThanOrEqual(tones[i - 1].midi);
    }
  });
});

describe("applyVoicing", () => {
  const tones = buildChordTones(C, "dom7", 0, 48, "closed");
  test("closed voicing keeps all 4 tones unchanged", () => {
    expect(applyVoicing(tones, "closed")).toHaveLength(4);
  });
  test("open voicing moves the 3rd up an octave", () => {
    const original = tones.find(t => t.role === 1);
    const voiced = applyVoicing(tones, "open").find(t => t.role === 1);
    expect(voiced.midi).toBe(original.midi + 12);
  });
  test("drop2 voicing moves the 5th down an octave", () => {
    const original = tones.find(t => t.role === 2);
    const voiced = applyVoicing(tones, "drop2").find(t => t.role === 2);
    expect(voiced.midi).toBe(original.midi - 12);
  });
  test("shell voicing removes the 5th, keeping root/3rd/7th", () => {
    const voiced = applyVoicing(tones, "shell");
    expect(voiced.some(t => t.role === 2)).toBe(false);
    expect(voiced).toHaveLength(3);
  });
});

describe("spellScale / buildScaleTones", () => {
  test("C major scale is all naturals", () => {
    const notes = spellScale(C).map(n => n.american);
    expect(notes).toEqual(["C", "D", "E", "F", "G", "A", "B", "C"]);
  });
  test("D major scale has exactly two sharps (F# and C#)", () => {
    const sharps = spellScale(D).filter(n => n.accidental === 1);
    expect(sharps.map(n => n.american)).toEqual(["F♯", "C♯"]);
  });
  test("buildScaleTones spans exactly one octave (12 semitones root to top)", () => {
    const tones = buildScaleTones(C);
    expect(tones[7].midi - tones[0].midi).toBe(12);
  });
});

describe("buildDiatonicChords", () => {
  test("C major key produces the standard I ii iii IV V vi vii° qualities", () => {
    const chords = buildDiatonicChords(C);
    expect(chords.map(c => c.quality)).toEqual([
      "major", "minor", "minor", "major", "major", "minor", "diminished"
    ]);
  });
  test("the V chord in C major is built on G", () => {
    const chords = buildDiatonicChords(C);
    expect(chords[4].root.american).toBe("G");
  });
});

describe("inversionName", () => {
  test("0 is root position", () => {
    expect(inversionName(0, 3)).toBe("posición fundamental");
  });
  test("3 is third inversion only for 4-note chords", () => {
    expect(inversionName(3, 4)).toBe("tercera inversión");
  });
});
