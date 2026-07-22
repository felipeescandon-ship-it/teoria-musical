import { ROOTS, PROGRESSIONS, DIATONIC_ROMANS, SCALE_ROOT_IDS } from "../data.js";
import { rootById, buildDiatonicChords, buildChordTones } from "../theory.js";
import { getAudioContext, playMidiAt, playChordAt } from "../audio.js";
import { createTransport } from "../transport.js";
import { progressionEventAtBeat } from "../timing.js";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js";
import { setLessonState, onNavigate } from "../nav.js";

// ========== Lesson 9: Progressions and accompaniment (Epic B2) + tempo/loop (Epic C1) ==========
// Both "play once" and "loop with a pulse" run through the SAME transport — they differ only in
// parameters (count-in bars, metronome on/off, whether it repeats), never in timing mechanism.
const BEATS_PER_BAR = 4;      // everything here assumes 4/4 — stated explicitly, not hidden in divisions
const LOOP_COUNT_IN_BARS = 1; // one free bar of clicks so the student can prepare before playing along

buildKeyboard("progressionKeyboard",null,{octaves:2});
const progressionKeySelect=document.getElementById("progressionKey");
ROOTS.filter(r=>SCALE_ROOT_IDS.includes(r.id)).forEach(r=>progressionKeySelect.add(new Option(`${r.latin} mayor`,r.id)));
progressionKeySelect.value="C";
const progressionTypeSelect=document.getElementById("progressionType");
Object.keys(PROGRESSIONS).forEach(key=>progressionTypeSelect.add(new Option(key,key)));
const patternSelect=document.getElementById("progressionPattern");
const tempoInput=document.getElementById("progressionTempo");
const tempoValue=document.getElementById("progressionTempoValue");
const densitySelect=document.getElementById("progressionDensity");
const loopButton=document.getElementById("loopProgression");
const stopButton=document.getElementById("stopProgression");

// Resolve a roman numeral to its diatonic chord for a given key
function getProgressionChords(rootId,progressionKey){
  const root=rootById(rootId), diatonic=buildDiatonicChords(root);
  return PROGRESSIONS[progressionKey].map(roman=>diatonic[DIATONIC_ROMANS.indexOf(roman)]);
}

// ---- Session state, re-read by the transport callback on every beat, so changing the key,
// progression, pattern or density mid-loop takes effect at the next chord instead of forcing a restart.
let sessionChords=[], sessionPattern="bass", sessionChordsPerBar=1;
let sessionCountInBars=0, sessionLooping=false, sessionMetronome=false;
const visualTimeouts=new Set();

// Visual highlighting is the ONLY thing setTimeout may drive here: if the tab stalls and a
// highlight lands late, the sound is still exactly on time because it was scheduled on the audio clock.
function highlightAtAudioTime(when,tones){
  const delayMs=Math.max(0,(when-getAudioContext().currentTime)*1000);
  const id=window.setTimeout(()=>{visualTimeouts.delete(id);highlightChordOnKeyboard("progressionKeyboard",tones);},delayMs);
  visualTimeouts.add(id);
}
// Short, quiet metronome blip; the downbeat is higher and louder so the bar is audible, not just the pulse.
function scheduleClick(when,accented,registerVoices){
  registerVoices(playMidiAt(accented?84:79,when,.045,accented?.08:.045,accented?.9:.55));
}
// Schedule one chord (right-hand triad + left-hand pattern) at an absolute audio time. Note length
// derives from the musical slot, so it stays right at 40 BPM (6-second bars) and at 120 BPM alike —
// the old fixed .95s only happened to fit the previously hard-coded 1300ms step.
function scheduleAccompaniedChord(chord,pattern,when,slotDuration,registerVoices){
  const rightHand=buildChordTones(chord.root,chord.quality);
  const leftHand=buildChordTones(chord.root,chord.quality,0,36); // Octave 1 lower, for left hand register
  const noteDuration=Math.max(.08,slotDuration-.06); // release just before the next chord, never overlapping
  registerVoices(playChordAt(rightHand.map(t=>t.midi),when,noteDuration,.09));
  if(pattern==="bass"){
    registerVoices(playMidiAt(leftHand[0].midi,when,noteDuration,.1));
  } else if(pattern==="block"){
    registerVoices(playChordAt(leftHand.map(t=>t.midi),when,noteDuration,.075));
  } else if(pattern==="alberti"){
    const order=[leftHand[0],leftHand[2]||leftHand[1],leftHand[1],leftHand[2]||leftHand[1]];
    const sub=slotDuration/order.length; // Alberti fills the whole slot at any tempo
    order.forEach((t,j)=>registerVoices(playMidiAt(t.midi,when+j*sub,sub*.82,.1)));
  }
  highlightAtAudioTime(when,rightHand);
}

const transport=createTransport({
  onScheduleBeat({beat,when,secondsPerBeat,registerVoices}){
    const beatsPerChord=BEATS_PER_BAR/sessionChordsPerBar;
    const event=progressionEventAtBeat({
      beat, chordCount:sessionChords.length, chordsPerBar:sessionChordsPerBar,
      beatsPerBar:BEATS_PER_BAR, countInBars:sessionCountInBars
    });
    if(event.type==="count-in"){ scheduleClick(when,event.accented,registerVoices); return; }
    // A single pass ends once every chord has had its slot. Stop WITHOUT cancelling, so the final
    // chord rings out to its own release instead of being chopped off mid-note.
    if(!sessionLooping && event.musicalBeat>=sessionChords.length*beatsPerChord){
      transport.stop({cancel:false}); updatePlaybackButtons(); return;
    }
    if(sessionMetronome) scheduleClick(when,event.accented,registerVoices);
    if(event.chordIndex!==null){
      scheduleAccompaniedChord(sessionChords[event.chordIndex],sessionPattern,when,beatsPerChord*secondsPerBeat,registerVoices);
    }
  }
});

function updatePlaybackButtons(){
  stopButton.disabled=!transport.running;
  loopButton.textContent=transport.running?"▶ Bucle sonando…":"▶ Bucle con pulso";
}
export function stopProgressionPlayback(){
  transport.stop(); // cancel:true — kills notes already scheduled ahead but not yet audible
  visualTimeouts.forEach(id=>clearTimeout(id)); visualTimeouts.clear();
  updatePlaybackButtons();
}
// Otherwise a loop keeps sounding forever after leaving the lesson, switching modes, or
// backgrounding the tab — none of those are a "Detener" click, so nothing else would stop it.
onNavigate(stopProgressionPlayback);
document.addEventListener("visibilitychange",()=>{ if(document.hidden) stopProgressionPlayback(); });
// Refresh the labels and the chord list the transport reads; never plays on its own.
function renderProgression(){
  const rootId=progressionKeySelect.value, progressionKey=progressionTypeSelect.value;
  const chords=getProgressionChords(rootId,progressionKey);
  document.getElementById("progressionRoman").innerHTML=chords.map(c=>`<span class="pill">${c.roman} · ${c.name}</span>`).join("");
  document.getElementById("progressionResult").innerHTML=`<strong>${progressionKey}</strong> en ${rootById(rootId).latin} mayor. Patrón de acompañamiento: ${patternSelect.selectedOptions[0].textContent}.`;
  return chords;
}
function refreshSession(){
  sessionChords=renderProgression();
  sessionPattern=patternSelect.value;
  sessionChordsPerBar=Number(densitySelect.value);
}
async function startPlayback({looping,countInBars,metronome}){
  stopProgressionPlayback(); // never layer a new session on top of a sounding one
  refreshSession();
  sessionLooping=looping; sessionCountInBars=countInBars; sessionMetronome=metronome;
  await transport.start({tempo:Number(tempoInput.value)});
  updatePlaybackButtons();
}

[progressionKeySelect,progressionTypeSelect,patternSelect,densitySelect].forEach(el=>
  el.addEventListener("change",()=>{setLessonState(9,"explored"); refreshSession();}));
tempoInput.addEventListener("input",()=>{
  tempoValue.textContent=tempoInput.value;
  transport.setTempo(Number(tempoInput.value)); // applies from the next scheduler tick, no restart needed
});
document.getElementById("playProgression").addEventListener("click",()=>{
  setLessonState(9,"explored");
  startPlayback({looping:false,countInBars:0,metronome:false}); // one pass, as before: no count-in, no click
});
loopButton.addEventListener("click",()=>{
  setLessonState(9,"practiced"); // playing along to a pulse is practice, not just listening
  startPlayback({looping:true,countInBars:LOOP_COUNT_IN_BARS,metronome:true});
});
stopButton.addEventListener("click",stopProgressionPlayback);
renderProgression();

// Mission: listen to three contrasting progressions to feel the difference in harmonic movement
let progressionMissionHeard=new Set();
function playProgressionMission(progressionKey){
  setLessonState(9,"explored");
  progressionTypeSelect.value=progressionKey;
  startPlayback({looping:false,countInBars:0,metronome:false});
  progressionMissionHeard.add(progressionKey);
  if(progressionMissionHeard.size===1)setLessonState(9,"practiced");
  document.getElementById("progressionMissionDots").textContent=["I-IV-V-I","I-V-vi-IV","ii-V-I"].map(k=>progressionMissionHeard.has(k)?"●":"○").join(" ");
  if(progressionMissionHeard.size===3){
    setLessonState(9,"mastered");
    document.getElementById("progressionMissionText").innerHTML="<strong>¡Dominado!</strong> Escuchaste tres progresiones distintas construidas con los mismos acordes diatónicos.";
  }
}
document.getElementById("progressionMission1").addEventListener("click",()=>playProgressionMission("I-IV-V-I"));
document.getElementById("progressionMission2").addEventListener("click",()=>playProgressionMission("I-V-vi-IV"));
document.getElementById("progressionMission3").addEventListener("click",()=>playProgressionMission("ii-V-I"));
