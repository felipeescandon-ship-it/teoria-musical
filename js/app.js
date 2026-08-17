import { rootC, buildChordTones } from "./theory.js?v=4";
import { playChordSmart as playChord } from "./audioSampled.js?v=7";

import "./theme.js?v=5";
import "./nav.js?v=7";
import "./keyZoom.js?v=2";
import "./stats.js?v=1";

import "./lessons/lesson01.js?v=5";
import "./lessons/lesson02.js?v=8";
import "./lessons/lesson03.js?v=8";
import "./lessons/lesson04.js?v=8";
import "./lessons/lesson05.js?v=8";
import "./lessons/lesson06.js?v=8";
import "./lessons/lesson07.js?v=8";
import "./lessons/lesson08.js?v=9";
import "./lessons/lesson09.js?v=9";
import "./lessons/lesson10.js?v=9";
import "./lessons/lesson11.js?v=9";

import "./lab.js?v=9";
import "./practice.js?v=7";
import "./eartraining.js?v=8";

// ========== Reference mode: quick chord-quality demo buttons ==========
document.querySelectorAll(".reference-chord-demo").forEach(b=>b.addEventListener("click",()=>playChord(buildChordTones(rootC,b.dataset.quality).map(t=>t.midi))));

// ========== PWA: cache piano samples + app shell on-device (service-worker.js) ==========
// Registers immediately rather than waiting for the "load" event: this module script already
// runs after the HTML is parsed (deferred by default), and on a fast/cached load that event can
// fire before this listener even attaches — which would silently skip registration forever.
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
