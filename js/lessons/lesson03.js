import { PC_KEY_LABELS } from "../data.js?v=3";
import { rootById, rootC, buildChordTones } from "../theory.js?v=3";
import { playChord } from "../audio.js?v=3";
import { buildKeyboard, clearKeyboard, highlightChordOnKeyboard, togglePcSelection } from "../keyboard.js?v=3";
import { setLessonState } from "../nav.js?v=3";

// ========== Lesson 3: Major and minor triads (0–4–7 vs 0–3–7) ==========
let mmSelected=new Set(), mmStage=0;
const mmTargets=[new Set([0,4,7]),new Set([0,3,7])];
function demoChord(id,root,quality,inversion=0,arpeggio=false){ const tones=buildChordTones(root,quality,inversion); highlightChordOnKeyboard(id,tones); playChord(tones.map(t=>t.midi),arpeggio); return tones; }
function updateMMSelection(){ document.getElementById("majorMinorResult").className="result-box"; document.getElementById("majorMinorResult").innerHTML=mmSelected.size?`<strong>Seleccionaste:</strong> ${[...mmSelected].sort((a,b)=>a-b).map(pc=>PC_KEY_LABELS[pc]).join(" · ")}`:"Selecciona las notas del acorde. La octava no importa."; }
function clearMM(){mmSelected.clear(); clearKeyboard("majorMinorKeyboard"); updateMMSelection();}
function renderMMMission(){document.getElementById("majorMinorMissionText").textContent=mmStage===0?"Paso 1 de 2 · Selecciona Do, Mi y Sol para construir Do mayor.":mmStage===1?"Paso 2 de 2 · Baja solo la tercera: construye Do menor con Do, Mi♭ y Sol.":"Misión completada."; document.getElementById("majorMinorDots").textContent=[0,1].map(i=>i<mmStage?"●":"○").join(" ");}
buildKeyboard("majorMinorKeyboard",(midi,pc)=>{setLessonState(3,"explored"); togglePcSelection("majorMinorKeyboard",mmSelected,pc); updateMMSelection();});
document.getElementById("checkMajorMinor").addEventListener("click",()=>{const target=mmTargets[Math.min(mmStage,1)],correct=mmSelected.size===target.size&&[...target].every(pc=>mmSelected.has(pc)); const box=document.getElementById("majorMinorResult"); if(correct){mmStage++; if(mmStage===1)setLessonState(3,"practiced"); box.className="result-box status-good"; if(mmStage>=2){setLessonState(3,"mastered"); box.innerHTML="<strong>¡Dominado!</strong> Cambiaste únicamente Mi por Mi♭ y transformaste mayor en menor.";} else box.innerHTML="<strong>Do mayor correcto.</strong> Ahora baja solamente la tercera un semitono."; clearMM(); renderMMMission();} else {box.className="result-box status-bad"; const rootOk=mmSelected.has(0),fifthOk=mmSelected.has(7); box.innerHTML=`<strong>Aún no.</strong> ${!rootOk?"Falta la raíz Do. ":""}${!fifthOk?"Falta la quinta Sol. ":""}Revisa la tercera del paso actual.`;}});
document.getElementById("clearMajorMinor").addEventListener("click",clearMM);
document.getElementById("playCMajor").addEventListener("click",()=>{setLessonState(3,"explored"); demoChord("majorMinorKeyboard",rootC,"major"); document.getElementById("majorMinorResult").innerHTML="<strong>Do mayor:</strong> 0–4–7 semitonos.";});
document.getElementById("playCMinor").addEventListener("click",()=>{setLessonState(3,"explored"); demoChord("majorMinorKeyboard",rootC,"minor"); document.getElementById("majorMinorResult").innerHTML="<strong>Do menor:</strong> 0–3–7 semitonos.";});
document.getElementById("compareMajorMinor").addEventListener("click",()=>{const a=buildChordTones(rootC,"major"),b=buildChordTones(rootC,"minor"); highlightChordOnKeyboard("majorMinorKeyboard",a); playChord(a.map(t=>t.midi)); setTimeout(()=>{highlightChordOnKeyboard("majorMinorKeyboard",b);playChord(b.map(t=>t.midi));},1100);});
document.getElementById("playFMajor").addEventListener("click",()=>{setLessonState(3,"explored"); demoChord("majorMinorKeyboard",rootById("F"),"major"); document.getElementById("majorMinorResult").innerHTML="<strong>Fa mayor:</strong> 0–4–7 semitonos. El patrón es idéntico al de Do mayor.";});
document.getElementById("playFMinor").addEventListener("click",()=>{setLessonState(3,"explored"); demoChord("majorMinorKeyboard",rootById("F"),"minor"); document.getElementById("majorMinorResult").innerHTML="<strong>Fa menor:</strong> 0–3–7 semitonos. El patrón es idéntico al de Do menor.";});
renderMMMission(); updateMMSelection();
