
(function(){

/* =========================================================
   CONFIG
========================================================= */

const threshold = 170;
let triggered = false;

/* =========================================================
   DETECCION DEVTOOLS REAL
========================================================= */

function detectDevtools(){

  const widthDiff  = Math.abs(window.outerWidth - window.innerWidth);
  const heightDiff = Math.abs(window.outerHeight - window.innerHeight);

  if((widthDiff > threshold || heightDiff > threshold) && !triggered){
    triggered = true;
    activateProtection();
  }
}

/* =========================================================
   ACTIVAR PROTECCION TOTAL
========================================================= */

function activateProtection(){

  console.clear();
  console.warn("PROTECCION ACTIVADA");

  /* romper APIs */
  try {
    Object.defineProperty(window, "fetch", { value: undefined });
    Object.defineProperty(XMLHttpRequest.prototype, "open", { value: function(){} });
  } catch(e){}

  /* bloquear copiar */
  lockInteractions();

  /* borrar contenido */
  destroyPage();
}

/* =========================================================
   BLOQUEO INTERACCIONES
========================================================= */

function lockInteractions(){

  const kill = e=>{
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  };

  [
    "copy","cut","paste",
    "selectstart","dragstart",
    "contextmenu"
  ].forEach(evt=>{
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
    document.body.style.pointerEvents = "none";
  }
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
  },100);
}

/* =========================================================
   DETECCION CONTINUA
========================================================= */

setInterval(detectDevtools, 600);

})();

