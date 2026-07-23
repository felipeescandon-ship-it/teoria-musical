import { rootById, buildChordTones } from "../theory.js?v=3";
import { playChord } from "../audio.js?v=3";
import { buildKeyboard, highlightChordOnKeyboard } from "../keyboard.js?v=3";
import { setLessonState } from "../nav.js?v=3";

// ========== Lesson 6: Degrees and diatonic chords ==========
function demoChord(id,root,quality,inversion=0,arpeggio=false){ const tones=buildChordTones(root,quality,inversion); highlightChordOnKeyboard(id,tones); playChord(tones.map(t=>t.midi),arpeggio); return tones; }
const DIATONIC_CHORDS = [
  {pc:0, root:"C", quality:"major", roman:"I", name:"Do mayor"},
  {pc:2, root:"D", quality:"minor", roman:"ii", name:"Re menor"},
  {pc:4, root:"E", quality:"minor", roman:"iii", name:"Mi menor"},
  {pc:5, root:"F", quality:"major", roman:"IV", name:"Fa mayor"},
  {pc:7, root:"G", quality:"major", roman:"V", name:"Sol mayor"},
  {pc:9, root:"A", quality:"minor", roman:"vi", name:"La menor"},
  {pc:11, root:"B", quality:"diminished", roman:"vii°", name:"Si disminuido"}
];
let lesson6Explored=new Set();
buildKeyboard("lesson6Keyboard",(midi,pc)=>{
  setLessonState(6,"explored");
  const diatonic=DIATONIC_CHORDS.find(d=>d.pc===pc);
  if(diatonic){
    lesson6Explored.add(pc);
    document.getElementById("lesson6Dots").textContent=[0,1,2,3,4,5,6].map(i=>lesson6Explored.has(DIATONIC_CHORDS[i].pc)?"●":"○").join(" ");
    if(lesson6Explored.size===1)setLessonState(6,"practiced");
    if(lesson6Explored.size===7)setLessonState(6,"mastered");
    const tones=buildChordTones(rootById(diatonic.root),diatonic.quality);
    highlightChordOnKeyboard("lesson6Keyboard",tones);
    playChord(tones.map(t=>t.midi));
    document.getElementById("lesson6Result").className="result-box status-good";
    document.getElementById("lesson6Result").innerHTML=`<strong>Grado ${diatonic.roman}:</strong> ${diatonic.name}. Construido sobre ${diatonic.root}.`;
  }
});
const gradePlayButtons=[
  {id:"playGradeMajor",root:"C",quality:"major"},
  {id:"playGradeMin2",root:"D",quality:"minor"},
  {id:"playGradeMin3",root:"E",quality:"minor"},
  {id:"playGrade4",root:"F",quality:"major"},
  {id:"playGrade5",root:"G",quality:"major"},
  {id:"playGrade6",root:"A",quality:"minor"},
  {id:"playGradeDim7",root:"B",quality:"diminished"}
];
gradePlayButtons.forEach(btn=>{
  document.getElementById(btn.id).addEventListener("click",()=>{
    setLessonState(6,"explored");
    demoChord("lesson6Keyboard",rootById(btn.root),btn.quality);
  });
});
// Play the I–IV–V–I progression to show harmonic function
document.getElementById("playCommonProgression").addEventListener("click",()=>{
  setLessonState(6,"explored");
  const progression=[
    {root:"C",quality:"major"},
    {root:"F",quality:"major"},
    {root:"G",quality:"major"},
    {root:"C",quality:"major"}
  ];
  let delay=0;
  progression.forEach((chord,i)=>{
    const tones=buildChordTones(rootById(chord.root),chord.quality);
    setTimeout(()=>{
      highlightChordOnKeyboard("lesson6Keyboard",tones);
      playChord(tones.map(t=>t.midi));
    },delay);
    delay+=1200;
  });
});
