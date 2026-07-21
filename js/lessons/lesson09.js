import { ROOTS, PROGRESSIONS, DIATONIC_ROMANS, SCALE_ROOT_IDS } from "../data.js";
import { rootById, buildDiatonicChords, buildChordTones } from "../theory.js";
import { playMidi, playChord } from "../audio.js";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js";
import { setLessonState } from "../nav.js";

// ========== Lesson 9: Progressions and basic accompaniment (Epic B2) ==========
buildKeyboard("progressionKeyboard",null,{octaves:2});
const progressionKeySelect=document.getElementById("progressionKey");
ROOTS.filter(r=>SCALE_ROOT_IDS.includes(r.id)).forEach(r=>progressionKeySelect.add(new Option(`${r.latin} mayor`,r.id)));
progressionKeySelect.value="C";
const progressionTypeSelect=document.getElementById("progressionType");
Object.keys(PROGRESSIONS).forEach(key=>progressionTypeSelect.add(new Option(key,key)));
// Resolve a roman numeral to its diatonic chord for a given key
function getProgressionChords(rootId,progressionKey){
  const root=rootById(rootId), diatonic=buildDiatonicChords(root);
  return PROGRESSIONS[progressionKey].map(roman=>diatonic[DIATONIC_ROMANS.indexOf(roman)]);
}
// Play one chord's right-hand triad plus a left-hand accompaniment pattern (bass note, block triad, or Alberti-style broken chord)
function playAccompaniedChord(chord,pattern,delay,stepMs){
  const rightHand=buildChordTones(chord.root,chord.quality);
  const leftHand=buildChordTones(chord.root,chord.quality,0,36); // Octave 1 lower, for left hand register
  setTimeout(()=>{
    highlightChordOnKeyboard("progressionKeyboard",rightHand);
    playChord(rightHand.map(t=>t.midi));
    if(pattern==="bass"){
      playMidi(leftHand[0].midi,stepMs/1000*.9,0,.1);
    } else if(pattern==="block"){
      playChord(leftHand.map(t=>t.midi),false,0);
    } else if(pattern==="alberti"){
      const order=[leftHand[0],leftHand[2]||leftHand[1],leftHand[1],leftHand[2]||leftHand[1]];
      const beat=stepMs/1000/4;
      order.forEach((t,j)=>playMidi(t.midi,beat*.9,j*beat,.1));
    }
  },delay);
}
function renderProgression(play=true){
  const rootId=progressionKeySelect.value, progressionKey=progressionTypeSelect.value, pattern=document.getElementById("progressionPattern").value;
  const chords=getProgressionChords(rootId,progressionKey);
  document.getElementById("progressionRoman").innerHTML=chords.map(c=>`<span class="pill">${c.roman} · ${c.name}</span>`).join("");
  document.getElementById("progressionResult").innerHTML=`<strong>${progressionKey}</strong> en ${rootById(rootId).latin} mayor. Patrón de acompañamiento: ${document.getElementById("progressionPattern").selectedOptions[0].textContent}.`;
  if(play){ const stepMs=1300; chords.forEach((chord,i)=>playAccompaniedChord(chord,pattern,i*stepMs,stepMs)); }
  return chords;
}
progressionKeySelect.addEventListener("change",()=>{setLessonState(9,"explored"); renderProgression(false);});
progressionTypeSelect.addEventListener("change",()=>{setLessonState(9,"explored"); renderProgression(false);});
document.getElementById("progressionPattern").addEventListener("change",()=>{setLessonState(9,"explored"); renderProgression(false);});
document.getElementById("playProgression").addEventListener("click",()=>{setLessonState(9,"explored"); renderProgression(true);});
renderProgression(false);
// Mission: listen to three contrasting progressions to feel the difference in harmonic movement
let progressionMissionHeard=new Set();
function playProgressionMission(progressionKey){
  setLessonState(9,"explored");
  progressionTypeSelect.value=progressionKey;
  renderProgression(true);
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
