import { ROOTS, FUNCTION_COLOR_VAR, SCALE_ROOT_IDS } from "../data.js?v=3";
import { rootById, buildDiatonicChords, buildChordTones } from "../theory.js?v=3";
import { playChord } from "../audio.js?v=3";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js?v=3";
import { setLessonState } from "../nav.js?v=3";

// ========== Lesson 8: Harmonic function (Tónica/Subdominante/Dominante) ==========
buildKeyboard("functionKeyboard",null,{octaves:2});
const functionKeyRootSelect=document.getElementById("functionKeyRoot");
ROOTS.filter(r=>SCALE_ROOT_IDS.includes(r.id)).forEach(r=>functionKeyRootSelect.add(new Option(`${r.latin} mayor`,r.id)));
functionKeyRootSelect.value="C";
function renderFunctionChords(){
  const root=rootById(functionKeyRootSelect.value);
  const chords=buildDiatonicChords(root);
  const grid=document.getElementById("functionChordsGrid");
  grid.innerHTML=chords.map((c,i)=>`<div class="info-item" style="border-left:4px solid var(--${FUNCTION_COLOR_VAR[c.func]});"><span>${c.roman} · ${c.func}</span><strong>${c.name}</strong><button type="button" class="btn small function-chord-btn" data-index="${i}" style="margin-top:8px;">Oír</button></div>`).join("");
  grid.querySelectorAll(".function-chord-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      setLessonState(8,"explored");
      const c=chords[Number(btn.dataset.index)];
      const tones=buildChordTones(c.root,c.quality);
      highlightChordOnKeyboard("functionKeyboard",tones);
      playChord(tones.map(t=>t.midi));
      document.getElementById("functionResult").className="result-box status-good";
      document.getElementById("functionResult").innerHTML=`<strong>${c.roman} (${c.name}):</strong> función ${c.func}.`;
    });
  });
}
functionKeyRootSelect.addEventListener("change",()=>{setLessonState(8,"explored"); renderFunctionChords();});
renderFunctionChords();
// Ear-training quiz: listen to a diatonic chord in a random key and identify its harmonic function
const FUNCTION_QUIZ_ROOTS=["C","G","F"];
let functionQuizChord=null, functionQuizAnswered=false, functionMissionCorrect=0;
function renderFunctionOptions(){
  const c=document.getElementById("functionOptions"); c.innerHTML="";
  ["Tónica","Subdominante","Dominante"].forEach(fn=>{
    const b=document.createElement("button"); b.className="btn secondary"; b.textContent=fn;
    b.addEventListener("click",()=>answerFunctionQuiz(fn));
    c.appendChild(b);
  });
}
function newFunctionChallenge(){
  setLessonState(8,"explored");
  renderFunctionOptions();
  const root=rootById(FUNCTION_QUIZ_ROOTS[Math.floor(Math.random()*FUNCTION_QUIZ_ROOTS.length)]);
  const chords=buildDiatonicChords(root);
  const chord=chords[Math.floor(Math.random()*chords.length)];
  functionQuizChord={root,chord,tones:buildChordTones(chord.root,chord.quality)};
  functionQuizAnswered=false;
  playChord(functionQuizChord.tones.map(t=>t.midi));
  document.getElementById("functionFeedback").className="result-box";
  document.getElementById("functionFeedback").textContent="Puedes repetir antes de responder.";
  document.getElementById("functionRepeat").disabled=false;
}
function answerFunctionQuiz(answer){
  const box=document.getElementById("functionFeedback");
  if(!functionQuizChord){box.className="result-box status-bad";box.textContent="Primero pulsa “Nuevo acorde”.";return;}
  if(functionQuizAnswered)return;
  functionQuizAnswered=true;
  const correct=answer===functionQuizChord.chord.func;
  box.className=`result-box ${correct?"status-good":"status-bad"}`;
  box.innerHTML=correct?`<strong>¡Correcto!</strong> ${functionQuizChord.chord.roman} (${functionQuizChord.chord.name}) es ${functionQuizChord.chord.func}.`:`<strong>No esta vez.</strong> Era ${functionQuizChord.chord.roman} (${functionQuizChord.chord.name}): ${functionQuizChord.chord.func}.`;
  if(correct){
    functionMissionCorrect++;
    if(functionMissionCorrect===1)setLessonState(8,"practiced");
    document.getElementById("functionMissionDots").textContent=[0,1,2].map(i=>i<Math.min(functionMissionCorrect,3)?"●":"○").join(" ");
    if(functionMissionCorrect>=3){
      setLessonState(8,"mastered");
      document.getElementById("functionMissionText").innerHTML="<strong>¡Dominado!</strong> Reconoces la función armónica de tónica, subdominante y dominante.";
    }
  }
}
document.getElementById("functionNewChallenge").addEventListener("click",newFunctionChallenge);
document.getElementById("functionRepeat").addEventListener("click",()=>functionQuizChord&&playChord(functionQuizChord.tones.map(t=>t.midi)));
renderFunctionOptions();
