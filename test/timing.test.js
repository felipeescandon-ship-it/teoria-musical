import { secondsPerBeat, progressionEventAtBeat, collectScheduledBeats } from "../js/timing.js";

// ========== Timing math for the tempo/loop transport (Épica C1) ==========
describe("secondsPerBeat", () => {
  test("60 BPM is one second per beat", () => {
    expect(secondsPerBeat(60)).toBe(1);
  });
  test("120 BPM is half a second per beat", () => {
    expect(secondsPerBeat(120)).toBe(0.5);
  });
  test("rejects zero or negative BPM", () => {
    expect(() => secondsPerBeat(0)).toThrow(RangeError);
    expect(() => secondsPerBeat(-10)).toThrow(RangeError);
  });
  test("rejects non-finite BPM", () => {
    expect(() => secondsPerBeat(NaN)).toThrow(RangeError);
    expect(() => secondsPerBeat(Infinity)).toThrow(RangeError);
  });
});

describe("progressionEventAtBeat", () => {
  const config = (beat, overrides = {}) =>
    progressionEventAtBeat({ beat, chordCount: 4, chordsPerBar: 1, ...overrides });

  test("produce cuatro pulsos de conteo previo (beatsPerBar=4, countInBars=1)", () => {
    expect(config(0).type).toBe("count-in");
    expect(config(1).type).toBe("count-in");
    expect(config(2).type).toBe("count-in");
    expect(config(3).type).toBe("count-in");
    expect(config(4).type).toBe("playback");
  });

  test("un acorde por compás", () => {
    expect(config(4, { chordsPerBar: 1 }).chordIndex).toBe(0);
    expect(config(5, { chordsPerBar: 1 }).chordIndex).toBeNull();
    expect(config(8, { chordsPerBar: 1 }).chordIndex).toBe(1);
  });

  test("dos acordes por compás", () => {
    expect(config(4, { chordsPerBar: 2 }).chordIndex).toBe(0);
    expect(config(6, { chordsPerBar: 2 }).chordIndex).toBe(1);
  });

  test("reinicia la progresión sin perder beats (wrap del loop)", () => {
    expect(config(20, { chordsPerBar: 1, chordCount: 4 }).chordIndex).toBe(0);
  });

  test("accented marca el primer beat de cada compás, tanto en count-in como en playback", () => {
    expect(config(0).accented).toBe(true);
    expect(config(1).accented).toBe(false);
    expect(config(4).accented).toBe(true);
    expect(config(5).accented).toBe(false);
  });

  test("respeta countInBars distinto de 1", () => {
    const twoBarCountIn = (beat) => progressionEventAtBeat({
      beat, chordCount: 4, chordsPerBar: 1, countInBars: 2
    });
    expect(twoBarCountIn(7).type).toBe("count-in"); // 2 compases de 4 = 8 beats de conteo
    expect(twoBarCountIn(8).type).toBe("playback");
  });
});

describe("collectScheduledBeats", () => {
  test("la ventana conserva el siguiente tiempo exacto", () => {
    const result = collectScheduledBeats({
      nextBeat: 0,
      nextBeatTime: 10,
      horizon: 11.1,
      beatDuration: 0.5
    });
    expect(result.beats.map(x => x.when)).toEqual([10, 10.5, 11]);
    expect(result.beats.map(x => x.beat)).toEqual([0, 1, 2]);
    expect(result.nextBeatTime).toBe(11.5);
    expect(result.nextBeat).toBe(3);
  });

  test("no agenda nada si el horizonte ya pasó (ventana vacía)", () => {
    const result = collectScheduledBeats({
      nextBeat: 5,
      nextBeatTime: 20,
      horizon: 19,
      beatDuration: 1
    });
    expect(result.beats).toEqual([]);
    expect(result.nextBeat).toBe(5);
    expect(result.nextBeatTime).toBe(20);
  });

  test("es acumulativo: llamar de nuevo con el resultado anterior continúa sin saltos ni repeticiones", () => {
    const first = collectScheduledBeats({ nextBeat: 0, nextBeatTime: 0, horizon: 2, beatDuration: 1 });
    const second = collectScheduledBeats({
      nextBeat: first.nextBeat,
      nextBeatTime: first.nextBeatTime,
      horizon: 4,
      beatDuration: 1
    });
    expect(first.beats.map(b => b.beat)).toEqual([0, 1]);
    expect(second.beats.map(b => b.beat)).toEqual([2, 3]);
  });
});
