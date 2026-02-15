(function(){

/* =========================================================
   CONFIG
========================================================= */

const threshold = 170;
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
   DETECCION DEVTOOLS
========================================================= */

function isDevtoolsOpen(){

  const widthDiff  = Math.abs(window.outerWidth - window.innerWidth);
  const heightDiff = Math.abs(window.outerHeight - window.innerHeight);

  return (widthDiff > threshold || heightDiff > threshold);
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

}, 600);

})();
