(function(){

const threshold = 160;
let destroyed = false;

/* =========================================================
   BLOQUEO PERMANENTE COPIAR / CLIC DERECHO
========================================================= */

(function lockBasic(){

  const kill = e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  };

  ["copy","cut","paste","contextmenu","selectstart","dragstart"].forEach(evt=>{
    document.addEventListener(evt, kill, true);
    window.addEventListener(evt, kill, true);
  });

  document.addEventListener("keydown", function(e){

    const k = (e.key || "").toLowerCase();

    if(
      (e.ctrlKey && ["c","x","v","a","u","s","p"].includes(k)) ||
      (e.ctrlKey && e.shiftKey && ["i","j","c"].includes(k)) ||
      k === "f12"
    ){
      kill(e);
    }

  }, true);

  if(document.body){
    document.body.style.userSelect = "none";
  }

})();

/* =========================================================
   DETECCION DEVTOOLS MEJORADA
========================================================= */

function isDevtoolsOpen(){

  const widthDiff  = Math.abs(window.outerWidth - window.innerWidth);
  const heightDiff = Math.abs(window.outerHeight - window.innerHeight);

  // señal 1: diferencia grande
  const sizeCheck = (widthDiff > threshold || heightDiff > threshold);

  // señal 2: debugger timing
  const t0 = performance.now();
  debugger;
  const t1 = performance.now();
  const debugCheck = (t1 - t0 > 100);

  // activar solo si ambas señales coinciden
  return sizeCheck && debugCheck;
}

/* =========================================================
   ACTIVAR PROTECCION TOTAL
========================================================= */

function activateProtection(){

  if(destroyed) return;
  destroyed = true;

  console.clear();
  console.warn("PROTECCION ACTIVADA");

  try {
    Object.defineProperty(window, "fetch", { value: undefined });
    Object.defineProperty(XMLHttpRequest.prototype, "open", { value: function(){} });
  } catch(e){}

  destroyPage();
}

/* =========================================================
   DESTRUIR PAGINA
========================================================= */

function destroyPage(){

  try{
    document.documentElement.innerHTML = "";
  }catch(e){}

  setTimeout(()=>{
    location.replace("about:blank");
  },80);
}

/* =========================================================
   DETECCION CONTINUA
========================================================= */

setInterval(()=>{

  if(isDevtoolsOpen()){
    activateProtection();
  } else if(destroyed){
    location.reload();
  }

}, 800);

})();
