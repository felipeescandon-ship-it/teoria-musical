import { loadLessonStates, saveLessonStates } from "./storage.js?v=4";

// ========== Navigation and lesson state management ==========
export const LESSON_COUNT=11;
const STATUS_LABELS={not_started:"Sin iniciar",explored:"Explorada",practiced:"Practicada",mastered:"Dominada"};
const STATUS_RANK={not_started:0,explored:1,practiced:2,mastered:3}; // Only upgrades state, never downgrades
// Load persisted lesson states from versioned browser storage (js/storage.js)
let lessonStates=loadLessonStates({1:"not_started",2:"not_started",3:"not_started",4:"not_started",5:"not_started",6:"not_started",7:"not_started",8:"not_started",9:"not_started",10:"not_started",11:"not_started"});
let currentLesson=1;

// The Lab tab needs its own re-render whenever it becomes visible; lab.js registers itself here
// instead of nav.js importing lab.js directly, so there's no import cycle between the two.
let labRenderer=null;
export function registerLabRenderer(fn){ labRenderer=fn; }

// Same pattern for "stop whatever's playing when the user navigates away" — Lesson 9's tempo
// loop (Épica C1) registers itself here instead of nav.js importing lesson09.js directly.
// Fired on every lesson/mode switch (not just switches away from lesson 9): the listener is
// responsible for deciding whether it actually needs to stop anything, which keeps this generic
// enough for future lessons that schedule audio ahead of time to reuse without changes here.
const navigationListeners=[];
export function onNavigate(fn){ navigationListeners.push(fn); }
function notifyNavigation(){ navigationListeners.forEach(fn=>fn()); }

// Upgrade a lesson to a new state (only moves forward: explored → practiced → mastered)
export function setLessonState(n,state) {
  n=Number(n); if(STATUS_RANK[state] <= STATUS_RANK[lessonStates[n]]) return;
  lessonStates[n]=state; saveLessonStates(lessonStates); updateProgress();
}
// Update visual progress bar and lesson link labels
export function updateProgress() {
  document.querySelectorAll(".lesson-link").forEach(btn=>{
    const state=lessonStates[Number(btn.dataset.lesson)]||"not_started";
    btn.classList.remove("explored","practiced","mastered"); if(state!=="not_started") btn.classList.add(state);
    btn.querySelector(".lesson-status").textContent=STATUS_LABELS[state];
  });
  const mastered=Object.values(lessonStates).filter(s=>s==="mastered").length;
  const practiced=Object.values(lessonStates).filter(s=>STATUS_RANK[s]>=2).length;
  document.getElementById("progressFill").style.transform=`scaleX(${mastered/LESSON_COUNT})`;
  document.getElementById("progressSummary").textContent=`${mastered} de ${LESSON_COUNT} dominadas · ${practiced} practicadas`;
}
// Switch to a lesson and update sidebar/content
export function showLesson(n,scroll=true) {
  notifyNavigation();
  currentLesson=Number(n); setLessonState(currentLesson,"explored");
  document.querySelectorAll(".lesson-panel").forEach(p=>p.classList.toggle("active",Number(p.dataset.lessonPanel)===currentLesson));
  document.querySelectorAll(".lesson-link").forEach(b=>b.classList.toggle("active",Number(b.dataset.lesson)===currentLesson));
  updateProgress(); if(scroll) window.scrollTo({top:document.querySelector(".mode-tabs").offsetTop-6,behavior:"smooth"});
}
// ========== Cross-mode origin trail (C2): remember which lesson a "Ir a X" jump came from ==========
const crossBanner=document.getElementById("crossOriginBanner"), crossLessonNum=document.getElementById("crossOriginLessonNum");
let crossOriginLesson=null;
function setCrossOrigin(lessonNum){
  crossOriginLesson=lessonNum;
  if(lessonNum){ crossLessonNum.textContent=lessonNum; crossBanner.hidden=false; }
  else crossBanner.hidden=true;
}
document.getElementById("crossOriginReturn").addEventListener("click",()=>{
  const lessonNum=crossOriginLesson; setCrossOrigin(null); showMode("course"); if(lessonNum) showLesson(lessonNum);
});

// Switch between app modes (course, lab, practice). `originLesson` is set only when the jump
// comes from a lesson's "Ir a..." shortcut, so the banner can offer a way back to that exact spot.
export function showMode(mode,originLesson=null) {
  const btn=document.querySelector(`.mode-tab[data-mode="${mode}"]`); if(!btn) return;
  notifyNavigation();
  document.querySelectorAll(".mode-tab").forEach(b=>b.classList.toggle("active",b===btn));
  document.querySelectorAll(".mode-panel").forEach(p=>p.classList.remove("active"));
  document.getElementById(`mode-${mode}`).classList.add("active");
  setCrossOrigin(originLesson);
  if(mode==="lab") labRenderer?.(false);
  window.scrollTo({top:document.querySelector(".mode-tabs").offsetTop-6,behavior:"smooth"});
}
document.querySelectorAll(".mode-tab").forEach(btn=>btn.addEventListener("click",()=>showMode(btn.dataset.mode)));
document.querySelectorAll(".lesson-link").forEach(btn=>btn.addEventListener("click",()=>showLesson(btn.dataset.lesson)));
document.querySelectorAll(".lesson-next").forEach(btn=>btn.addEventListener("click",()=>showLesson(btn.dataset.next)));
document.querySelectorAll(".lesson-prev").forEach(btn=>btn.addEventListener("click",()=>showLesson(btn.dataset.prev)));
document.getElementById("goToPractice").addEventListener("click",()=>showMode("practice",currentLesson));
document.getElementById("goToFunctionLesson").addEventListener("click",()=>{showMode("course");showLesson(8);});

// ========== Hero collapse (returning users skip the pitch, land on content) ==========
const hero=document.getElementById("hero"), heroToggle=document.getElementById("heroToggle");
function setHeroCompact(compact){
  hero.classList.toggle("compact",compact);
  heroToggle.setAttribute("aria-expanded",String(!compact));
  heroToggle.setAttribute("aria-label",compact?"Mostrar introducción":"Ocultar introducción");
}
const hasAnyProgress=Object.values(lessonStates).some(s=>s!=="not_started");
setHeroCompact(hasAnyProgress);
heroToggle.addEventListener("click",()=>setHeroCompact(!hero.classList.contains("compact")));

// ========== Referencia: floating panel reachable from any mode, not a tab you "enter" ==========
const referenceToggle=document.getElementById("referenceToggle"), referenceOverlay=document.getElementById("referenceOverlay"),
  referenceScrim=document.getElementById("referenceScrim"), referenceClose=document.getElementById("referenceClose");
function openReference(){
  referenceOverlay.hidden=false; referenceToggle.setAttribute("aria-expanded","true");
  referenceClose.focus();
}
function closeReference(){
  if(referenceOverlay.hidden) return;
  referenceOverlay.hidden=true; referenceToggle.setAttribute("aria-expanded","false");
  referenceToggle.focus();
}
referenceToggle.addEventListener("click",openReference);
referenceClose.addEventListener("click",closeReference);
referenceScrim.addEventListener("click",closeReference);
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeReference(); });

updateProgress(); showLesson(1,false);
