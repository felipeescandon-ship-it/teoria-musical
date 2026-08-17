import { ROOTS, PROGRESSIONS, DIATONIC_ROMANS, SCALE_ROOT_IDS } from "../data.js?v=3";
import { rootById, buildDiatonicChords, buildChordTones, chordSymbol, inversionName, bestInversion, voiceLeadingDistance } from "../theory.js?v=4";
import { getAudioContext } from "../audio.js?v=5";
import { playMidiAtSmart as playMidiAt, playChordAtSmart as playChordAt, playChordSmart as playChordNow } from "../audioSampled.js?v=7";
import { createTransport } from "../transport.js?v=5";
import { progressionEventAtBeat } from "../timing.js?v=3";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js?v=6";
import { setLessonState, onNavigate } from "../nav.js?v=7";
import { ICON_PLAY, ICON_STOP, renderMissionDots } from "../icons.js?v=3";
import { recordAttempt } from "../stats.js?v=1";

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
  loopButton.innerHTML=`${ICON_PLAY}${transport.running?"Bucle sonando…":"Bucle con pulso"}`;
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
  renderMissionDots(document.getElementById("progressionMissionDots"),["I-IV-V-I","I-V-vi-IV","ii-V-I"].map(k=>progressionMissionHeard.has(k)));
  if(progressionMissionHeard.size===3){
    setLessonState(9,"mastered");
    document.getElementById("progressionMissionText").innerHTML="<strong>¡Dominado!</strong> Escuchaste tres progresiones distintas construidas con los mismos acordes diatónicos.";
  }
}
document.getElementById("progressionMission1").addEventListener("click",()=>playProgressionMission("I-IV-V-I"));
document.getElementById("progressionMission2").addEventListener("click",()=>playProgressionMission("I-V-vi-IV"));
document.getElementById("progressionMission3").addEventListener("click",()=>playProgressionMission("ii-V-I"));

// ========== Bonus (Epic B3): connect the progression with inversions instead of root position ==========
// Chains bestInversion() forward — each chord picks whichever inversion moves the least from the
// tones actually chosen for the PREVIOUS chord, not from its own root position — so the comparison
// against "always root position" reflects a real cumulative effect across the whole progression.
function computeInversionComparison(){
  const chords=getProgressionChords(progressionKeySelect.value,progressionTypeSelect.value);
  const rootVersion=chords.map(c=>({chord:c,inversion:0,tones:buildChordTones(c.root,c.quality,0,48)}));
  const connectedVersion=[];
  chords.forEach((c,i)=>{
    if(i===0){ connectedVersion.push({chord:c,inversion:0,tones:buildChordTones(c.root,c.quality,0,48)}); return; }
    const best=bestInversion(connectedVersion[i-1].tones,c.root,c.quality,48);
    connectedVersion.push({chord:c,inversion:best.inversion,tones:best.tones});
  });
  const totalMovement=version=>version.slice(1).reduce((sum,step,i)=>sum+voiceLeadingDistance(version[i].tones,step.tones),0);
  return {rootVersion,connectedVersion,rootMovement:totalMovement(rootVersion),connectedMovement:totalMovement(connectedVersion)};
}
function renderChordChips(version){
  return version.map(({chord,inversion,tones})=>{
    const bass=tones[0], symbol=chordSymbol(chord.root,chord.quality,bass.american);
    return `<span class="pill">${chord.roman} · ${symbol} <small>(${inversionName(inversion,tones.length)})</small></span>`;
  }).join("");
}
function playChordSequence(version){ version.forEach((step,i)=>setTimeout(()=>playChordNow(step.tones.map(t=>t.midi)),i*900)); }
let lastComparison=null;
document.getElementById("compareInversions").addEventListener("click",()=>{
  setLessonState(9,"explored");
  lastComparison=computeInversionComparison();
  document.getElementById("rootPositionChords").innerHTML=renderChordChips(lastComparison.rootVersion);
  document.getElementById("connectedChords").innerHTML=renderChordChips(lastComparison.connectedVersion);
  document.getElementById("rootPositionMovement").textContent=`${lastComparison.rootMovement} semitonos`;
  document.getElementById("connectedMovement").textContent=`${lastComparison.connectedMovement} semitonos`;
  document.getElementById("playRootPositions").disabled=false;
  document.getElementById("playConnected").disabled=false;
});
document.getElementById("playRootPositions").addEventListener("click",()=>lastComparison&&playChordSequence(lastComparison.rootVersion));
document.getElementById("playConnected").addEventListener("click",()=>lastComparison&&playChordSequence(lastComparison.connectedVersion));

// Mission: given the chord that's actually sounding and the next chord in the progression, choose
// which inversion of the next chord connects with the least voice movement.
let voiceLeadingQuiz=null, voiceLeadingAnswered=false, voiceLeadingMissionCorrect=0;
function renderVoiceLeadingOptions(){
  const c=document.getElementById("voiceLeadingOptions"); c.innerHTML="";
  [0,1,2].forEach(inv=>{
    const b=document.createElement("button"); b.className="btn secondary"; b.textContent=inversionName(inv,3);
    b.addEventListener("click",()=>answerVoiceLeadingQuiz(inv));
    c.appendChild(b);
  });
}
function newVoiceLeadingChallenge(){
  setLessonState(9,"explored");
  renderVoiceLeadingOptions();
  const chords=getProgressionChords(progressionKeySelect.value,progressionTypeSelect.value);
  const idx=1+Math.floor(Math.random()*(chords.length-1));
  const prevChord=chords[idx-1], nextChord=chords[idx];
  const prevTones=buildChordTones(prevChord.root,prevChord.quality,0,48);
  const best=bestInversion(prevTones,nextChord.root,nextChord.quality,48);
  voiceLeadingQuiz={prevChord,nextChord,prevTones,correctInversion:best.inversion};
  voiceLeadingAnswered=false;
  playChordNow(prevTones.map(t=>t.midi));
  const box=document.getElementById("voiceLeadingFeedback");
  box.className="result-box";
  box.innerHTML=`Anterior: <strong>${prevChord.roman} (${prevChord.name})</strong>. Siguiente: <strong>${nextChord.roman} (${nextChord.name})</strong>. ¿Qué inversión conecta con menos movimiento?`;
  document.getElementById("voiceLeadingRepeat").disabled=false;
}
function answerVoiceLeadingQuiz(inv){
  const box=document.getElementById("voiceLeadingFeedback");
  if(!voiceLeadingQuiz){box.className="result-box status-bad";box.textContent="Primero pulsa \"Nuevo desafío\".";return;}
  if(voiceLeadingAnswered)return;
  voiceLeadingAnswered=true;
  const correct=inv===voiceLeadingQuiz.correctInversion;
  recordAttempt("inversiones",correct,"visual");
  const chosenTones=buildChordTones(voiceLeadingQuiz.nextChord.root,voiceLeadingQuiz.nextChord.quality,inv,48);
  playChordNow(chosenTones.map(t=>t.midi));
  box.className=`result-box ${correct?"status-good":"status-bad"}`;
  box.innerHTML=correct?`<strong>¡Correcto!</strong> ${inversionName(voiceLeadingQuiz.correctInversion,3)} es la que menos mueve las voces.`:`<strong>No esta vez.</strong> La mejor opción era ${inversionName(voiceLeadingQuiz.correctInversion,3)}.`;
  if(correct){
    voiceLeadingMissionCorrect++;
    if(voiceLeadingMissionCorrect===1)setLessonState(9,"practiced");
    renderMissionDots(document.getElementById("voiceLeadingMissionDots"),[0,1,2].map(i=>i<Math.min(voiceLeadingMissionCorrect,3)));
    if(voiceLeadingMissionCorrect>=3){
      setLessonState(9,"mastered");
      document.getElementById("voiceLeadingMissionText").innerHTML="<strong>¡Dominado!</strong> Eliges la inversión que conecta cada acorde con el menor movimiento.";
    }
  }
}
document.getElementById("voiceLeadingNewChallenge").addEventListener("click",newVoiceLeadingChallenge);
document.getElementById("voiceLeadingRepeat").addEventListener("click",()=>voiceLeadingQuiz&&playChordNow(voiceLeadingQuiz.prevTones.map(t=>t.midi)));
renderVoiceLeadingOptions();
