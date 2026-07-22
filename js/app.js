import { rootC, buildChordTones } from "./theory.js";
import { playChord } from "./audio.js";

import "./theme.js?v=2";
import "./nav.js";

import "./lessons/lesson01.js";
import "./lessons/lesson02.js";
import "./lessons/lesson03.js";
import "./lessons/lesson04.js";
import "./lessons/lesson05.js";
import "./lessons/lesson06.js";
import "./lessons/lesson07.js";
import "./lessons/lesson08.js";
import "./lessons/lesson09.js";
import "./lessons/lesson10.js";
import "./lessons/lesson11.js";

import "./lab.js";
import "./practice.js";
import "./eartraining.js";

// ========== Reference mode: quick chord-quality demo buttons ==========
document.querySelectorAll(".reference-chord-demo").forEach(b=>b.addEventListener("click",()=>playChord(buildChordTones(rootC,b.dataset.quality).map(t=>t.midi))));
