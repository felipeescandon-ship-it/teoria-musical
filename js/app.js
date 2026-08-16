import { rootC, buildChordTones } from "./theory.js?v=3";
import { playChordSmart as playChord } from "./audioSampled.js?v=7";

import "./theme.js?v=3";
import "./nav.js?v=5";

import "./lessons/lesson01.js?v=3";
import "./lessons/lesson02.js?v=6";
import "./lessons/lesson03.js?v=6";
import "./lessons/lesson04.js?v=6";
import "./lessons/lesson05.js?v=6";
import "./lessons/lesson06.js?v=6";
import "./lessons/lesson07.js?v=6";
import "./lessons/lesson08.js?v=7";
import "./lessons/lesson09.js?v=6";
import "./lessons/lesson10.js?v=6";
import "./lessons/lesson11.js?v=7";

import "./lab.js?v=7";
import "./practice.js?v=6";
import "./eartraining.js?v=7";

// ========== Reference mode: quick chord-quality demo buttons ==========
document.querySelectorAll(".reference-chord-demo").forEach(b=>b.addEventListener("click",()=>playChord(buildChordTones(rootC,b.dataset.quality).map(t=>t.midi))));

// ========== PWA: cache piano samples + app shell on-device (service-worker.js) ==========
// Registers immediately rather than waiting for the "load" event: this module script already
// runs after the HTML is parsed (deferred by default), and on a fast/cached load that event can
// fire before this listener even attaches — which would silently skip registration forever.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
