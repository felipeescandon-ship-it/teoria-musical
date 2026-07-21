import { PC_KEY_LABELS, PC_KEY_SHORT } from "./data.js";
import { startHeldMidi, stopHeldMidi } from "./audio.js";

// ========== Piano keyboard and interaction ==========
const keyboards = new Map(); // Global registry of keyboard instances
// Bind pointer and audio events to a single key (white or black)
export function bindKeyInteraction(id, key, midi, pc, onTrigger) {
  const token = `${id}:${midi}`;
  const press = event => {
    event.preventDefault();
    key.classList.add("pressed");
    startHeldMidi(token, midi);
    onTrigger?.(midi, pc, key);
  };
  const release = () => { key.classList.remove("pressed"); stopHeldMidi(token); };
  key.addEventListener("pointerdown", press);
  key.addEventListener("pointerup", release);
  key.addEventListener("pointercancel", release);
  key.addEventListener("pointerleave", release);
  key.addEventListener("contextmenu", e => e.preventDefault());
}
// Build a visual piano keyboard with white and black keys, mapped to MIDI notes
export function buildKeyboard(id, onTrigger, options={}) {
  const container = document.getElementById(id);
  if (!container) return null;
  const startMidi = options.startMidi || 48; // Start at C3 by default
  const octaves = options.octaves || 2;
  const whitePattern = [0,2,4,5,7,9,11]; // White keys: Do, Re, Mi, Fa, Sol, La, Si
  const blackAfterWhite = {0:1,1:3,3:6,4:8,5:10}; // Black keys positioned after specific white keys
  const keyMap = new Map(); // MIDI → DOM key element
  container.innerHTML = "";
  const whiteContainer = document.createElement("div");
  whiteContainer.className = "white-keys";
  container.appendChild(whiteContainer);
  // Generate white keys
  for (let octave=0; octave<octaves; octave++) {
    whitePattern.forEach(pc => {
      const midi = startMidi + octave*12 + pc;
      const key = document.createElement("button");
      key.type = "button"; key.className = "key white"; key.dataset.midi = midi; key.dataset.pc = pc;
      key.innerHTML = `<span>${PC_KEY_LABELS[pc]}<br><small>${PC_KEY_SHORT[pc]}</small></span>`;
      bindKeyInteraction(id,key,midi,pc,onTrigger); whiteContainer.appendChild(key); keyMap.set(midi,key);
    });
  }
  // Final Do (octave boundary)
  const finalMidi = startMidi + octaves*12;
  const finalKey = document.createElement("button");
  finalKey.type="button"; finalKey.className="key white"; finalKey.dataset.midi=finalMidi; finalKey.dataset.pc=0;
  finalKey.innerHTML='<span>Do<br><small>C</small></span>';
  bindKeyInteraction(id,finalKey,finalMidi,0,onTrigger); whiteContainer.appendChild(finalKey); keyMap.set(finalMidi,finalKey);
  // Generate black keys (positioned absolutely between white keys)
  const totalWhite = octaves*7+1;
  let globalWhite=0;
  for (let octave=0; octave<octaves; octave++) {
    whitePattern.forEach((pc,i) => {
      if (blackAfterWhite[i] !== undefined) {
        const blackPc=blackAfterWhite[i], midi=startMidi+octave*12+blackPc;
        const key=document.createElement("button");
        key.type="button"; key.className="key black"; key.dataset.midi=midi; key.dataset.pc=blackPc;
        key.style.left=`${((globalWhite+1)/totalWhite)*100}%`;
        key.innerHTML=`<span>${PC_KEY_LABELS[blackPc]}<br><small>${PC_KEY_SHORT[blackPc]}</small></span>`;
        bindKeyInteraction(id,key,midi,blackPc,onTrigger); container.appendChild(key); keyMap.set(midi,key);
      }
      globalWhite++;
    });
  }
  const obj={container,keyMap,startMidi,octaves,onTrigger}; keyboards.set(id,obj); return obj;
}
// Remove all visual highlighting classes from a keyboard
export function clearKeyboard(id) {
  const kb=keyboards.get(id); if(!kb) return;
  const classes=["role-0","role-1","role-2","role-3","interval-start","interval-end","correct","wrong","selected"];
  kb.keyMap.forEach(k=>k.classList.remove(...classes));
}
// Find a MIDI note in the keyboard that matches the pitch class (pc), preferring notes near a target
export function findVisibleMidi(kb,pc,preferred=60) {
  const candidates=[...kb.keyMap.keys()].filter(m=>((m%12)+12)%12===pc);
  return candidates.sort((a,b)=>Math.abs(a-preferred)-Math.abs(b-preferred))[0] ?? null;
}
// Highlight chord notes on keyboard with role-based colors (root, 3rd, 5th, 7th)
export function highlightChordOnKeyboard(id,tones) {
  clearKeyboard(id); const kb=keyboards.get(id); if(!kb) return;
  tones.forEach(t=>{ const key=kb.keyMap.get(t.midi)||kb.keyMap.get(findVisibleMidi(kb,t.pc,t.midi)); key?.classList.add(`role-${Math.min(t.role,3)}`); });
}
// Highlight specific MIDI notes by role (used for voice leading demonstrations)
export function highlightMidiRoles(id,items) {
  clearKeyboard(id); const kb=keyboards.get(id); if(!kb) return;
  items.forEach(({midi,role})=>kb.keyMap.get(midi)?.classList.add(`role-${Math.min(role,3)}`));
}
// Toggle pitch class selection (for building chord missions)
export function togglePcSelection(id,set,pc) {
  const kb=keyboards.get(id); if(!kb) return;
  if(set.has(pc)) set.delete(pc); else set.add(pc);
  kb.keyMap.forEach(k=>{ if(Number(k.dataset.pc)===pc) k.classList.toggle("selected",set.has(pc)); });
}
export function getKeyboard(id) { return keyboards.get(id); }

// ========== Computer keyboard support ==========
// Map computer keys A-K to piano keys (starting from the 2nd octave): A=C, W=C#, S=D, etc.
const COMPUTER_KEYS=["a","w","s","e","d","f","t","g","y","h","u","j","k"];
const computerHeld=new Map();
export function activeKeyboard() {
  const visible=[...document.querySelectorAll(".keyboard")].filter(el=>el.offsetParent!==null);
  return visible.length ? keyboards.get(visible[0].id) : null;
}
// Enable piano playing via computer keyboard (only if input field not focused)
document.addEventListener("keydown",e=>{
  if(e.repeat || ["INPUT","SELECT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
  const offset=COMPUTER_KEYS.indexOf(e.key.toLowerCase()); if(offset<0) return;
  const kb=activeKeyboard(); if(!kb) return;
  const midi=kb.startMidi+12+offset; const key=kb.keyMap.get(midi); if(!key) return;
  e.preventDefault(); const token=`computer:${e.key.toLowerCase()}`; computerHeld.set(e.key.toLowerCase(),{token,key});
  key.classList.add("pressed"); startHeldMidi(token,midi); kb.onTrigger?.(midi,Number(key.dataset.pc),key);
});
document.addEventListener("keyup",e=>{
  const item=computerHeld.get(e.key.toLowerCase()); if(!item) return;
  item.key.classList.remove("pressed"); stopHeldMidi(item.token); computerHeld.delete(e.key.toLowerCase());
});
