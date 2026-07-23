import { rootC, buildChordTones } from "./theory.js?v=3";
import { playChord } from "./audio.js?v=3";

import "./theme.js?v=3";
import "./nav.js?v=3";

import "./lessons/lesson01.js?v=3";
import "./lessons/lesson02.js?v=3";
import "./lessons/lesson03.js?v=3";
import "./lessons/lesson04.js?v=3";
import "./lessons/lesson05.js?v=3";
import "./lessons/lesson06.js?v=3";
import "./lessons/lesson07.js?v=3";
import "./lessons/lesson08.js?v=3";
import "./lessons/lesson09.js?v=3";
import "./lessons/lesson10.js?v=3";
import "./lessons/lesson11.js?v=3";

import "./lab.js?v=3";
import "./practice.js?v=3";
import "./eartraining.js?v=3";

// ========== Reference mode: quick chord-quality demo buttons ==========
document.querySelectorAll(".reference-chord-demo").forEach(b=>b.addEventListener("click",()=>playChord(buildChordTones(rootC,b.dataset.quality).map(t=>t.midi))));
