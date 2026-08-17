import { ROOTS, CHORDS, VOICING_TYPES, SCALE_ROOT_IDS } from "../data.js?v=3";
import { rootById, buildChordTones, chordSymbol } from "../theory.js?v=4";
import { playChordSmart as playChord } from "../audioSampled.js?v=7";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js?v=6";
import { setLessonState, showMode } from "../nav.js?v=7";
import { renderMissionDots } from "../icons.js?v=3";
import { recordAttempt } from "../stats.js?v=1";

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
  renderMissionDots(document.getElementById("voicingMissionDots"),["closed","open","drop2","shell"].map(k=>voicingMissionHeard.has(k)));
  if(voicingMissionHeard.size===4){
    setLessonState(10,"mastered");
    document.getElementById("voicingMissionText").innerHTML="<strong>¡Dominado!</strong> Escuchaste el mismo Do mayor distribuido en cuatro voicings distintos.";
  }
}
document.getElementById("voicingMission1").addEventListener("click",()=>playVoicingMission("closed"));
document.getElementById("voicingMission2").addEventListener("click",()=>playVoicingMission("open"));
document.getElementById("voicingMission3").addEventListener("click",()=>playVoicingMission("drop2"));
document.getElementById("voicingMission4").addEventListener("click",()=>playVoicingMission("shell"));
document.getElementById("goToLabFinal").addEventListener("click",()=>showMode("lab",10));

// ========== Bonus: arpeggio patterns — same chord, spread across time instead of played together ==========
// Always closed position, independent of the voicing selector above, so patterns stay simple and comparable.
function arpeggioTones(){
  const root=rootById(voicingRootSelect.value),quality=voicingQualitySelect.value;
  return buildChordTones(root,quality,0,48,"closed");
}
const ARPEGGIO_PATTERNS={
  asc:{label:"Ascendente",desc:"Ascendente: de la nota más grave a la más aguda, en orden.",order:t=>t},
  desc:{label:"Descendente",desc:"Descendente: de la nota más aguda a la más grave, en orden.",order:t=>[...t].reverse()},
  ascdesc:{label:"Ascendente-descendente",desc:"Ascendente-descendente: sube hasta la nota más aguda y vuelve a bajar sin repetirla.",order:t=>[...t,...[...t].slice(0,-1).reverse()]},
  alberti:{label:"Quebrado (bajo Alberti)",desc:"Quebrado (bajo Alberti): grave-agudo-medio-agudo. Es el mismo patrón de acompañamiento de la Lección 9.",order:t=>{const lo=t[0],hi=t[t.length-1],mid=t.length>2?t[1]:t[0];return [lo,hi,mid,hi];}}
};
function playArpeggio(type){
  const tones=arpeggioTones(),order=ARPEGGIO_PATTERNS[type].order(tones);
  playChord(order.map(t=>t.midi),true);
  return tones;
}
[["arpeggioAsc","asc"],["arpeggioDesc","desc"],["arpeggioAscDesc","ascdesc"],["arpeggioAlberti","alberti"]].forEach(([id,type])=>{
  document.getElementById(id).addEventListener("click",()=>{
    setLessonState(10,"explored");
    playArpeggio(type);
    document.getElementById("arpeggioDescription").textContent=ARPEGGIO_PATTERNS[type].desc;
  });
});

// Mission: identify the arpeggio pattern by ear. Restricted to the three most distinguishable
// patterns — ascendente-descendente stays demo-only above since it's too easy to confuse by ear.
const ARPEGGIO_QUIZ_TYPES=["asc","desc","alberti"];
let arpeggioQuizType=null,arpeggioQuizTones=null,arpeggioQuizAnswered=false,arpeggioMissionCorrect=0;
function renderArpeggioOptions(){
  const c=document.getElementById("arpeggioOptions");c.innerHTML="";
  ARPEGGIO_QUIZ_TYPES.forEach(type=>{
    const b=document.createElement("button");b.className="btn secondary";b.textContent=ARPEGGIO_PATTERNS[type].label;
    b.addEventListener("click",()=>answerArpeggioQuiz(type));
    c.appendChild(b);
  });
}
function newArpeggioChallenge(){
  setLessonState(10,"explored");
  renderArpeggioOptions();
  arpeggioQuizType=ARPEGGIO_QUIZ_TYPES[Math.floor(Math.random()*ARPEGGIO_QUIZ_TYPES.length)];
  arpeggioQuizTones=arpeggioTones();
  arpeggioQuizAnswered=false;
  playChord(ARPEGGIO_PATTERNS[arpeggioQuizType].order(arpeggioQuizTones).map(t=>t.midi),true);
  document.getElementById("arpeggioFeedback").className="result-box";
  document.getElementById("arpeggioFeedback").textContent="Puedes repetir antes de responder.";
  document.getElementById("arpeggioRepeat").disabled=false;
}
function answerArpeggioQuiz(type){
  const box=document.getElementById("arpeggioFeedback");
  if(!arpeggioQuizType){box.className="result-box status-bad";box.textContent="Primero pulsa “Nuevo patrón”.";return;}
  if(arpeggioQuizAnswered)return;
  arpeggioQuizAnswered=true;
  const correct=type===arpeggioQuizType;
  recordAttempt("arpegio",correct,"audio");
  box.className=`result-box ${correct?"status-good":"status-bad"}`;
  box.innerHTML=correct?`<strong>¡Correcto!</strong> Era ${ARPEGGIO_PATTERNS[arpeggioQuizType].label.toLowerCase()}.`:`<strong>No esta vez.</strong> Era ${ARPEGGIO_PATTERNS[arpeggioQuizType].label.toLowerCase()}.`;
  if(correct){
    arpeggioMissionCorrect++;
    if(arpeggioMissionCorrect===1)setLessonState(10,"practiced");
    renderMissionDots(document.getElementById("arpeggioMissionDots"),[0,1,2].map(i=>i<Math.min(arpeggioMissionCorrect,3)));
    if(arpeggioMissionCorrect>=3){
      setLessonState(10,"mastered");
      document.getElementById("arpeggioMissionText").innerHTML="<strong>¡Dominado!</strong> Reconoces ascendente, descendente y quebrado al oído.";
    }
  }
}
document.getElementById("arpeggioNewChallenge").addEventListener("click",newArpeggioChallenge);
document.getElementById("arpeggioRepeat").addEventListener("click",()=>{if(arpeggioQuizType)playChord(ARPEGGIO_PATTERNS[arpeggioQuizType].order(arpeggioQuizTones).map(t=>t.midi),true);});
renderArpeggioOptions();
