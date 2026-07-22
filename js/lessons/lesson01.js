import { PC_KEY_LABELS } from "../data.js";
import { octaveOf } from "../theory.js";
import { buildKeyboard, clearKeyboard } from "../keyboard.js";
import { setLessonState } from "../nav.js";

// ========== Lesson 1: Note recognition and octaves ==========
let l1Step=0, firstDoMidi=null;
const l1Tasks=["Encuentra cualquier Do.","Encuentra otro Do en una octava diferente.","Ahora encuentra Mi.","Finalmente encuentra Sol."];
function renderL1Mission(){ document.getElementById("lesson1MissionText").textContent=`${Math.min(l1Step+1,4)} de 4 · ${l1Tasks[Math.min(l1Step,3)]}`; document.getElementById("lesson1Dots").textContent=[0,1,2,3].map(i=>i<l1Step?"●":"○").join(" "); }
function resetL1(){ l1Step=0; firstDoMidi=null; clearKeyboard("courseKeyboard1"); document.getElementById("lesson1Result").className="result-box"; document.getElementById("lesson1Result").textContent="Toca una tecla para comenzar."; renderL1Mission(); }
buildKeyboard("courseKeyboard1",(midi,pc)=>{
  setLessonState(1,"explored"); const box=document.getElementById("lesson1Result"); let correct=false;
  if(l1Step===0 && pc===0){ firstDoMidi=midi; correct=true; }
  else if(l1Step===1 && pc===0 && midi!==firstDoMidi){ correct=true; }
  else if(l1Step===2 && pc===4){ correct=true; }
  else if(l1Step===3 && pc===7){ correct=true; }
  if(correct){ l1Step++; if(l1Step===1)setLessonState(1,"practiced"); box.className="result-box status-good"; box.innerHTML=l1Step>=4?"<strong>¡Dominado!</strong> Reconociste Do en dos octavas, Mi y Sol.":`<strong>Correcto.</strong> Siguiente: ${l1Tasks[l1Step]}`; if(l1Step>=4)setLessonState(1,"mastered"); }
  // Once the mission is done l1Step is 4, past the last task — keep exploring freely instead of
  // scolding with "Aún no" and an out-of-range (undefined) task.
  else if(l1Step>=l1Tasks.length){ box.className="result-box"; box.innerHTML=`Tocaste <strong>${PC_KEY_LABELS[pc]}${octaveOf(midi)}</strong>. Misión completada: explora el teclado libremente.`; }
  else { box.className="result-box status-bad"; box.innerHTML=`<strong>Aún no.</strong> Tocaste ${PC_KEY_LABELS[pc]}${octaveOf(midi)}. ${l1Tasks[l1Step]}`; }
  renderL1Mission();
});
document.getElementById("restartLesson1").addEventListener("click",resetL1); renderL1Mission();
