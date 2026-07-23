import { PC_KEY_LABELS, INTERVAL_NAMES } from "../data.js?v=3";
import { octaveOf } from "../theory.js?v=3";
import { playMidi, playChord } from "../audio.js?v=3";
import { buildKeyboard, clearKeyboard, getKeyboard } from "../keyboard.js?v=3";
import { setLessonState } from "../nav.js?v=3";

// ========== Lesson 2: Intervals (semitones and tones) ==========
let intervalSelection=[], intervalMissionStage=-1;
const intervalChallenges=[
  {text:"Toca Mi y luego Fa: un semitono ascendente.",test:(a,b)=>a%12===4&&b-a===1},
  {text:"Toca Sol y luego La: un tono ascendente.",test:(a,b)=>a%12===7&&b-a===2},
  {text:"Toca Do y luego el Si inmediatamente inferior: un semitono descendente.",test:(a,b)=>a%12===0&&b-a===-1}
];
function buildIntervalMeter(distance=null){ const meter=document.getElementById("intervalMeter"); meter.innerHTML=""; for(let i=0;i<=12;i++){const c=document.createElement("div"); c.className=`interval-cell ${distance!==null&&i<=distance?"active":""}`; c.textContent=i; meter.appendChild(c);} }
function clearIntervalSelection(){ intervalSelection=[]; clearKeyboard("intervalKeyboard"); document.getElementById("playIntervalMelodic").disabled=true; document.getElementById("playIntervalHarmonic").disabled=true; buildIntervalMeter(); }
function updateIntervalMission(){ document.getElementById("intervalMissionDots").textContent=[0,1,2].map(i=>i<Math.max(intervalMissionStage,0)?"●":"○").join(" "); if(intervalMissionStage>=0&&intervalMissionStage<3)document.getElementById("intervalMissionText").textContent=`${intervalMissionStage+1} de 3 · ${intervalChallenges[intervalMissionStage].text}`; }
function evaluateIntervalMission(a,b){ if(intervalMissionStage<0||intervalMissionStage>=3)return; const box=document.getElementById("intervalResult"); if(intervalChallenges[intervalMissionStage].test(a,b)){ intervalMissionStage++; if(intervalMissionStage===1)setLessonState(2,"practiced"); if(intervalMissionStage>=3){setLessonState(2,"mastered"); box.className="result-box status-good"; box.innerHTML="<strong>¡Dominado!</strong> Construiste un semitono ascendente, un tono y un semitono descendente.";} else {box.className="result-box status-good"; box.innerHTML=`<strong>Correcto.</strong> Ahora: ${intervalChallenges[intervalMissionStage].text}`;} updateIntervalMission(); setTimeout(clearIntervalSelection,500); } else {box.className="result-box status-bad"; box.innerHTML=`<strong>Casi.</strong> ${intervalChallenges[intervalMissionStage].text} Cuenta cada paso hacia la tecla vecina.`; setTimeout(clearIntervalSelection,850);} }
buildIntervalMeter();
buildKeyboard("intervalKeyboard",midi=>{
  setLessonState(2,"explored"); if(intervalSelection.length===2)clearIntervalSelection(); intervalSelection.push(midi); const kb=getKeyboard("intervalKeyboard"),key=kb.keyMap.get(midi);
  if(intervalSelection.length===1){key?.classList.add("interval-start"); document.getElementById("intervalResult").innerHTML=`<strong>Inicio: ${PC_KEY_LABELS[midi%12]}${octaveOf(midi)}.</strong> Toca la segunda nota.`;}
  else {const [a,b]=intervalSelection; kb.keyMap.get(a)?.classList.add("interval-start"); key?.classList.add("interval-end"); const distance=Math.abs(b-a),name=distance<=12?INTERVAL_NAMES[distance]:`${distance} semitonos`; document.getElementById("intervalResult").innerHTML=`<strong>${distance} semitono${distance===1?"":"s"}: ${name}.</strong><br>${PC_KEY_LABELS[a%12]}${octaveOf(a)} → ${PC_KEY_LABELS[b%12]}${octaveOf(b)}.`; buildIntervalMeter(Math.min(distance,12)); document.getElementById("playIntervalMelodic").disabled=false; document.getElementById("playIntervalHarmonic").disabled=false; evaluateIntervalMission(a,b);}
});
document.getElementById("startIntervalMission").addEventListener("click",()=>{intervalMissionStage=0; clearIntervalSelection(); updateIntervalMission(); document.getElementById("intervalResult").className="result-box"; document.getElementById("intervalResult").textContent=intervalChallenges[0].text;});
document.getElementById("resetInterval").addEventListener("click",()=>{clearIntervalSelection(); document.getElementById("intervalResult").className="result-box"; document.getElementById("intervalResult").textContent="Selecciona una primera nota para explorar.";});
document.getElementById("playIntervalMelodic").addEventListener("click",()=>intervalSelection.forEach((m,i)=>playMidi(m,.7,i*.55)));
document.getElementById("playIntervalHarmonic").addEventListener("click",()=>playChord(intervalSelection));
