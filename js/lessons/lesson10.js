import { ROOTS, CHORDS, VOICING_TYPES, SCALE_ROOT_IDS } from "../data.js";
import { rootById, buildChordTones, chordSymbol } from "../theory.js";
import { playChord } from "../audio.js";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js";
import { setLessonState, showMode } from "../nav.js";

// ========== Lesson 10: Advanced voicings ==========
const VOICING_QUALITY_IDS=["major","minor","dom7","maj7","min7"];
buildKeyboard("voicingKeyboard",null,{octaves:2});
const voicingRootSelect=document.getElementById("voicingRoot");
ROOTS.filter(r=>SCALE_ROOT_IDS.includes(r.id)).forEach(r=>voicingRootSelect.add(new Option(r.latin,r.id)));
voicingRootSelect.value="C";
const voicingQualitySelect=document.getElementById("voicingQuality");
VOICING_QUALITY_IDS.forEach(key=>voicingQualitySelect.add(new Option(CHORDS[key].label[0].toUpperCase()+CHORDS[key].label.slice(1),key)));
voicingQualitySelect.value="major";
const voicingTypeSelect=document.getElementById("voicingType");
Object.entries(VOICING_TYPES).forEach(([key,v])=>voicingTypeSelect.add(new Option(v.label,key)));
voicingTypeSelect.value="closed";
function renderVoicing(play=true){
  const root=rootById(voicingRootSelect.value),quality=voicingQualitySelect.value,voicingType=voicingTypeSelect.value;
  const tones=buildChordTones(root,quality,0,48,voicingType);
  const symbol=chordSymbol(root,quality);
  highlightChordOnKeyboard("voicingKeyboard",tones);
  if(play)playChord(tones.map(t=>t.midi));
  document.getElementById("voicingDescription").textContent=VOICING_TYPES[voicingType].description;
  document.getElementById("voicingNotes").innerHTML=tones.map((t,i)=>`<span class="note-chip role-${Math.min(t.role,3)}">${t.latin}<small>${t.degree}</small></span>${i<tones.length-1?'<span class="separator">+</span>':''}`).join("");
  document.getElementById("voicingInfo").innerHTML=`<div class="info-item"><span>Símbolo</span><strong>${symbol}</strong></div><div class="info-item"><span>Voicing</span><strong>${VOICING_TYPES[voicingType].label}</strong></div><div class="info-item"><span>Notas (grave a agudo)</span><strong>${tones.map(t=>t.latin).join(" – ")}</strong></div><div class="info-item"><span>Cantidad de notas</span><strong>${tones.length}</strong></div>`;
  return tones;
}
voicingRootSelect.addEventListener("change",()=>{setLessonState(10,"explored"); renderVoicing(false);});
voicingQualitySelect.addEventListener("change",()=>{setLessonState(10,"explored"); renderVoicing(false);});
voicingTypeSelect.addEventListener("change",()=>{setLessonState(10,"explored"); renderVoicing(false);});
document.getElementById("playVoicing").addEventListener("click",()=>{setLessonState(10,"explored"); renderVoicing(true);});
renderVoicing(false);
// Mission: hear Do mayor in all 4 voicing types to feel how the same notes can sound different
let voicingMissionHeard=new Set();
function playVoicingMission(voicingType){
  setLessonState(10,"explored");
  voicingRootSelect.value="C"; voicingQualitySelect.value="major"; voicingTypeSelect.value=voicingType;
  renderVoicing(true);
  voicingMissionHeard.add(voicingType);
  if(voicingMissionHeard.size===1)setLessonState(10,"practiced");
  document.getElementById("voicingMissionDots").textContent=["closed","open","drop2","shell"].map(k=>voicingMissionHeard.has(k)?"●":"○").join(" ");
  if(voicingMissionHeard.size===4){
    setLessonState(10,"mastered");
    document.getElementById("voicingMissionText").innerHTML="<strong>¡Dominado!</strong> Escuchaste el mismo Do mayor distribuido en cuatro voicings distintos.";
  }
}
document.getElementById("voicingMission1").addEventListener("click",()=>playVoicingMission("closed"));
document.getElementById("voicingMission2").addEventListener("click",()=>playVoicingMission("open"));
document.getElementById("voicingMission3").addEventListener("click",()=>playVoicingMission("drop2"));
document.getElementById("voicingMission4").addEventListener("click",()=>playVoicingMission("shell"));
document.getElementById("goToLabFinal").addEventListener("click",()=>showMode("lab"));
