import { PC_KEY_LABELS } from "../data.js";
import { octaveOf, rootById, buildChordTones } from "../theory.js";
import { playChord } from "../audio.js";
import { buildKeyboard, clearKeyboard } from "../keyboard.js";
import { setLessonState } from "../nav.js";

// ========== Lesson 4: Accidentals (sharps and flats) ==========
let accidentalSelection=[], accidentalStage=-1;
const accidentalChallenges=[
  {text:"Toca Do y luego Do♯: sube un semitono.",length:2,test:a=>a[0]%12===0&&a[1]-a[0]===1},
  {text:"Toca Mi y luego Mi♭: baja un semitono.",length:2,test:a=>a[0]%12===4&&a[1]-a[0]===-1},
  {text:"Toca una sola vez la tecla que puede llamarse Do♯ o Re♭.",length:1,test:a=>a[0]%12===1}
];
function updateAccidentalMission(){document.getElementById("accidentalDots").textContent=[0,1,2].map(i=>i<Math.max(accidentalStage,0)?"●":"○").join(" "); if(accidentalStage>=0&&accidentalStage<3)document.getElementById("accidentalMissionText").textContent=`${accidentalStage+1} de 3 · ${accidentalChallenges[accidentalStage].text}`;}
function clearAccidental(){accidentalSelection=[]; clearKeyboard("accidentalKeyboard");}
buildKeyboard("accidentalKeyboard",midi=>{
  setLessonState(4,"explored"); accidentalSelection.push(midi); const box=document.getElementById("accidentalResult");
  if(accidentalStage<0){box.className="result-box"; box.innerHTML=`Tocaste <strong>${PC_KEY_LABELS[midi%12]}${octaveOf(midi)}</strong>.`; return;}
  const challenge=accidentalChallenges[accidentalStage]; if(accidentalSelection.length<challenge.length){box.textContent="Ahora toca la segunda nota."; return;}
  if(challenge.test(accidentalSelection)){accidentalStage++; if(accidentalStage===1)setLessonState(4,"practiced"); if(accidentalStage>=3){setLessonState(4,"mastered"); box.className="result-box status-good"; box.innerHTML="<strong>¡Dominado!</strong> Entiendes que ♯ sube, ♭ baja y una tecla puede tener dos nombres.";} else {box.className="result-box status-good"; box.innerHTML=`<strong>Correcto.</strong> Ahora: ${accidentalChallenges[accidentalStage].text}`;} updateAccidentalMission();} else {box.className="result-box status-bad"; box.innerHTML=`<strong>Casi.</strong> ${challenge.text}`;} setTimeout(clearAccidental,650);
});
document.getElementById("startAccidentalMission").addEventListener("click",()=>{accidentalStage=0; clearAccidental(); updateAccidentalMission(); document.getElementById("accidentalResult").className="result-box"; document.getElementById("accidentalResult").textContent=accidentalChallenges[0].text;});
document.getElementById("resetAccidental").addEventListener("click",()=>{clearAccidental(); document.getElementById("accidentalResult").className="result-box"; document.getElementById("accidentalResult").textContent="Selección reiniciada.";});
document.getElementById("playCSharpMajor").addEventListener("click",()=>playChord(buildChordTones(rootById("C#"),"major").map(t=>t.midi)));
document.getElementById("playDFlatMajor").addEventListener("click",()=>playChord(buildChordTones(rootById("Db"),"major").map(t=>t.midi)));
