import { PC_KEY_LABELS, ROOTS, MAJOR_SCALE_INTERVALS, SCALE_ROOT_IDS } from "../data.js?v=3";
import { rootById, buildScaleTones } from "../theory.js?v=3";
import { playMidi } from "../audio.js?v=3";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js?v=3";
import { setLessonState } from "../nav.js?v=3";

// ========== Lesson 7: Major scale builder ==========
const scaleRootSelect=document.getElementById("scaleRoot");
// Keyboard is touch-playable: pressing any key plays its note and shows whether it belongs to the current scale
buildKeyboard("scaleKeyboard",(midi,pc)=>{
  setLessonState(7,"explored");
  const root=rootById(scaleRootSelect.value);
  const scalePcs=new Set(buildScaleTones(root).map(t=>t.pc));
  const box=document.getElementById("scaleResult");
  if(scalePcs.has(pc)){ box.className="result-box status-good"; box.innerHTML=`<strong>${PC_KEY_LABELS[pc]}</strong> pertenece a la escala de ${root.latin} mayor.`; }
  else { box.className="result-box"; box.innerHTML=`<strong>${PC_KEY_LABELS[pc]}</strong> no pertenece a la escala de ${root.latin} mayor.`; }
},{octaves:2});
ROOTS.filter(r=>SCALE_ROOT_IDS.includes(r.id)).forEach(r=>scaleRootSelect.add(new Option(`${r.latin} mayor`,r.id)));
scaleRootSelect.value="C";
function renderScale(playDirection=null){
  const root=rootById(scaleRootSelect.value);
  const tones=buildScaleTones(root);
  highlightChordOnKeyboard("scaleKeyboard",tones);
  document.getElementById("scaleNotes").innerHTML=tones.map((t,i)=>`<span class="note-chip role-${t.role}">${t.latin}<small>${t.degree}</small></span>${i<tones.length-1?'<span class="separator">–</span>':''}`).join("");
  document.getElementById("scaleResult").innerHTML=`<strong>${root.latin} mayor:</strong> ${tones.map(t=>t.latin).join(" – ")}. Semitonos desde la raíz: ${MAJOR_SCALE_INTERVALS.join("–")}.`;
  if(playDirection==="asc") tones.forEach((t,i)=>playMidi(t.midi,.55,i*.32));
  else if(playDirection==="desc") [...tones].reverse().forEach((t,i)=>playMidi(t.midi,.55,i*.32));
  return tones;
}
scaleRootSelect.addEventListener("change",()=>{setLessonState(7,"explored"); renderScale();});
document.getElementById("playScale").addEventListener("click",()=>{setLessonState(7,"explored"); renderScale("asc");});
document.getElementById("playScaleDescending").addEventListener("click",()=>{setLessonState(7,"explored"); renderScale("desc");});
// Mission: listen to the same pattern applied to three different roots
let scaleMissionHeard=new Set();
function playScaleMission(rootId){
  setLessonState(7,"explored");
  scaleRootSelect.value=rootId;
  renderScale("asc");
  scaleMissionHeard.add(rootId);
  if(scaleMissionHeard.size===1)setLessonState(7,"practiced");
  document.getElementById("scaleMissionDots").textContent=["C","G","F"].map(id=>scaleMissionHeard.has(id)?"●":"○").join(" ");
  if(scaleMissionHeard.size===3){
    setLessonState(7,"mastered");
    document.getElementById("scaleMissionText").innerHTML="<strong>¡Dominado!</strong> Escuchaste el mismo patrón T–T–S–T–T–T–S en tres raíces distintas.";
  }
}
document.getElementById("scaleMissionC").addEventListener("click",()=>playScaleMission("C"));
document.getElementById("scaleMissionG").addEventListener("click",()=>playScaleMission("G"));
document.getElementById("scaleMissionF").addEventListener("click",()=>playScaleMission("F"));
renderScale();
